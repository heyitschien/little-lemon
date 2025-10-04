export type ReservationStatus = 'confirmed' | 'cancelled';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  occasion?: string;
  specialRequests?: string;
}

export type PartySizeValue = number | '';
export type ReservationFieldValue = string | number | '';

export interface ReservationFormData extends CustomerInfo {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  partySize: PartySizeValue;
}

export interface ReservationSummary extends ReservationFormData {
  id?: string;
  confirmedAt?: string;
}

export interface Reservation extends Omit<ReservationFormData, 'partySize'> {
  id: string;
  partySize: number;
  status: ReservationStatus;
  createdAt: string;
  confirmedAt?: string;
  updatedAt?: string;
  cancelledAt?: string;
}

export interface ReservationFormErrors {
  [key: string]: string | undefined;
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  partySize?: string;
  occasion?: string;
  specialRequests?: string;
}

export type ReservationField = keyof ReservationFormData;

export const isReservation = (value: unknown): value is Reservation => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.date === 'string' &&
    typeof record.time === 'string' &&
    typeof record.partySize === 'number' &&
    typeof record.name === 'string' &&
    typeof record.email === 'string' &&
    typeof record.status === 'string'
  );
};
