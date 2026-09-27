import { Plus_Jakarta_Sans, Space_Grotesk, Noto_Sans_JP, Poppins } from 'next/font/google';

// next/font instances (spec §3.6). Self-hosted at build time; the CSS
// variables feed the font stacks in src/styles/site.css.
export const pjs = Plus_Jakarta_Sans({ subsets: ['latin'], weight: 'variable', variable: '--font-pjs', display: 'swap', preload: true, adjustFontFallback: true });
export const sg = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-sg', display: 'swap', preload: false });
export const notoJp = Noto_Sans_JP({
  subsets: ['latin'], weight: 'variable', variable: '--font-noto-jp', display: 'swap', preload: false,
  fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', 'sans-serif'],
}); // self-hosted unicode-range slices, fetched on demand
export const poppins = Poppins({ subsets: ['latin'], weight: '600', variable: '--font-poppins', display: 'swap', preload: true }); // wordmark only

/** className for <html>: exposes all four font variables. */
export const fontVariables = [pjs.variable, sg.variable, notoJp.variable, poppins.variable].join(' ');
