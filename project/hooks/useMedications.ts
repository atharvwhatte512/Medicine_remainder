import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  initialSupply: number;
  currentSupply: number;
  refillAt: number;
  createdAt: string;
}

interface MedicationLog {
  _id: string;
  medication: string;
  name: string;
  dosage: string;
  status: 'taken' | 'missed' | 'skipped';
  timestamp: string;
  scheduledTime?: string;
  notes?: string;
}

const MEDICATIONS_KEY = 'medications';
const MEDICATION_HISTORY_KEY = 'medication_history';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load medications from AsyncStorage
  const fetchMedications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem(MEDICATIONS_KEY);
      setMedications(data ? JSON.parse(data) : []);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  // Add a new medication
  const addMedication = async (medicationData: Partial<Medication>) => {
    try {
      const newMedication: Medication = {
        _id: generateId(),
        name: medicationData.name || '',
        dosage: medicationData.dosage || '',
        frequency: medicationData.frequency || '',
        initialSupply: medicationData.initialSupply || 30,
        currentSupply: medicationData.currentSupply || medicationData.initialSupply || 30,
        refillAt: medicationData.refillAt || 10,
        createdAt: new Date().toISOString(),
      };
      const updated = [...medications, newMedication];
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updated));
      setMedications(updated);
      return newMedication;
    } catch (err: any) {
      setError('Failed to add medication');
      throw err;
    }
  };

  // Update a medication
  const updateMedication = async (id: string, medicationData: Partial<Medication>) => {
    try {
      const updated = medications.map(med =>
        med._id === id ? { ...med, ...medicationData } : med
      );
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updated));
      setMedications(updated);
      return updated.find(med => med._id === id);
    } catch (err: any) {
      setError('Failed to update medication');
      throw err;
    }
  };

  // Delete a medication
  const deleteMedication = async (id: string) => {
    try {
      const updated = medications.filter(med => med._id !== id);
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updated));
      setMedications(updated);
      // Also remove logs for this medication
      const history = await AsyncStorage.getItem(MEDICATION_HISTORY_KEY);
      const logs: MedicationLog[] = history ? JSON.parse(history) : [];
      const filteredLogs = logs.filter(log => log.medication !== id);
      await AsyncStorage.setItem(MEDICATION_HISTORY_KEY, JSON.stringify(filteredLogs));
    } catch (err: any) {
      setError('Failed to delete medication');
      throw err;
    }
  };

  // Mark medication as taken
  const takeMedication = async (id: string) => {
    try {
      const med = medications.find(m => m._id === id);
      if (!med) throw new Error('Medication not found');
      // Update supply
      const updatedMed = { ...med, currentSupply: Math.max(0, med.currentSupply - 1) };
      const updatedMeds = medications.map(m => (m._id === id ? updatedMed : m));
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updatedMeds));
      setMedications(updatedMeds);
      // Add log
      const log: MedicationLog = {
        _id: generateId(),
        medication: id,
        name: med.name,
        dosage: med.dosage,
        status: 'taken',
        timestamp: new Date().toISOString(),
      };
      const history = await AsyncStorage.getItem(MEDICATION_HISTORY_KEY);
      const logs: MedicationLog[] = history ? JSON.parse(history) : [];
      const updatedLogs = [log, ...logs];
      await AsyncStorage.setItem(MEDICATION_HISTORY_KEY, JSON.stringify(updatedLogs));
      return updatedMed;
    } catch (err: any) {
      setError('Failed to mark medication as taken');
      throw err;
    }
  };

  // Get medications for today (all meds)
  const getMedicationsForToday = useCallback(async () => {
    return medications;
  }, [medications]);

  // Get medications for a specific date (all meds)
  const getMedicationsForDate = useCallback(async (date: string) => {
    return medications;
  }, [medications]);

  // Get medication history
  const getMedicationHistory = useCallback(async (type: 'all' | 'taken' | 'missed' = 'all') => {
    try {
      const history = await AsyncStorage.getItem(MEDICATION_HISTORY_KEY);
      let logs: MedicationLog[] = history ? JSON.parse(history) : [];
      if (type !== 'all') {
        logs = logs.filter(log => log.status === type);
      }
      return logs;
    } catch (err: any) {
      setError('Failed to fetch medication history');
      return [];
    }
  }, []);

  // Clear medication history
  const clearMedicationHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(MEDICATION_HISTORY_KEY);
    } catch (err: any) {
      setError('Failed to clear medication history');
      throw err;
    }
  }, []);

  return {
    medications,
    loading,
    error,
    fetchMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    takeMedication,
    getMedicationsForToday,
    getMedicationsForDate,
    getMedicationHistory,
    clearMedicationHistory,
  };
};