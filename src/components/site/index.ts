// Barrel for §4 primitives (exports contract, spec §11). Server components
// import from '@/components/site'. Client components must import the file
// they need directly: this barrel also re-exports server-only modules
// (QrBlock → qrcode, ScrollFillText → BudouX).

export { Header } from './header/Header';
export { LangPill } from './header/LangPill';
export { Footer } from './footer/Footer';
export { SkipLink } from './SkipLink';
export { MobileDownloadBar } from './download/MobileDownloadBar';
export { QrDockShell } from './download/QrDockShell';
export { StoreBadges } from './download/StoreBadges';
export { StudioStoreCTA } from './download/StudioStoreCTA';
export { QrBlock } from './download/QrBlock';
export { FrictionList } from './download/FrictionList';
export { MailtoButton } from './download/MailtoButton';
export { CopyEmail } from './download/CopyEmail.client';
export { Disclosure } from './Disclosure';
export { ScreenNote } from './ScreenNote';
export { Section, type SurfaceToken } from './Section';
export { Eyebrow } from './Eyebrow';
export { ScrollFillText, type ScrollFillTextProps } from './fill/ScrollFillText';
export { CaptionMarker } from './fill/CaptionMarker.client';
export { Sticker } from './Sticker';
export { GlassCard } from './GlassCard';
export { Button, ButtonLink } from './Button';
export { Carousel } from './Carousel';
export { StickySteps, type StickyStep, type StickyStepsProps } from './steps/StickySteps';
export { ExpandStage, type ExpandStageProps } from './stage/ExpandStage';
export { Icon, type IconName } from './icons/Icon';
export { Aura, type AuraShape } from './aura/Aura';
export { CreatorImage } from './aura/CreatorImage';
export { Scene } from './aura/Scene';
export { Ring } from './aura/Ring';
export { Waveform } from './wave/Waveform';
export { CallGlow } from './glow/CallGlow';
export { Marquee } from './marquee/Marquee';
export { RevealGroup } from '@/lib/motion/reveal.client';
export { FaqList, type FaqItem } from './faq/FaqList';
export { InViewObserver } from './InViewObserver.client';
