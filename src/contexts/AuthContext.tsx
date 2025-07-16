import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, isAuthenticated, removeAuthToken, setAuthToken } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthResponse {
  token: string;
  user?: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
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
    // Check if user is authenticated on app start
    if (isAuthenticated()) {
      // In a real app, you might want to validate the token with the backend
      // For now, we'll assume the token is valid if it exists
      setUser({ id: 1, email: 'user@example.com' }); // This should come from token or API
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(email, password) as AuthResponse;
      
      if (response.token) {
        setAuthToken(response.token);
        setUser(response.user || { id: 1, email });
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(email, password, name) as AuthResponse;
      
      if (response.token) {
        setAuthToken(response.token);
        setUser(response.user || { id: 1, email, name });
        toast({
          title: "Registration successful",
          description: "Welcome to AI Interview Screener!",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
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