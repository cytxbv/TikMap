export interface Category {
  label: string;
  value: string;
}

export interface Pin{
  id: number;
  lat: number;
  lng : number;
  tiktok_url: string;
  thumbnail_url: string;
  category: string;
}