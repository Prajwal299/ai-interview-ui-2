import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { User, isAuthenticated, removeAuthToken, setAuthToken } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthResponse {
  access_token: string;
  user: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated()) {
      setUser({ id: '', username: 'unknown', email: 'unknown' });
      console.log('AuthContext - Token found:', localStorage.getItem('auth_token'));
    } else {
      console.log('AuthContext - No token found');
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(username, password);
      if (response.data.access_token) {
        setAuthToken(response.data.access_token);
        setUser(response.data.user);
        console.log('Login - Token stored:', localStorage.getItem('auth_token'));
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid credentials';
      console.error('Login error:', error.response?.data || error);
      toast({
        title: 'Login failed',
        description: message,
        variant: 'destructive',
      });
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(username, email, password);
      if (response.data.user) {
        await login(username, password);
        toast({
          title: 'Registration successful',
          description: 'Welcome to AI Interview Screener!',
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      console.error('Register error:', error.response?.data || error);
      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive',
      });
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await apiClient.logout(token);
      }
      removeAuthToken();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'Something went wrong during logout.',
        variant: 'destructive',
      });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};