export interface City {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  conditionText: string;
  icon: string;
}
export interface ErrorState {
  error: boolean;
  message: string;
}
