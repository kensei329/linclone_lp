/** Segmented control: pills 7×14, 11/600, the selected one in cyan wash (spec §4.8). */
export function Segmented({ items, active, hook, className }: { items: string[]; active: number; hook?: string; className?: string }) {
  return (
    <span className={className ? `segmented ${className}` : 'segmented'} data-m={hook}>
      {items.map((item, i) => (
        <span key={item} data-selected={i === active ? '' : undefined}>
          {item}
        </span>
      ))}
    </span>
  );
}
