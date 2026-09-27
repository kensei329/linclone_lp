export type FaqItem = { q: string; a: string; link?: { href: string; label: string } };

/**
 * Native <details> accordion shared by both FAQs (spec §5.11, §6.11).
 * STUB (WP0a): semantic markup; WP0b adds the glass rows and icon.
 */
export function FaqList({ items, headingLevel: H }: { items: FaqItem[]; headingLevel: 'h3' }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.q} className="glass">
          <summary>
            <H className="t-body font-bold">{item.q}</H>
          </summary>
          <p className="t-body">
            {item.a}
            {item.link ? (
              <>
                {' '}
                <a href={item.link.href}>{item.link.label}</a>
              </>
            ) : null}
          </p>
        </details>
      ))}
    </div>
  );
}
