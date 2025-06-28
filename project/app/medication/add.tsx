import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Sun, RefreshCw, Clock, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { useMedications } from '@/hooks/useMedications';
import { colors, spacing, typography } from '@/config/theme';

export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addMedication } = useMedications();

  const frequencies = [
    { id: 'once', label: 'Once daily', icon: <Sun size={24} color={colors.textDark} /> },
    { id: 'twice', label: 'Twice daily', icon: <RefreshCw size={24} color={colors.textDark} /> },
    { id: 'three', label: 'Three times daily', icon: <Clock size={24} color={colors.textDark} /> },
    { id: 'four', label: 'Four times daily', icon: <RefreshCw size={24} color={colors.textDark} /> },
    { id: 'asNeeded', label: 'As needed', icon: <Calendar size={24} color={colors.textDark} /> },
  ];

  const handleAddMedication = async () => {
    if (!name || !dosage || !frequency) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newMedication = {
        name,
        dosage,
        frequency,
        currentSupply: 30, // Default initial supply
        refillAt: 5, // Default refill threshold
      };
      
      await addMedication(newMedication);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to add medication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>New Medication</Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Medication Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Medication Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textDark + '70'}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Dosage (e.g., 500mg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Dosage (e.g., 500mg)"
            value={dosage}
            onChangeText={setDosage}
            placeholderTextColor={colors.textDark + '70'}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>How often?</Text>
          <View style={styles.frequencyGrid}>
            {frequencies.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.frequencyOption,
                  frequency === item.id && styles.selectedFrequency,
                ]}
                onPress={() => setFrequency(item.id)}
              >
                <View style={styles.frequencyIconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.frequencyLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.addButton, (!name || !dosage || !frequency) && styles.disabledButton]}
          onPress={handleAddMedication}
          disabled={!name || !dosage || !frequency || isLoading}
        >
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingBottom: 20,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    marginBottom: spacing.sm,
    color: colors.textDark,
  },
  input: {
    backgroundColor: colors.textLight,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    borderWidth: 1,
    borderColor: colors.background,
    color: colors.textDark,
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  frequencyOption: {
    width: '48%',
    backgroundColor: colors.textLight,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background,
  },
  selectedFrequency: {
    backgroundColor: colors.secondary + '20',
    borderColor: colors.secondary,
  },
  frequencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  frequencyLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.textDark,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  disabledButton: {
    backgroundColor: colors.primary + '80',
  },
  addButtonText: {
    color: colors.textLight,
    fontSize: typography.body.fontSize,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background,
    backgroundColor: colors.textLight,
  },
  cancelButtonText: {
    color: colors.textDark,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
});