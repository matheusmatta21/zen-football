import { FdMatchesResponse } from '@zen/types';
import apiService from './apiService';

export async function getBournemouthMatches() {
    try {
        const response = await apiService.get<FdMatchesResponse>('/teams/1044/matches', {
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