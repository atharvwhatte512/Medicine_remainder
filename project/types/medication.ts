export type MedicationStatus = 'pending' | 'taken' | 'missed' | 'skipped';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  status: MedicationStatus;
  startDate: string;
  endDate?: string;
  notes?: string;
  refillReminder?: boolean;
  refillDate?: string;
  scheduleDates?: string[];
} 