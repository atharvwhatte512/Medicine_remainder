import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { saveData, getData, STORAGE_KEYS } from '../utils/storage';

interface UserData {
  name: string;
  email: string;
}

export const UserProfile = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
  });
  const [savedData, setSavedData] = useState<UserData | null>(null);

  // Load saved data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getData<UserData>('USER_DATA');
      if (data) {
        setSavedData(data);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSave = async () => {
    try {
      await saveData('USER_DATA', userData);
      await loadUserData(); // Reload data after saving
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
        keyboardType="email-address"
      />
      
      <Button title="Save Profile" onPress={handleSave} />
      
      {savedData && (
        <View style={styles.savedData}>
          <Text style={styles.savedTitle}>Saved Data:</Text>
          <Text>Name: {savedData.name}</Text>
          <Text>Email: {savedData.email}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  savedData: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
}); 