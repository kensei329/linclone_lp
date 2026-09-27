import type { Dictionary } from '@/i18n/dictionaries';
import { Icon, type IconName } from '@/components/site/icons/Icon';

type FanTab = 'home' | 'chat' | 'grow' | 'live' | 'mypage';

/**
 * Fan app floating tab bar (spec §4.8): frosted pill, 5 tabs; LIVE配信 uses
 * `podcasts`, never videocam. The active halo carries `data-tab-halo` so
 * animators can spring it.
 */
export function TabBarFan({ d, active }: { d: Dictionary; active: FanTab }) {
  const c = d.mock.fan.common;
  const tabs: [FanTab, IconName, string][] = [
    ['home', 'home', c.tabHome],
    ['chat', 'forum', c.tabChat],
    ['grow', 'psychiatry', c.tabGrow],
    ['live', 'podcasts', c.tabLive],
    ['mypage', 'person', c.tabMyPage],
  ];
  return (
    <div className="mock-tabbar-fan" data-tabbar="fan">
      {tabs.map(([id, icon, label]) => {
        const on = id === active;
        return (
          <span key={id} className="mock-tab" data-tab={id} data-active={on ? '' : undefined}>
            <span className="mock-tab-icon">
              {on ? <span data-tab-halo="" /> : null}
              <Icon name={icon} filled={on} size={22} />
            </span>
            {label}
          </span>
        );
      })}
    </div>
  );
}
