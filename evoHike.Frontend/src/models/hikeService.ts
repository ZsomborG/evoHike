import apiClient from '../api/axios';

export interface PlanHikeDto {
  routeId: number;
  start: string;
  end: string;
  checklistItems: string[];
}

export const hikeService = {
  getChecklistOptions: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      '/api/plannedhikes/checklist-options',
    );
    return response.data;
  },

  savePlannedHike: async (data: PlanHikeDto) => {
    const response = await apiClient.post('/api/plannedhikes', data);
    return response.data;
  },
};
