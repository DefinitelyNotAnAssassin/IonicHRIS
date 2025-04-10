import axios from 'axios';
import { API_BASE_URL } from '../config';

// Add authentication token to all requests
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiService = {
  // Get user profile details with proper error handling
  async getUserProfile(userId: string) {
    try {
      console.log(`Fetching user profile for ID: ${userId}`);
      const response = await axios.get(`${API_BASE_URL}/employees/get/${userId}`, {
        headers: getAuthHeader()
      });
      console.log('Profile API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Verify user session
  async verifySession(userId: string) {
    try {
      console.log(`Verifying session for user ID: ${userId}`);
      const response = await axios.post(`${API_BASE_URL}/auth/verify-session`, { userId });
      console.log('Session verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error verifying session:', error);
      throw error;
    }
  },

  // Get employee metrics for dashboard - Fix for the missing function
  async getEmployeeMetrics() {
    try {
      console.log('Fetching employee metrics');
      const response = await axios.get(`${API_BASE_URL}/employees/metrics`, {
        headers: getAuthHeader()
      });
      console.log('Metrics API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee metrics:', error);
      // Return a default object with empty metrics to prevent UI errors
      return {
        status: 'error',
        metrics: {
          total_employees: 0,
          active_employees: 0,
          inactive_employees: 0,
          department_distribution: [],
          employment_type_distribution: [],
          pending_requests: {
            leaves: 0,
            schedule_changes: 0,
            official_business: 0
          },
          today_attendance: {
            absent: 0,
            late: 0
          }
        }
      };
    }
  },

  // Get all employees with pagination and filters
  async getEmployees(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters as Record<string, string>
      });
      
      const response = await axios.get(`${API_BASE_URL}/employees?${queryParams}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, profileData: any) {
    try {
      const response = await axios.put(`${API_BASE_URL}/employees/update/${userId}`, profileData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Login user
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout(userId: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/logout`, { userId }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

export default apiService;
