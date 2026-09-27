/** Three typing dots (spec §4.8). STUB (WP0a): static; WP0b adds the loop. */
export function TypingDots() {
  return (
    <span className="typing-dots" data-loop="">
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ display: 'inline-block', width: 6, height: 6, margin: '0 2px', borderRadius: '50%', background: '#8d8ba0' }} />
      ))}
    </span>
  );
}
