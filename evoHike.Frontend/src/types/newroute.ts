export interface Stop {
  id: string;
  name: string;
  note: string;
}

export interface TourData {
  name: string;
  description: string;
  stops: Stop[];
  photo?: File | string;
}
