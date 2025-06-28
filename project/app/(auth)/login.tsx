import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Basic validation
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      Alert.alert(
        'Login Failed',
        err.message || 'An error occurred during login',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="medical" size={60} color="#007AFF" />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mockLoginButton}
          onPress={() => {
            setEmail('test@example.com');
            setPassword('password123');
          }}
        >
          <Text style={styles.mockLoginText}>Use Test Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
  mockLoginButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  mockLoginText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});