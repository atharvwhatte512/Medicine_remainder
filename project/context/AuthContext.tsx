import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_URL, MOCK_USER, MOCK_TOKEN } from '@/config/constants';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token and load user on app start
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For development, use mock data
      if (email === 'test@example.com' && password === 'password123') {
        const mockUser = MOCK_USER;
        const mockToken = MOCK_TOKEN;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('token', mockToken);
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        setUser(mockUser);
        return;
      }

      // Real API call
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);

    } catch (error: any) {
      console.error('Login error:', error.message);
      if (error.response) {
        throw new Error(error.response.data?.message || `Login failed with status ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Login failed: No response from server.');
      } else {
        throw new Error(`Login failed: ${error.message}`);
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);

    } catch (error: any) {
      console.error('Registration error:', error.message);
      if (error.response) {
        throw new Error(error.response.data?.message || `Registration failed with status ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Registration failed: No response from server.');
      } else {
        throw new Error(`Registration failed: ${error.message}`);
      }
    }
  };

  const logout = async () => {
    try {
      // Remove from AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      // Remove axios default header
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};