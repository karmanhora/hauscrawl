export function mediaPreferences() {
  return { reduced: typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, saver: typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true };
}
