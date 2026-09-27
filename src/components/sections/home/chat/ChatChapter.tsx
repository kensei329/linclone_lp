import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

const STEPS = [
  ['chat-step', 'chat'],
  ['stories', 'stories'],
  ['memory', 'memory'],
] as const;

/** #chat: 03 チャット (spec §5.6). STUB (WP0a), owned by WP2: replace wholesale. */
export function ChatChapter({ d, lang }: SectionProps) {
  const t = d.home.chat;
  return (
    <Section id="chat" surface="day" labelledBy="chat-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="chat-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
      {STEPS.map(([id, key]) => (
        <div key={id} id={id}>
          <h3 className="t-h3">{t.steps[key].title}</h3>
          <p className="t-body">{t.steps[key].body}</p>
        </div>
      ))}
    </Section>
  );
}
