/** Segmented control: pills 7×14, 11/600, the selected one in cyan wash (spec §4.8). */
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
