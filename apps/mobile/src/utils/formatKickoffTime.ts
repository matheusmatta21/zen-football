export function formatKickoffTime(kickoffUtc: string): string {
  const date = new Date(kickoffUtc);
  if (Number.isNaN(date.getTime())) return "A definir";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}