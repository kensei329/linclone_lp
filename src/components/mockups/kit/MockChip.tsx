import { Icon, type IconName } from '@/components/site/icons/Icon';

type MockChipProps = { icon?: IconName; label: string; tone?: 'white' | 'teal' | 'purple' | 'pink' | 'dark'; selected?: boolean };

/** App chip: 34px pill, PJS 600 12. Deliberately has no price or coin-tag prop (spec §4.8). */
export function MockChip({ icon, label, tone = 'white', selected = false }: MockChipProps) {
  return (
    <span className="mock-chip" data-tone={tone} data-selected={selected ? '' : undefined}>
      {icon ? <Icon name={icon} filled={selected} size={16} /> : null}
      {label}
    </span>
  );
}
