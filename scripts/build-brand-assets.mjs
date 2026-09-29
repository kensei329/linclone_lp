#!/usr/bin/env node
// Brand rasters from assets-src/brand (the LinClone logo package) plus the
// hero/aura noise texture. Output is committed; re-run with `npm run brand`.
//
//   public/brand/mark-{56,64,128,256,512}.png  mark on transparent, square
//   public/brand/mark-white-256.png          one-colour white mark (dark surfaces)
//   public/brand/logo-512.png                mark on white (JSON-LD Organization.logo)
//   public/brand/appicon-{180,512}.png       store icon tile (+ appicon-512.webp)
//   src/app/icon.png (512), apple-icon.png (180), favicon.ico (16/32/48)
//   public/textures/noise-128.png            ≤2 KB grain tile
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets-src/brand');
const BRAND = join(ROOT, 'public/brand');
const APP = join(ROOT, 'src/app');
const TEXTURES = join(ROOT, 'public/textures');

const MARK = join(SRC, 'mark/linclone-mark-full.png');
const MARK_WHITE = join(SRC, 'mark/linclone-mark-mono-white.png');
const APPICON = join(SRC, 'app-icon/appicon-1024.png');
const APPICON_48 = join(SRC, 'app-icon/appicon-48.png');
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
// Lossless: `effort`/`palette` would switch sharp to quantised palette output.
const PNG = { compressionLevel: 9, adaptiveFiltering: true };

mkdirSync(BRAND, { recursive: true });
mkdirSync(TEXTURES, { recursive: true });

const square = (src, size, background = CLEAR) =>
  sharp(src).resize(size, size, { fit: 'contain', background, kernel: 'lanczos3' });

async function out(pipeline, file) {
  await pipeline.png(PNG).toFile(file);
  console.log(`${file.slice(ROOT.length + 1)} ${(statSync(file).size / 1024).toFixed(1)} KB`);
}

// 56 = the 28px header mark at 2×.
for (const size of [56, 64, 128, 256, 512]) await out(square(MARK, size), join(BRAND, `mark-${size}.png`));
await out(square(MARK_WHITE, 256), join(BRAND, 'mark-white-256.png'));

// Mark centred on white with ~12% padding, flattened (no alpha) for crawlers.
const logoMark = await square(MARK, 400).png().toBuffer();
await out(
  sharp({ create: { width: 512, height: 512, channels: 3, background: '#ffffff' } }).composite([{ input: logoMark, gravity: 'center' }]),
  join(BRAND, 'logo-512.png'),
);

await out(square(APPICON, 180), join(BRAND, 'appicon-180.png'));
await out(square(APPICON, 512), join(BRAND, 'appicon-512.png'));
// WebP sibling for on-page use (≈7 KB vs ≈210 KB); the PNG stays for crawlers and old links.
await square(APPICON, 512).webp({ quality: 82 }).toFile(join(BRAND, 'appicon-512.webp'));
await out(square(APPICON, 512), join(APP, 'icon.png'));
await out(square(APPICON, 180), join(APP, 'apple-icon.png'));

// favicon.ico: ICO container with embedded PNG images (Vista+ / all browsers).
const icoSizes = [16, 32, 48];
const images = await Promise.all(
  icoSizes.map((s) => (s === 48 ? sharp(APPICON_48) : square(APPICON_48, s)).png(PNG).toBuffer()),
);
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(icoSizes[i] % 256, e); // width (0 = 256)
  header.writeUInt8(icoSizes[i] % 256, e + 1); // height
  header.writeUInt8(0, e + 2); // palette colours
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
const ico = join(APP, 'favicon.ico');
writeFileSync(ico, Buffer.concat([header, ...images]));
console.log(`${ico.slice(ROOT.length + 1)} ${(statSync(ico).size / 1024).toFixed(1)} KB`);

// Noise: sparse monochrome grain from a seeded PRNG (deterministic output).
// Black and white specks on transparent, 2-bit palette, so the tile stays ≤2 KB.
let seed = 0x9e3779b9;
const rand = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 4294967296;
};
const N = 128;
const px = Buffer.alloc(N * N * 4);
for (let i = 0; i < N * N; i++) {
  const r = rand();
  if (r < 0.07) px.set([0, 0, 0, 255], i * 4);
  else if (r < 0.14) px.set([255, 255, 255, 255], i * 4);
}
const noise = join(TEXTURES, 'noise-128.png');
await sharp(px, { raw: { width: N, height: N, channels: 4 } })
  .png({ palette: true, colours: 4, dither: 0, compressionLevel: 9, effort: 10 })
  .toFile(noise);
const noiseSize = statSync(noise).size;
console.log(`${noise.slice(ROOT.length + 1)} ${(noiseSize / 1024).toFixed(2)} KB`);
if (noiseSize > 2048) throw new Error('noise-128.png exceeds the 2 KB budget');
