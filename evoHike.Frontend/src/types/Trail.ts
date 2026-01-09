export type DifficultyLevel = 0 | 1 | 2 | 3;

export type Trail = {
  id: string;
  name: string;
  location: string;
  length: number;
  difficulty: DifficultyLevel;
  elevationGain: number;
  rating: number;
  reviewCount: number;
  coverPhotoPath: string;
};
