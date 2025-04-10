"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import apiService from '@/services/api-service';

// Define the shape of the user object
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileCompleted?: boolean;
  department?: string;
  position?: string;
  avatar?: string;
  employeeId?: string;
}

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateUserProfile: (profileData: any) => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          console.log("Checking session for stored user:", userData);
          
          // Fix for missing ID
          if (!userData.id && userData.employeeId) {
            userData.id = userData.employeeId;
          }
          
          // Explicitly check if the verifySession method exists
          if (typeof apiService.verifySession === 'function') {
            try {
              // Verify the session is still valid with the server
              const response = await apiService.verifySession(userData.id);
              
              if (response.status === 'success' && response.valid) {
                console.log("Session valid, setting user:", userData);
                setUser(userData);
                setToken(storedToken);
              } else {
                // If session is invalid, clear local storage
                console.log("Session invalid, clearing user data");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
              }
            } catch (error) {
              console.error('Session verification failed:', error);
              // Keep the user logged in if verification fails due to network/server issues
              setUser(userData);
              setToken(storedToken);
            }
          } else {
            // Manual fallback verification if verifySession doesn't exist
            console.log("verifySession not available, using manual verification");
            
            try {
              // Try to fetch the user profile as a session validation
              const response = await fetch(`${API_BASE_URL}/EmployeeController/getEmployee/${userData.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${storedToken}`,
                  'Content-Type': 'application/json',
                }
              });
              
              if (response.ok) {
                // If we can fetch the profile, session is valid
                console.log("Manual verification successful, setting user");
                setUser(userData);
                setToken(storedToken);
              } else {
                console.log("Manual verification failed, clearing user data");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
              }
            } catch (error) {
              console.error("Manual verification error:", error);
              // Keep user logged in on network errors
              setUser(userData);
              setToken(storedToken);
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Login function with improved handling and navigation
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.status === 'success') {
        // Store token and user data
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set the user in state
        setUser(userData);
        
        console.log("Login successful, user data:", userData);
        
        // Return success to trigger redirection in the login component
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API endpoint if needed
      if (user) {
        await axios.post(`${API_BASE_URL}/auth/logout`, {
          userId: user.id
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  };

  // Register function
  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      if (response.data.status === 'success') {
        // Optionally auto-login the user after registration
        // or just return success and redirect to login page
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (profileData: any): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!user) {
        return false;
      }
      
      // Call the API to update user profile
      const response = await apiService.updateUserProfile(user.id, profileData);
      
      if (response.status === 'success') {
        // Get the updated user data
        const userResponse = await apiService.getUserProfile(user.id);
        
        if (userResponse.status === 'success' && userResponse.employee) {
          // Update the local user object with basic profile details
          const updatedUser = {
            ...user,
            name: `${profileData.firstName} ${profileData.surname}`,
            department: profileData.department,
            position: profileData.position,
            profileCompleted: true // Mark the profile as completed
          };
          
          // Update localStorage with the new user data
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Update state with new user data
          setUser(updatedUser);
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

