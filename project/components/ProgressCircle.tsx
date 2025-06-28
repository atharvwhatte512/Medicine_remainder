import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/config/theme';

interface ProgressCircleProps {
  size: number;
  strokeWidth: number;
  percentage: number;
}

export default function ProgressCircle({ size, strokeWidth, percentage }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={colors.primary + '20'} // 20 is hex for 12% opacity
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          stroke={colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{percentage}%</Text>
        <Text style={styles.label}>Completed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  label: {
    fontSize: 16,
    color: colors.textDark,
    marginTop: 8,
  },
});