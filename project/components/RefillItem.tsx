import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { colors, spacing, typography } from '@/config/theme';
import { Medication } from '@/types/medication';

interface RefillItemProps {
  medication: Medication & { // Extend Medication type for refill-specific properties
    currentSupply: number;
    initialSupply: number;
    refillAt: number;
  };
  onRecordRefill: (amount: number) => void;
}

export default function RefillItem({ medication, onRecordRefill }: RefillItemProps) {
  const [isRefilling, setIsRefilling] = useState(false);
  const [refillAmount, setRefillAmount] = useState('');

  const getColorByType = () => {
    const colorMap: { [key: string]: string } = {
      'Abc': medication.dosage.includes('500') ? 
        (medication.name.toLowerCase().includes('blue') ? colors.primary : colors.secondary) : colors.textDark,
      'Omez': colors.primary,
    };
    
    return colorMap[medication.name] || colors.primary; // Default to primary
  };

  const getStatusLabel = () => {
    const supplyPercentage = (medication.currentSupply / medication.initialSupply) * 100;
    if (supplyPercentage <= medication.refillAt) {
      return { 
        text: 'Low Supply', 
        color: colors.error, 
        bgColor: colors.error + '20',
        icon: <AlertCircle size={typography.body.fontSize} color={colors.error} />
      };
    } else {
      return { 
        text: 'Good Supply', 
        color: colors.success, 
        bgColor: colors.success + '20',
        icon: <CheckCircle2 size={typography.body.fontSize} color={colors.success} />
      };
    }
  };

  const calculateSupplyPercentage = () => {
    if (!medication.currentSupply || !medication.initialSupply) return '0%';
    const percentage = (medication.currentSupply / medication.initialSupply) * 100;
    return `${Math.round(percentage)}%`;
  };

  const handleRecordRefillPress = () => {
    const amount = parseInt(refillAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number greater than 0');
      return;
    }
    onRecordRefill(amount);
    setIsRefilling(false);
    setRefillAmount('');
  };

  const color = getColorByType();
  const status = getStatusLabel();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[color, color + '80']}
        style={styles.colorIndicator}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{medication.name}</Text>
            <Text style={styles.dosage}>{medication.dosage}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            {status.icon}
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>
        
        <View style={styles.supplySection}>
          <Text style={styles.supplyLabel}>Current Supply</Text>
          <Text style={styles.supplyValue}>{medication.currentSupply} units</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={[color, color + '80']}
            style={[
              styles.progressBar,
              { width: `${Math.min(100, (medication.currentSupply / medication.initialSupply) * 100)}%` }
            ]}
          />
        </View>
        
        <Text style={styles.percentage}>{calculateSupplyPercentage()}</Text>
        <Text style={styles.refillLabel}>Refill at: {medication.refillAt}%</Text>
        
        {isRefilling ? (
          <View style={styles.refillForm}>
            <TextInput
              style={[styles.refillInput, { color: colors.textDark }]}
              placeholder="Enter amount"
              value={refillAmount}
              onChangeText={setRefillAmount}
              keyboardType="numeric"
              autoFocus
              placeholderTextColor={colors.textDark + '70'}
            />
            <View style={styles.refillButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsRefilling(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleRecordRefillPress}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryGradient[1]]}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.refillButton}
            onPress={() => setIsRefilling(true)}
          >
            <LinearGradient
              colors={[colors.secondary, colors.secondaryGradient[1]]}
              style={styles.refillButtonGradient}
            >
              <Text style={styles.refillButtonText}>Record Refill</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.textLight,
    borderRadius: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  colorIndicator: {
    width: spacing.sm,
    borderTopLeftRadius: spacing.lg,
    borderBottomLeftRadius: spacing.lg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  dosage: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
  },
  statusText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  supplySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  supplyLabel: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    fontWeight: '500',
  },
  supplyValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarContainer: {
    height: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: spacing.xs,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: spacing.xs,
  },
  percentage: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    opacity: 0.7,
    textAlign: 'right',
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  refillLabel: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  refillForm: {
    marginTop: spacing.md,
  },
  refillInput: {
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    borderWidth: 1,
    borderColor: colors.background,
    marginBottom: spacing.sm,
  },
  refillButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderRadius: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background,
    backgroundColor: colors.textLight,
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    color: colors.textDark,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.textLight,
    fontSize: typography.body.fontSize,
    fontWeight: 'bold',
  },
  refillButton: {
    borderRadius: spacing.sm,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  refillButtonGradient: {
    padding: spacing.md,
    alignItems: 'center',
  },
  refillButtonText: {
    color: colors.textLight,
    fontSize: typography.body.fontSize,
    fontWeight: 'bold',
  },
});