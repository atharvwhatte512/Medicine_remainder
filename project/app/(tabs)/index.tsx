import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Calendar, Clock, Plus, ChartPie as PieChart, MessageCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressCircle from '@/components/ProgressCircle';
import MedicationItem from '@/components/MedicationItem';
import { useMedications } from '@/hooks/useMedications';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, typography } from '@/config/theme';
import { Medication } from '@/types/medication';

export default function HomeScreen() {
  const { user } = useAuth();
  const { medications, getMedicationsForToday, loading, error } = useMedications();
  const [todayMeds, setTodayMeds] = useState<Medication[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchTodayMedications = async () => {
      const meds = await getMedicationsForToday();
      setTodayMeds(meds);
      
      if (meds.length > 0) {
        const takenCount = meds.filter(med => med.status === 'taken').length;
        setProgress(Math.round((takenCount / meds.length) * 100));
      }
    };
    
    fetchTodayMedications();
  }, [medications]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryGradient[1]]}
        style={styles.header}
      >
        <Text style={styles.greeting}>
          Hello, {user?.name || 'User'}
        </Text>
        <Text style={styles.title}>Daily Progress</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <MessageCircle size={24} color={colors.textLight} />
        </TouchableOpacity>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <ProgressCircle 
            percentage={progress} 
            size={200} 
            strokeWidth={20}
          />
        </View>
        
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/medication/add')}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGradient[1]]}
                style={styles.actionIconContainer}
              >
                <Plus size={32} color={colors.textLight} />
              </LinearGradient>
              <Text style={styles.actionText}>Add{'\n'}Medication</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/calendar')}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryGradient[1]]}
                style={styles.actionIconContainer}
              >
                <Calendar size={32} color={colors.textDark} />
              </LinearGradient>
              <Text style={styles.actionText}>Calendar{'\n'}View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/history')}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGradient[1]]}
                style={styles.actionIconContainer}
              >
                <Clock size={32} color={colors.textLight} />
              </LinearGradient>
              <Text style={styles.actionText}>History{'\n'}Log</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/refill')}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryGradient[1]]}
                style={styles.actionIconContainer}
              >
                <PieChart size={32} color={colors.textDark} />
              </LinearGradient>
              <Text style={styles.actionText}>Refill{'\n'}Tracker</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text style={styles.messageText}>Loading medications...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : todayMeds.length === 0 ? (
            <Text style={styles.messageText}>No medications scheduled for today</Text>
          ) : (
            todayMeds.map((med, index) => (
              <MedicationItem
                key={index}
                medication={med}
                showTime={true}
                showTakeButton={med.status !== 'taken'}
              />
            ))
          )}
        </View>
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
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  notificationIcon: {
    position: 'absolute',
    right: 24,
    top: Platform.OS === 'ios' ? 10 : 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 12,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.textLight,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  },
  scheduleContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllButton: {
    padding: 8,
  },
  seeAllText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
  messageText: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: typography.body.fontSize,
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
});