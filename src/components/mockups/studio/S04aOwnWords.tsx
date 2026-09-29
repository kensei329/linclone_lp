import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { cx, SetupFooter, Spinner, StepHead } from './parts';
import s from './studio.module.css';

/**
 * S5 `S04aOwnWords` (spec §7.2, source s04a-about-you): WRITE MODE ONLY. No
 * interview segment, no blog/stream links (Wikipedia and YouTube only).
 *
 * Hooks: `[data-m="text"]` holds `words.sample` (the micro types it);
 * `[data-m="link-wiki"]` / `[data-m="link-yt"]` rows carry
 * `data-state="analyzing" | "analyzed"` (SSR `analyzed`), which swaps the
 * gold spinner chip for the cyan ✓ chip. Crop `{y:100,h:620}`.
 */
export function S04aOwnWords({ d, className }: MockProps) {
  const w = d.mock.studio.words;
  const links = [
    { hook: 'link-wiki', label: w.linkWiki },
    { hook: 'link-yt', label: w.linkYoutube },
  ];
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, className)} data-mock="S04aOwnWords">
        <StepHead d={d} active={1} title={w.title} />
        <div className={s.words}>
          <div className={s.tintCyan}>
            <span className={s.tintTitle}>{w.coverTitle}</span>
            <ul className={s.bullets}>
              <li>{w.cover.c1}</li>
              <li>{w.cover.c2}</li>
              <li>{w.cover.c3}</li>
            </ul>
          </div>
          <div className={s.tintViolet}>
            <Icon name="psychology" filled size={17} />
            <span className={s.tintText}>{w.reassurance}</span>
          </div>
          <div className={s.textarea}>
            <span data-m="text">{w.sample}</span>
            <span className={s.caret} data-loop="" />
          </div>
          <div className={s.links}>
            <span className={s.label12}>{w.linksTitle}</span>
            {links.map((l) => (
              <div key={l.hook} className={cx(s.gcard, s.linkRow)} data-m={l.hook} data-state="analyzed">
                <Icon name="link" size={18} />
                <span className={s.linkName}>{l.label}</span>
                <span className={s.linkState}>
                  <span className={s.stAnalyzing}>
                    <Spinner />
                    {w.analyzing}
                  </span>
                  <span className={s.stAnalyzed}>{w.analyzed}</span>
                </span>
              </div>
            ))}
          </div>
          <span className={s.note10}>{w.proposalNote}</span>
        </div>
        <SetupFooter d={d} />
      </div>
    </Screen>
  );
}
