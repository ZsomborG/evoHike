import apiClient from '../api/axios';

export interface TrailDto {
  id: string;
  name: string;
  location: string;
  length: number;
  difficulty: number;
  elevationGain: number;
  rating: number;
  reviewCount: number;
  coverPhotoPath: string;
  estimatedDuration?: number;
  routeLine?: {
    type: 'LineString' | 'MultiLineString' | 'GeometryCollection';
    coordinates: number[][] | number[][][];
  };
}

export interface PoiDto {
  id: number;
  name: string;
  type: string;
  location: {
    type: 'Point';
    coordinates: number[];
  };
}

export const trailService = {
  getAllTrails: async () => {
    const response = await apiClient.get<TrailDto[]>('/api/trails');
    return response.data;
  },

  getNearbyPois: async (trailId: string, distanceMeters: number = 250) => {
    const response = await apiClient.get<PoiDto[]>(
      `/api/trails/${trailId}/pois`,
      {
        params: { distance: distanceMeters },
      },
    );
    return response.data;
  },
};
