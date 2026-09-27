/** Three 6px dots with a staggered 1.2s opacity loop, in view only (spec §4.8). */
export function TypingDots() {
  return (
    <span className="typing-dots" data-loop="">
      <span />
      <span />
      <span />
    </span>
  );
}
