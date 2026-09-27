// Vendor-free analytics shim (spec §9.5). Pushes to window.dataLayer when a
// tag manager is present and always emits an `lc:analytics` window event.
// Never pass personal data.

export type AnalyticsEvent =
  | 'cta_click' | 'qr_open' | 'demo_start' | 'demo_complete' | 'sticky_dismiss'
  | 'creators_nav' | 'studio_mailto' | 'studio_copy_email' | 'lang_switch' | 'faq_open';

type AnalyticsProps = Record<string, string | number | boolean>;
type DataLayerWindow = Window & { dataLayer?: { push: (entry: Record<string, unknown>) => unknown } };

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  try {
    const w = window as DataLayerWindow;
    w.dataLayer?.push({ event, ...props });
    w.dispatchEvent(new CustomEvent('lc:analytics', { detail: { event, ...props } }));
  } catch {
    // analytics must never break the page
  }
}
