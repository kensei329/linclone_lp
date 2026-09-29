import { Fragment } from 'react';
import type { SectionProps } from '@/i18n/types';
import { Carousel, ScreenNote, Icon } from '@/components/site';
import { PhoneFrame, ScreenSlice } from '@/components/mockups/kit';
import { LiveRequest12 } from '@/components/mockups/fan/LiveRequest12';
import { LiveSetup13 } from '@/components/mockups/fan/LiveSetup13';
import { ShowPreview14 } from '@/components/mockups/fan/ShowPreview14';
import { ArchiveCard11 } from '@/components/mockups/fan/ArchiveCard11';
import { Units } from '@/lib/units';
import { LiveRequestMicro } from './LiveRequestMicro.client';
import s from './live.module.css';

/** Connector nodes: centres of the three columns in the 1200-wide viewBox. */
const NODES = [200, 600, 1000] as const;

/**
 * #live-request (spec §5.7): request a show → the AI writes the rundown →
 * the preview, linked by a drawn connector (desktop), then the archive.
 * Mobile: a 4-item carousel (request card, setup slice, preview slice, archive).
 */
export function LiveRequestRow({ d, lang }: SectionProps) {
  const t = d.home.live;
  const m = d.mock.fan;

  const request = (
    <div className={s.reqCard} data-req-root="request">
      <LiveRequest12 d={d} lang={lang} persona="kai" />
    </div>
  );
  const archive = (
    <div className={s.archiveCard} data-req-root="archive">
      <ArchiveCard11 d={d} lang={lang} persona="kai" />
    </div>
  );

  return (
    <div id="live-request" className={s.request} data-live-request="">
      <div className="container-site">
        <div className={s.reqHead}>
          <h3 className={`t-h3 ${s.reqTitle}`}>
            <Units text={t.requestTitle} lang={lang} mode="phrase" />
          </h3>
          <p className={`t-body ${s.reqBody}`}>{t.requestBody}</p>
        </div>

        {/* desktop: three columns joined by a drawn connector */}
        <div className={s.flow}>
          <svg className={s.connector} viewBox="0 0 1200 48" aria-hidden="true" focusable="false">
            <path className={s.connectorTrack} d="M200 24 C 400 -4, 400 52, 600 24 S 800 -4, 1000 24" />
            <path className={s.connectorLine} data-connector="" pathLength={1} d="M200 24 C 400 -4, 400 52, 600 24 S 800 -4, 1000 24" />
          </svg>
          <ol className={s.nodes} aria-hidden="true">
            {NODES.map((x, i) => (
              <li key={x} className={s.node} data-node={i} style={{ left: `${(x / 1200) * 100}%` }} />
            ))}
          </ol>
          <div className={s.cols}>
            <div className={s.col}>{request}</div>
            <div className={s.col} data-req-root="setup">
              <PhoneFrame size={{ mobile: 300, desktop: 300 }} label={m.liveSetup.alt}>
                <LiveSetup13 d={d} lang={lang} persona="kai" />
              </PhoneFrame>
            </div>
            <div className={s.col} data-req-root="preview">
              <PhoneFrame size={{ mobile: 300, desktop: 300 }} label={m.showPreview.alt}>
                <ShowPreview14 d={d} lang={lang} persona="kai" />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>

      {/* mobile: carousel */}
      <div className={s.reqCarousel}>
        <Carousel
          label={t.requestTitle}
          d={d}
          items={[
            <Fragment key="request">{request}</Fragment>,
            <div key="setup" className={s.reqSlice} data-req-root="setup">
              <ScreenSlice label={m.liveSetup.alt} width={{ mobile: 300 }} crop={{ y: 96, h: 560 }} radius={24}>
                <LiveSetup13 d={d} lang={lang} persona="kai" />
              </ScreenSlice>
            </div>,
            <div key="preview" className={s.reqSlice} data-req-root="preview">
              <ScreenSlice label={m.showPreview.alt} width={{ mobile: 300 }} crop={{ y: 96, h: 600 }} radius={24}>
                <ShowPreview14 d={d} lang={lang} persona="kai" />
              </ScreenSlice>
            </div>,
            <Fragment key="archive">{archive}</Fragment>,
          ]}
        />
      </div>

      <div className="container-site">
        <div className={s.archive}>
          <div className={s.archiveDesk}>{archive}</div>
          <div className={s.archiveText}>
            <p className={s.archiveKicker}>
              <Icon name="replay" size={16} />
              <span>{m.archive.tag}</span>
            </p>
            <h3 className={`t-h3 ${s.archiveTitle}`}>
              <Units text={t.archiveTitle} lang={lang} mode="phrase" />
            </h3>
            <p className={`t-body ${s.archiveBody}`}>{t.archiveBody}</p>
          </div>
        </div>

        <div className={s.notes}>
          <p className={`t-small ${s.footnote}`}>{t.footnote}</p>
          <ScreenNote d={d} tone="dark" />
        </div>
      </div>
      <LiveRequestMicro topicValue={m.liveSetup.topicValue} />
    </div>
  );
}
