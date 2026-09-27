import { Icon, type IconName } from '@/components/site/icons/Icon';

type MockChipProps = { icon?: IconName; label: string; tone?: 'white' | 'teal' | 'purple' | 'pink' | 'dark'; selected?: boolean };

/** App chip. Intentionally has no price/coin tag prop (spec §4.8). STUB (WP0a). */
export function MockChip({ icon, label, tone = 'white', selected = false }: MockChipProps) {
  return (
    <span className="mock-chip" data-tone={tone} data-selected={selected ? '' : undefined}>
      {icon ? <Icon name={icon} size={16} /> : null}
      {label}
    </span>
  );
}
