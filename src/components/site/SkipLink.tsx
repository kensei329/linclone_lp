/** Visually hidden until focused; a fixed white pill with ink text (spec §4.1). */
export function SkipLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="skip-link">
      {label}
    </a>
  );
}
