/** Segmented control (spec §4.8). STUB (WP0a). */
export function Segmented({ items, active }: { items: string[]; active: number }) {
  return (
    <span className="segmented">
      {items.map((item, i) => (
        <span key={item} data-selected={i === active ? '' : undefined}>
          {item}
        </span>
      ))}
    </span>
  );
}
