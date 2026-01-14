import type { DifficultyLevel } from '../types/difficulty';

export class Trail {
  id: string;
  name: string;
  location: string;
  length: number;
  difficulty: DifficultyLevel;
  elevationGain: number;
  rating: number;
  reviewCount: number;
  coverPhotoPath: string;
  estimatedDuration?: number;

  constructor(data: {
    id: string;
    name: string;
    location: string;
    length: number;
    difficulty: DifficultyLevel;
    elevationGain: number;
    rating: number;
    reviewCount: number;
    coverPhotoPath: string;
    estimatedDuration?: number;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.length = data.length;
    this.difficulty = data.difficulty;
    this.elevationGain = data.elevationGain;
    this.rating = data.rating;
    this.reviewCount = data.reviewCount;
    this.coverPhotoPath = data.coverPhotoPath;
    this.estimatedDuration = data.estimatedDuration;
  }
}
