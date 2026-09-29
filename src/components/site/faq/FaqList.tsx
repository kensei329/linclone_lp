import { Icon } from '../icons/Icon';

export type FaqItem = { q: string; a: string; link?: { href: string; label: string } };

/**
 * Native <details> accordion shared by both FAQs (spec §5.11, §6.11): `.glass`
 * rows (no backdrop-filter), the question as a heading inside the summary, a
 * `+` that turns 45° when open, and a CSS fade for the answer. No JS; the
 * delegated analytics listener reports `faq_open`.
 */
export function FaqList({ items, headingLevel: H }: { items: FaqItem[]; headingLevel: 'h3' }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={item.q} className="glass faq-item" data-analytics={`faq_open:${i + 1}`}>
          <summary>
            <H className="t-body font-bold">{item.q}</H>
            <span className="faq-plus" aria-hidden="true">
              <Icon name="add" size={20} />
            </span>
          </summary>
          <div className="faq-answer">
            <p className="t-body">
              {item.a}
              {item.link ? (
                <>
                  {' '}
                  <a href={item.link.href} data-analytics={/\/creators$/.test(item.link.href) ? 'creators_nav:faq' : undefined}>
                    {item.link.label}
                  </a>
                </>
              ) : null}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
