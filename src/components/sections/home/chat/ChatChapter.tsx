import type { SectionProps } from '@/i18n/types';
import { Section, Eyebrow, StickySteps, ScreenNote, Icon } from '@/components/site';
import { ScreenSlice } from '@/components/mockups/kit';
import { Conversation04 } from '@/components/mockups/fan/Conversation04';
import { StoryFlow04to03b } from '@/components/mockups/fan/StoryFlow04to03b';
import { Memory06 } from '@/components/mockups/fan/Memory06';
import { Units } from '@/lib/units';
import { ChatMicro } from './ChatMicro.client';
import s from './chat.module.css';

/**
 * #chat: 03 チャット, 昼休みは、チャットの続き。 (spec §5.6).
 * Desktop: header block, then StickySteps (steps left, sticky phone right) on
 * a rounded teal band; each step swaps the phone screen (fade / push / fade)
 * and ChatMicro plays that screen's micro-sequence once per activation.
 * Mobile: a 3-card carousel with cropped ScreenSlices.
 * Reduced motion / no JS: every screen shows its final state.
 */
export function ChatChapter({ d, lang }: SectionProps) {
  const t = d.home.chat;
  const m = d.mock.fan;

  const slice = (key: 'chat' | 'stories' | 'memory', crop: { y: number; h: number }, label: string, node: React.ReactNode) => (
    <div className={s.slice} data-chat-slice={key}>
      <ScreenSlice label={label} width={{ mobile: 300 }} crop={crop} radius={24}>
        {node}
      </ScreenSlice>
    </div>
  );

  const body = (text: string) => <p className={s.stepBody}>{text}</p>;

  return (
    <Section id="chat" surface="day" labelledBy="chat-title" className={s.section}>
      <div className="container-site">
        <header className={s.head}>
          <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
          <h2 id="chat-title" className={`t-h2 ${s.title}`}>
            <Units text={t.title} lang={lang} mode="phrase" />
          </h2>
          <p className={`t-lead ${s.lead}`}>{t.lead}</p>
        </header>
      </div>

      <div className={s.band} data-chat-root="">
        <div className={`container-site ${s.bandInner}`}>
          <StickySteps
            id="chat-steps"
            side="right"
            phoneSize={{ desktop: 340 }}
            phoneLabel={t.stageAlt}
            stepMinHeight="55svh"
            transition={['fade', 'push', 'fade']}
            carouselLabel={t.title}
            d={d}
            steps={[
              {
                id: 'chat-step',
                label: t.steps.chat.label,
                title: t.steps.chat.title,
                body: body(t.steps.chat.body),
                mobileSlice: slice('chat', { y: 112, h: 540 }, m.conversation.alt, <Conversation04 d={d} lang={lang} persona="oshi" />),
              },
              {
                id: 'stories',
                label: t.steps.stories.label,
                title: t.steps.stories.title,
                body: body(t.steps.stories.body),
                mobileSlice: slice('stories', { y: 120, h: 560 }, m.story.alt, <StoryFlow04to03b d={d} lang={lang} persona="oshi" />),
              },
              {
                id: 'memory',
                label: t.steps.memory.label,
                title: t.steps.memory.title,
                body: body(t.steps.memory.body),
                mobileSlice: slice('memory', { y: 80, h: 560 }, m.memory.alt, <Memory06 d={d} lang={lang} persona="oshi" />),
              },
            ]}
            screens={[
              <Conversation04 key="c" d={d} lang={lang} persona="oshi" />,
              <StoryFlow04to03b key="s" d={d} lang={lang} persona="oshi" />,
              <Memory06 key="m" d={d} lang={lang} persona="oshi" />,
            ]}
          />
          <p className={`t-small ${s.swipe}`} aria-hidden="true">
            <Icon name="arrow_forward" size={16} />
            {t.swipeHint}
          </p>
          <div className={s.notes}>
            <p className={`t-small ${s.footnote}`}>
              <Icon name="auto_awesome" size={16} />
              <span>{t.steps.stories.footnote}</span>
            </p>
            <ScreenNote d={d} />
          </div>
        </div>
        <ChatMicro nickname={d.personas.fan.nickname} />
      </div>
    </Section>
  );
}
