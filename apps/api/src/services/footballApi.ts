import apiService from "./apiService";

export async function getTeamMatches(
  teamId: number,
  season?: string,
  status?: string,
) {
  try {
    const response = await apiService.get(`/teams/${teamId}/matches`, {
      params: {
        season: season,
        status: status,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching team matches:", error);
    throw error;
  }
}
