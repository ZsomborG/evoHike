import type { DifficultyLevel } from '../types/difficulty';

export class Trail {
  id: string;
  name: string;
  location: string;
  length: number;
  difficulty: DifficultyLevel;
  elevationGain: number;
  time: number;
  rating: number;
  reviewCount: number;
  coverPhotoPath: string;
  description: string;
  userPhotos: string[];

  constructor(data: {
    id: string;
    name: string;
    location: string;
    length: number;
    difficulty: DifficultyLevel;
    elevationGain: number;
    time: number;
    rating: number;
    reviewCount: number;
    coverPhotoPath: string;
    description?: string;
    userPhotos?: string[];
  }) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.length = data.length;
    this.difficulty = data.difficulty;
    this.elevationGain = data.elevationGain;
    this.time = data.time;
    this.rating = data.rating;
    this.reviewCount = data.reviewCount;
    this.coverPhotoPath = data.coverPhotoPath;
    this.description = data.description || '';
    this.userPhotos = data.userPhotos || [];
  }
}
