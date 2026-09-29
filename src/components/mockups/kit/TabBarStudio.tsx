import type { Dictionary } from '@/i18n/dictionaries';
import { Icon, type IconName } from '@/components/site/icons/Icon';

type StudioTab = 'chat' | 'grow' | 'home' | 'earnings' | 'me';

/**
 * LC Studio tab bar (spec §4.8): glass bar (white .75 + hairline), 72px, with
 * ホーム centred as a 48px #00b0c2 disc. Labels SG 500 10; active #0096a8.
 */
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
    <div className="mock-tabbar-studio" data-tabbar="studio">
      {tabs.map(([id, icon, label]) => {
        const on = id === active;
        const center = id === 'home';
        return (
          <span key={id} className="mock-stab" data-tab={id} data-active={on ? '' : undefined} data-center={center ? '' : undefined}>
            {center ? (
              <span className="mock-stab-disc">
                <Icon name={icon} filled size={24} />
              </span>
            ) : (
              <Icon name={icon} filled={on} size={22} />
            )}
            {label}
          </span>
        );
      })}
    </div>
  );
}
