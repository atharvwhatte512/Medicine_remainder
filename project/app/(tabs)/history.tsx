import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useMedications } from '@/hooks/useMedications';
import HistoryItem from '@/components/HistoryItem';

interface MedicationLog {
  _id: string;
  medication: string;
  user: string;
  name: string;
  dosage: string;
  status: 'taken' | 'missed' | 'skipped';
  timestamp: string;
  scheduledTime?: string;
  notes?: string;
}

interface GroupedHistory {
  [key: string]: MedicationLog[];
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'taken' | 'missed'>('all');
  const { getMedicationHistory, clearMedicationHistory, loading } = useMedications();
  const [history, setHistory] = useState<MedicationLog[]>([]);

  useEffect(() => {
    loadHistory();
  }, [activeTab]);

  const loadHistory = async () => {
    const data = await getMedicationHistory(activeTab);
    setHistory(data);
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all medication history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearMedicationHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const renderHistoryByDate = () => {
    const groupedHistory = history.reduce<GroupedHistory>((groups, item) => {
      const date = new Date(item.timestamp).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});

    return Object.keys(groupedHistory).map(date => (
      <View key={date} style={styles.dateGroup}>
        <Text style={styles.dateHeader}>{date}</Text>
        {groupedHistory[date].map((item, index) => (
          <HistoryItem key={index} item={item} />
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medication History</Text>
        <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
          <Trash2 size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Clock size={20} color={activeTab === 'all' ? '#007AFF' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'taken' && styles.activeTab]}
          onPress={() => setActiveTab('taken')}
        >
          <CheckCircle2 size={20} color={activeTab === 'taken' ? '#34C759' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'taken' && styles.activeTabText]}>Taken</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'missed' && styles.activeTab]}
          onPress={() => setActiveTab('missed')}
        >
          <XCircle size={20} color={activeTab === 'missed' ? '#FF3B30' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'missed' && styles.activeTabText]}>Missed</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[1]} // Single item to render the grouped history
        renderItem={() => <View>{renderHistoryByDate()}</View>}
        keyExtractor={() => 'history'}
        contentContainerStyle={styles.historyList}
        refreshing={loading}
        onRefresh={loadHistory}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medication history found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  clearButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeTab: {
    backgroundColor: '#E5F2FF',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  historyList: {
    padding: 20,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});