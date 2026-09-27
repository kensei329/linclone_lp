import './fan.css';
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { PERSONAS, type PersonaId } from '@/lib/personas';
import { Icon, type IconName } from '@/components/site';
import { CoinPill, RingAvatar, VerifiedMark } from '@/components/mockups/kit';
import { GOOGLE_G_PARTS } from '@/components/site/icons/brand';

/**
 * Private helpers shared by the fan mockups (WP4). Not part of the exports
 * contract: sections import the mockups, never these.
 */

export type PersonaKey = PersonaId | 'oshi';

/** Resolved persona copy + colour. `'oshi'` is Yuzu painted in the fan's 推し色 (`var(--oshi)`). */
export function personaOf(d: Dictionary, p: PersonaKey = 'oshi') {
  const id: PersonaId = p === 'oshi' ? 'yuzu' : p;
  const t = d.personas[id];
  return { key: p, id, name: t.name, genre: t.genre, tags: t.tags, color: p === 'oshi' ? 'var(--oshi)' : PERSONAS[id].color };
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** CSS custom properties as a style object (keeps call sites terse). */
export const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Dictionary strings may carry `\n` (only `mock.fan.welcome.*`): render as `<br>`. */
export function Lines({ text }: { text: string }) {
  const parts = text.split('\n');
  return (
    <>
      {parts.map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/** The LinClone mark as a CSS background (no <img>, nothing to announce). */
export function Mark({ size = 24, tone = 'white' }: { size?: number; tone?: 'white' | 'color' }) {
  return <span className="fm-mark" data-tone={tone} style={{ width: size, height: size }} />;
}

/** Mark + wordmark, as on the app's night screens. */
export function BrandRow({ brand, top, right }: { brand: string; top: number; right?: ReactNode }) {
  return (
    <div className="fm-brandrow" style={{ top }}>
      <span className="fm-brandrow-lockup">
        <Mark size={24} />
        <span className="wordmark">{brand}</span>
      </span>
      {right}
    </div>
  );
}

/** App RoundIcon: 34px frosted disc (white .88 on cream, white 14% on night). */
export function RoundIcon({ icon, size = 34, theme = 'cream', filled = false, dot = false }: { icon: IconName; size?: number; theme?: 'cream' | 'night'; filled?: boolean; dot?: boolean }) {
  return (
    <span className="fm-round" data-theme={theme} style={{ width: size, height: size }}>
      <Icon name={icon} size={Math.round(size * 0.56)} filled={filled} />
      {dot ? <span className="fm-round-dot" /> : null}
    </span>
  );
}

/** Stacked screen header: back · title (+ tiny persona caption) · right cluster. */
export function ScreenHeader({ title, caption, right, back = true }: { title: string; caption?: string; right?: ReactNode; back?: boolean }) {
  return (
    <div className="fm-hdr">
      {back ? (
        <span className="fm-hdr-back">
          <Icon name="arrow_back" size={24} />
        </span>
      ) : null}
      <span className="fm-hdr-titles">
        <span className="fm-hdr-title">{title}</span>
        {caption ? <span className="fm-hdr-caption">{caption}</span> : null}
      </span>
      {right ? <span className="fm-hdr-right">{right}</span> : null}
    </div>
  );
}

/** Night call backdrop: the persona aura as a soft full-bleed field (replaces the app's blurred photo; no filter). */
export function CallBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="fm-callbg" aria-hidden="true">
      {children}
      <span className="fm-callbg-scrim" />
    </div>
  );
}

/** Neutral figure placeholder (spec §7.0: never a number). */
export function Bar({ w, h = 8, tone = 'ink' }: { w: number | string; h?: number; tone?: 'ink' | 'white' }) {
  return <span className="fm-bar" data-tone={tone} style={{ width: w, height: h }} />;
}

/**
 * In-mockup glass card (the kit's `.glass-mock` look) that also takes data-*
 * hooks, so animators can move the whole card. Never uses backdrop-filter.
 */
export function Card({ radius = 16, tone = 'light', className, children, style, ...rest }: { radius?: number; tone?: 'light' | 'night'; className?: string; children?: ReactNode; style?: CSSProperties } & Record<`data-${string}`, string | undefined>) {
  return (
    <div className={cx('glass-mock', className)} data-tone={tone} style={{ borderRadius: radius, ...style }} {...rest}>
      {children}
    </div>
  );
}

/** Chat header shared by F6 and the F7 create sub-screen: back · story-ring avatar + online dot · name ✓ · coin · bell · menu. */
export function ChatHeader({ d, persona }: { d: Dictionary; persona: PersonaKey }) {
  const p = personaOf(d, persona);
  return (
    <div className="fm-chathdr">
      <span className="fm-hdr-back">
        <Icon name="arrow_back" size={24} />
      </span>
      <span className="fm-chathdr-av">
        <RingAvatar persona={persona} size={48} ring="story" />
        <span className="fm-online" />
      </span>
      <span className="fm-chathdr-name">
        {p.name}
        <VerifiedMark size={16} />
      </span>
      <span className="fm-hdr-right">
        <CoinPill theme="cream" />
        <RoundIcon icon="notifications" dot />
        <RoundIcon icon="menu" />
      </span>
    </div>
  );
}

/** Two step dots (no "1/2" numerals). */
export function StepDots({ active }: { active: 0 | 1 }) {
  return (
    <span className="fm-steps">
      <i data-on={active === 0 ? '' : undefined} />
      <i data-on={active === 1 ? '' : undefined} />
    </span>
  );
}

/** The four-colour Google "G" (official mark colours; this mockup only). */
export function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" focusable="false">
      {GOOGLE_G_PARTS.map((p) => (
        <path key={p.fill} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}
