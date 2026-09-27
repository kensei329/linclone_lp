/** Visually hidden until focused (spec §4.1). WP0b styles it as a fixed white pill. */
export function SkipLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-ink"
    >
      {label}
    </a>
  );
}
