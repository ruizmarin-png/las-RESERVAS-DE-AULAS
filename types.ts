export interface Booking {
  id: string;
  classroom: string;
  day: string; // Stored as 'YYYY-MM-DD'
  shift: 'Mañana' | 'Tarde';
  period: string;
  user: string;
}

export interface SelectedSlot {
  classroom: string;
  day: string; // Stored as 'YYYY-MM-DD'
  shift: 'Mañana' | 'Tarde';
  period: string;
}