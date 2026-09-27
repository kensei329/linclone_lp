import type { Dictionary } from '@/i18n/dictionaries';
import { Icon, type IconName } from '@/components/site/icons/Icon';

type StudioTab = 'chat' | 'grow' | 'home' | 'earnings' | 'me';

/** LC Studio tab bar, home centred (spec §4.8). STUB (WP0a). */
export function TabBarStudio({ d, active }: { d: Dictionary; active: StudioTab }) {
  const t = d.mock.studio.common.tabs;
  const tabs: [StudioTab, IconName, string][] = [
    ['chat', 'forum', t.chat],
    ['grow', 'psychiatry', t.grow],
    ['home', 'home', t.home],
    ['earnings', 'payments', t.earnings],
    ['me', 'person', t.me],
  ];
  return (
    <div data-tabbar="studio">
      {tabs.map(([id, icon, label]) => (
        <span key={id} data-active={id === active ? '' : undefined}>
          <Icon name={icon} filled={id === active} size={22} />
          {label}
        </span>
      ))}
    </div>
  );
}
