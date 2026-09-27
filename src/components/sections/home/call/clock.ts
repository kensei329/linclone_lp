/** Free-call meter text: whole seconds as M:SS (60 → "1:00", 59 → "0:59"). */
export const clock = (sec: number): string => {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** The free window the meter counts down from (spec: 最初の60秒は無料). */
export const FREE_SECONDS = 60;
