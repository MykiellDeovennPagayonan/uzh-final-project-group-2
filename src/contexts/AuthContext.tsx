'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backendCore } from '@/declarations/backendCore';
import { generateSalt, hashPasswordWithSalt, comparePassword } from '@/utils/crypto';
import { User, UserRole } from '@/declarations/backendCore/backendCore.did';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string, clinicId: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to convert string to UserRole
const stringToUserRole = (roleString: string): UserRole => {
  switch (roleString) {
    case 'Doctor':
      return { 'Doctor': null };
    case 'Nurse':
      return { 'Nurse': null };
    case 'HIMSP':
      return { 'HIMSP': null };
    case 'Patient':
      return { 'Patient': null };
    default:
      throw new Error(`Invalid role: ${roleString}`);
  }
};

// Helper function to convert UserRole to string
const userRoleToString = (role: UserRole): string => {
  if ('Doctor' in role) return 'Doctor';
  if ('Nurse' in role) return 'Nurse';
  if ('HIMSP' in role) return 'HIMSP';
  if ('Patient' in role) return 'Patient';
  throw new Error('Invalid UserRole');
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    validateSession();
  }, []);

  const clearError = () => setError(null);

  const validateSession = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await backendCore.validateSession(token);
      if (userData[0]) {
        setUser(userData[0]);
      } else {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      setError('Session validation failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await backendCore.getPasswordHash(email);

      if (!response[0]) {
        setError("Email does not exist");
        return;
      }

      const { password: hashedPassword } = response[0];
      const correctPassword = await comparePassword(password, hashedPassword);

      if (!correctPassword) {
        setError("Invalid email or password");
        return;
      }

      const credentials = { email, password: hashedPassword };
      const result = await backendCore.loginUser(credentials);

      if ('ok' in result) {
        const { user: userData, sessionToken } = result.ok;
        localStorage.setItem('sessionToken', sessionToken);
        const { created_at, ...rest } = userData;
        const safeUser = {
          ...rest,
          createdAt: created_at.toString(),
        };
        localStorage.setItem('user', JSON.stringify(safeUser));
        setUser(userData);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Login error:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string, clinicId: string) => {
    try {
      clearError();
      setLoading(true);

      const salt = await generateSalt();
      const hashedPassword = await hashPasswordWithSalt(password, salt);

      // Convert string role to UserRole
      const userRole = stringToUserRole(role);

      // Updated to match the expected backend interface
      const result = await backendCore.registerUser(
        email,
        hashedPassword,
        name,
        userRole,
        clinicId
      );

      if ('ok' in result) {
        // Auto-login after successful registration
        await login(email, password);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      console.error('Registration error:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      clearError();
      const token = localStorage.getItem('sessionToken');
      if (token) {
        await backendCore.logoutUser(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error for logout failures - still clear local state
    } finally {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the helper functions for use in other components
export { userRoleToString, stringToUserRole };