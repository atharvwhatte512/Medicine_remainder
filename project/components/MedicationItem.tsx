import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2 } from 'lucide-react-native';
import { useMedications } from '@/hooks/useMedications';
import { colors } from '@/config/theme';
import { Medication } from '@/types/medication';

interface MedicationItemProps {
  medication: Medication;
  showTime?: boolean;
  showTakeButton?: boolean;
  onTake?: () => void;
}

export default function MedicationItem({ 
  medication, 
  showTime = false, 
  showTakeButton = true,
  onTake 
}: MedicationItemProps) {
  const { takeMedication } = useMedications();

  const getColorByType = () => {
    // Map medication names to specific colors
    const colorMap: { [key: string]: string } = {
      'Abc': medication.dosage.includes('500') ? 
        (medication.name.toLowerCase().includes('blue') ? colors.primary : colors.secondary) : colors.textDark,
      'Omez': colors.primary,
      // Add more mappings as needed
    };
    
    return colorMap[medication.name] || colors.primary; // Default to primary color
  };

  const handleTakeMedication = async () => {
    try {
      await takeMedication(medication.id);
    } catch (error) {
      console.error('Error taking medication:', error);
    }
  };

  const getStatusLabel = () => {
    if (medication.status === 'taken') {
      return { text: 'Taken', color: colors.success, bgColor: colors.success + '20' };
    } else if (medication.status === 'missed') {
      return { text: 'Missed', color: colors.error, bgColor: colors.error + '20' };
    } else {
      return { text: 'Pending', color: colors.warning, bgColor: colors.warning + '20' };
    }
  };

  const status = getStatusLabel();
  const color = getColorByType();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[color, color + '80']}
        style={styles.colorIndicator}
      />
      <View style={styles.content}>
        <View style={styles.details}>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
          {showTime && <Text style={styles.time}>{medication.time}</Text>}
        </View>
        {medication.status === 'taken' ? (
          <View style={[styles.statusContainer, { backgroundColor: status.bgColor }]}>
            <CheckCircle2 size={24} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
          </View>
        ) : showTakeButton ? (
          <TouchableOpacity 
            style={styles.takeButton}
            onPress={onTake || handleTakeMedication}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryGradient[1]]}
              style={styles.takeButtonGradient}
            >
              <Text style={styles.takeButtonText}>Take</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.textLight,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: colors.textDark,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  colorIndicator: {
    width: 16,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  dosage: {
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 8,
    fontWeight: '500',
  },
  time: {
    fontSize: 16,
    color: colors.textDark,
    opacity: 0.7,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  takeButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  takeButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  takeButtonText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
  },
});