import { FdMatchesResponse } from '@zen/types';
import apiService from './apiService';

export async function getTestMatches() {
    try {
        const response = await apiService.get<FdMatchesResponse>('/teams/61/matches', {
            params: {
                season: '2026',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching Bournemouth matches:', error);
        throw error;
    }
}

export async function getTestCompetitionFromTeam() {
  try{
    const response = await apiService.get(`/teams/61`)
    return response.data.runningCompetitions;
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    throw error;
  }
}