const ALLOWED_TEAM_IDS = new Set([
  1044, 61, 57, 81, 4, 109, 1765, 1780, 1779,
]);

export function isAllowedTeamId(teamId: number): boolean {
  return ALLOWED_TEAM_IDS.has(teamId);
}
