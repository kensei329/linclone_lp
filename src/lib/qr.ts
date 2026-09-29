import 'server-only';
import QRCode from 'qrcode';

/** Inline SVG markup for a QR code, rendered at build time (spec §4.2 QrBlock). */
export async function qrSvg(url: string, size = 132): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 0,
    width: size,
    color: { dark: '#28273bff', light: '#ffffffff' },
  });
}
