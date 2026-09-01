import { FdMatchesResponse } from '@zen/types';
import apiService from './apiService';

export async function getTestMatches() {
    try {
        const response = await apiService.get<FdMatchesResponse>('/teams/5/matches', {
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