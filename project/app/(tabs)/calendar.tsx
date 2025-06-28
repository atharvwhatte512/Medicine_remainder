import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarComponent } from 'react-native-calendars';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useMedications } from '@/hooks/useMedications';
import MedicationItem from '@/components/MedicationItem';
import { colors, spacing, typography } from '@/config/theme';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState({});
  const { medications, getMedicationsForDate, loading } = useMedications();
  const [dateMedications, setDateMedications] = useState([]);

  useEffect(() => {
    const loadDatesWithMedications = () => {
      const marks = {};
      const today = new Date().toISOString().split('T')[0];
      
      medications.forEach(med => {
        if (med.scheduleDates) {
          med.scheduleDates.forEach(date => {
            if (date === today) {
              marks[date] = { selected: true, selectedColor: colors.primary, marked: true };
            } else {
              marks[date] = { marked: true, dotColor: colors.primary };
            }
          });
        }
      });
      
      if (!marks[today]) {
        marks[today] = { selected: true, selectedColor: colors.primary };
      }
      
      setMarkedDates(marks);
    };
    
    loadDatesWithMedications();
  }, [medications]);

  useEffect(() => {
    const fetchMedicationsForDate = async () => {
      const meds = await getMedicationsForDate(selectedDate);
      setDateMedications(meds);
    };
    
    fetchMedicationsForDate();
  }, [selectedDate, medications]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Calendar</Text>
      </View>
      
      <View style={styles.calendarContainer}>
        <CalendarComponent
          current={selectedDate}
          onDayPress={onDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: colors.primary }
          }}
          theme={{
            backgroundColor: colors.textLight,
            calendarBackground: colors.textLight,
            textSectionTitleColor: colors.textDark,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.textLight,
            todayTextColor: colors.primary,
            dayTextColor: colors.textDark,
            textDisabledColor: colors.textDark + '40',
            dotColor: colors.primary,
            selectedDotColor: colors.textLight,
            arrowColor: colors.primary,
            monthTextColor: colors.textDark,
            indicatorColor: colors.primary,
            textDayFontWeight: typography.body.fontWeight,
            textMonthFontWeight: typography.h3.fontWeight,
            textDayHeaderFontWeight: typography.caption.fontWeight,
            textDayFontSize: typography.body.fontSize,
            textMonthFontSize: typography.h3.fontSize,
            textDayHeaderFontSize: typography.caption.fontSize,
          }}
        />
      </View>
      
      <View style={styles.dateHeader}>
        <Text style={styles.selectedDateText}>{formatSelectedDate()}</Text>
      </View>
      
      <ScrollView style={styles.medicationsList}>
        {loading ? (
          <Text style={styles.messageText}>Loading...</Text>
        ) : dateMedications.length === 0 ? (
          <Text style={styles.messageText}>No medications scheduled for this date</Text>
        ) : (
          dateMedications.map((med, index) => (
            <MedicationItem
              key={index}
              medication={med}
              showTime={true}
              showTakeButton={true}
            />
          ))
        )}
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
  calendarContainer: {
    backgroundColor: colors.textLight,
    borderRadius: spacing.md,
    margin: spacing.md,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: spacing.sm,
  },
  dateHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  selectedDateText: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  medicationsList: {
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
});