import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HistoryItemProps {
  item: {
    name: string;
    dosage: string;
    status: 'taken' | 'missed' | 'skipped';
    timestamp: string;
    scheduledTime?: string;
  };
}

export default function HistoryItem({ item }: HistoryItemProps) {
  const getColorByType = () => {
    // Map medication names to specific colors
    const colorMap: { [key: string]: string } = {
      'Abc': item.dosage.includes('500') ? 
        (item.name.toLowerCase().includes('blue') ? '#007AFF' : '#FF9500') : '#8E8E93',
      'Omez': '#AF52DE',
      // Add more mappings as needed
    };
    
    return colorMap[item.name] || '#007AFF'; // Default to blue
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'taken':
        return <CheckCircle2 size={24} color="#34C759" />;
      case 'missed':
        return <XCircle size={24} color="#FF3B30" />;
      case 'skipped':
        return <Clock size={24} color="#FF9500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'taken':
        return 'Taken';
      case 'missed':
        return 'Missed';
      case 'skipped':
        return 'Skipped';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'taken':
        return '#34C759';
      case 'missed':
        return '#FF3B30';
      case 'skipped':
        return '#FF9500';
      default:
        return '#666';
    }
  };

  const getStatusBackground = () => {
    switch (item.status) {
      case 'taken':
        return '#F0FFF4';
      case 'missed':
        return '#FFEBEE';
      case 'skipped':
        return '#FFF8E6';
      default:
        return '#F2F2F7';
    }
  };

  const color = getColorByType();
  const time = new Date(item.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[color, color + '80']}
        style={styles.colorIndicator}
      />
      <View style={styles.content}>
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.dosage}>{item.dosage}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusBackground() }]}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
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
    color: '#007AFF',
    marginBottom: 8,
  },
  dosage: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  time: {
    fontSize: 16,
    color: '#8E8E93',
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
});