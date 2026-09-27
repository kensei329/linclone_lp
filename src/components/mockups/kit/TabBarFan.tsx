import type { Dictionary } from '@/i18n/dictionaries';
import { Icon, type IconName } from '@/components/site/icons/Icon';

type FanTab = 'home' | 'chat' | 'grow' | 'live' | 'mypage';

/** Fan app tab bar; LIVE配信 uses `podcasts`, never videocam (spec §4.8). STUB (WP0a). */
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
    <div data-tabbar="fan">
      {tabs.map(([id, icon, label]) => (
        <span key={id} data-active={id === active ? '' : undefined}>
          {id === active ? <span data-tab-halo="" /> : null}
          <Icon name={icon} filled={id === active} size={22} />
          {label}
        </span>
      ))}
    </div>
  );
}
