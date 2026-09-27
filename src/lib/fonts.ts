import { Plus_Jakarta_Sans, Space_Grotesk, Poppins } from 'next/font/google';

// next/font instances (spec §3.6). Self-hosted at build time; the CSS
// variables feed the font stacks in src/styles/site.css.
//
// Japanese has no web font for body text: JA body, labels and mockups use the
// system Japanese faces (Hiragino / Noto Sans CJK / Yu Gothic / Meiryo), and JA
// display headlines use the self-hosted "LC JP Headline" subset (one 800 face,
// scripts/build-ja-headline-font.mjs), preloaded only on JA pages.
export const pjs = Plus_Jakarta_Sans({ subsets: ['latin'], weight: 'variable', variable: '--font-pjs', display: 'swap', preload: true, adjustFontFallback: true });
export const sg = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-sg', display: 'swap', preload: false });
export const poppins = Poppins({ subsets: ['latin'], weight: '600', variable: '--font-poppins', display: 'swap', preload: true }); // wordmark only

/** className for <html>: exposes the font variables. */
export const fontVariables = [pjs.variable, sg.variable, poppins.variable].join(' ');

/** The JA headline subset (spec §3.6); `site.css` declares it as "LC JP Headline". */
export const JA_HEADLINE_FONT = '/fonts/NotoSansJP-Headline.woff2';
