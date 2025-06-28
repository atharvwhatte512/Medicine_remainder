import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Chrome as Home, Calendar, Clock, ChartPie as PieChart, User } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/config/theme';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDark,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        header: () => (
          <LinearGradient
            colors={[colors.primary, colors.primaryGradient[1]]}
            style={styles.header}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="refill"
        options={{
          title: 'Refill',
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.textLight,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    height: 60,
    width: '100%',
  },
});