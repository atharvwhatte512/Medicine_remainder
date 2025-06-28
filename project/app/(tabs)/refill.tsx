import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useMedications } from '@/hooks/useMedications';
import RefillItem from '@/components/RefillItem';
import { colors, spacing, typography } from '@/config/theme';
import { Medication } from '@/types/medication';

export default function RefillScreen() {
  const { medications, updateMedication, loading } = useMedications();
  const [refillItems, setRefillItems] = useState<Medication[]>([]);

  useEffect(() => {
    if (medications) {
      setRefillItems(medications);
    }
  }, [medications]);

  const handleRecordRefill = async (medicationId: string, amount: number) => {
    try {
      await updateMedication(medicationId, { currentSupply: amount });
    } catch (error) {
      console.error('Failed to record refill:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Refill Tracker</Text>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.messageText}>Loading refill data...</Text>
        ) : refillItems.length === 0 ? (
          <Text style={styles.messageText}>No medications to refill</Text>
        ) : (
          <FlatList
            data={refillItems}
            renderItem={({ item }) => (
              <RefillItem 
                medication={item}
                onRecordRefill={(amount) => handleRecordRefill(item.id, amount)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
    padding: spacing.md,
  },
  messageText: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    opacity: 0.7,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  list: {
    paddingBottom: spacing.md,
  },
});