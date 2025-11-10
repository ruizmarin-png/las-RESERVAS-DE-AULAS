export interface Booking {
  id: string;
  classroom: string;
  day: string;
  shift: 'Mañana' | 'Tarde';
  period: string;
  user: string;
}

export interface SelectedSlot {
  classroom: string;
  day: string;
  shift: 'Mañana' | 'Tarde';
  period: string;
}
