export interface City {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: { lat: number; lng: number };
  id: string;
}

export interface Country {
  country: string;
  emoji: string;
}
