import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Switch, ScrollView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Bell, Clock, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { saveData, getData, STORAGE_KEYS } from '../../utils/storage';

interface UserProfileData {
  name: string;
  email: string;
  reminderEnabled: boolean;
  refillAlertEnabled: boolean;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    reminderEnabled: true,
    refillAlertEnabled: true,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedData = await getData<UserProfileData>('USER_DATA');
      if (savedData) {
        setProfileData(savedData);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleSave = async () => {
    try {
      await saveData('USER_DATA', profileData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: logout,
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                  placeholder="Name"
                />
                <TextInput
                  style={styles.input}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </>
            ) : (
              <>
                <Text style={styles.name}>{profileData.name || 'User'}</Text>
                <Text style={styles.email}>{profileData.email || 'user@example.com'}</Text>
              </>
            )}
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color="#00A651" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Medication Reminders</Text>
              <Switch
                trackColor={{ false: '#E5E5EA', true: '#ACDBC0' }}
                thumbColor={profileData.reminderEnabled ? '#00A651' : '#F4F3F4'}
                onValueChange={(value) => {
                  setProfileData({ ...profileData, reminderEnabled: value });
                  saveData('USER_DATA', { ...profileData, reminderEnabled: value });
                }}
                value={profileData.reminderEnabled}
              />
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Clock size={20} color="#007AFF" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Refill Alerts</Text>
              <Switch
                trackColor={{ false: '#E5E5EA', true: '#ACDBC0' }}
                thumbColor={profileData.refillAlertEnabled ? '#00A651' : '#F4F3F4'}
                onValueChange={(value) => {
                  setProfileData({ ...profileData, refillAlertEnabled: value });
                  saveData('USER_DATA', { ...profileData, refillAlertEnabled: value });
                }}
                value={profileData.refillAlertEnabled}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Shield size={20} color="#FF9500" />
            </View>
            <Text style={styles.menuLabel}>Privacy Settings</Text>
            <ChevronRight size={20} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color="#5856D6" />
            </View>
            <Text style={styles.menuLabel}>Help & Support</Text>
            <ChevronRight size={20} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>MedTrack v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#00A651',
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
  },
  editButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#00A651',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appVersion: {
    fontSize: 14,
    color: '#8E8E93',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});