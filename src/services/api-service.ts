// Base API service for handling API requests

const API_BASE_URL = 'http://localhost/codeigniter_v1/index.php';

class ApiService {
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      console.log(`API Service: Fetching user profile for ID: ${userId}`);
      const token = localStorage.getItem('token');
      
      // Log the request URL and headers for debugging
      const requestUrl = `${API_BASE_URL}/EmployeeController/getEmployee/${userId}`;
      console.log('Request URL:', requestUrl);
      console.log('Request headers:', {
        'Authorization': token ? `Bearer ${token}` : 'No token available',
        'Content-Type': 'application/json',
      });
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Log response status and headers for debugging
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || `Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, profileData: any): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/EmployeeController/updateEmployee/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  async getEmployees(page = 1, limit = 10, filters = {}): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await fetch(`${API_BASE_URL}/EmployeeController/employees?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employees');
      }

      return await response.json();
    } catch (error) {
      console.error('Get employees error:', error);
      throw error;
    }
  }

  async getDashboardMetrics(): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/EmployeeController/metrics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get dashboard metrics error:', error);
      throw error;
    }
  }

  async getTimeRecords(employeeId: string, filters = {}): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        employee_id: employeeId,
        ...filters,
      });

      const response = await fetch(`${API_BASE_URL}/EmployeeController/timeRecords?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch time records');
      }

      return await response.json();
    } catch (error) {
      console.error('Get time records error:', error);
      throw error;
    }
  }

  async getLeaveRequests(employeeId?: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        ...(employeeId ? { employee_id: employeeId } : {}),
      });

      const response = await fetch(`${API_BASE_URL}/EmployeeController/leaveRequests?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch leave requests');
      }

      return await response.json();
    } catch (error) {
      console.error('Get leave requests error:', error);
      throw error;
    }
  }

  async getLeaveBalance(employeeId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      
      console.log(`Fetching leave balance for employee ID: ${employeeId}`);
      
      const response = await fetch(`${API_BASE_URL}/EmployeeController/leaveBalance/${employeeId}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        // Add these options to help with CORS
        mode: 'cors',
        credentials: 'same-origin'
      });

      // Log response status for debugging
      console.log('Leave balance response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch leave balance');
      }

      const data = await response.json();
      console.log('Leave balance data:', data);
      return data;
    } catch (error) {
      console.error('Get leave balance error:', error);
      // Return default structure to prevent UI errors
      return {
        status: 'error',
        message: error.message || 'Could not connect to server',
        balance: {
          annual: 0,
          sick: 0,
          emergency: 0,
          maternity: 0,
          paternity: 0,
          bereavement: 0,
          unpaid: "Unlimited"
        }
      };
    }
  }

  async submitLeaveRequest(leaveData: any): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      
      console.log('Submitting leave request with data:', leaveData);
      
      const response = await fetch(`${API_BASE_URL}/EmployeeController/submitLeaveRequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      const responseData = await response.json();
      console.log('Leave request response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit leave request');
      }

      return responseData;
    } catch (error) {
      console.error('Submit leave request error:', error);
      throw error;
    }
  }

  async cancelLeaveRequest(leaveId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/EmployeeController/cancelLeaveRequest/${leaveId}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel leave request');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel leave request error:', error);
      throw error;
    }
  }

  async getEmployeeMetrics(): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/EmployeeController/metrics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employee metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get employee metrics error:', error);
      throw error;
    }
  }

  async getAttendanceMetrics(employeeId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/EmployeeController/attendanceMetrics/${employeeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch attendance metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get attendance metrics error:', error);
      throw error;
    }
  }

  async verifySession(userId: string): Promise<any> {
    try {
      console.log('Verifying session for user ID:', userId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { status: 'error', valid: false };
      }
      
      // We can either make a dedicated endpoint for session verification,
      // or simply try to fetch the user profile which requires authentication
      try {
        const response = await fetch(`${API_BASE_URL}/EmployeeController/getEmployee/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        // If response is successful, the session is valid
        if (response.ok) {
          return { status: 'success', valid: true };
        } else {
          return { status: 'error', valid: false };
        }
      } catch (networkError) {
        console.error('Network error during verification:', networkError);
        // Return valid=true on network errors to prevent unnecessary logouts
        return { status: 'error', valid: true, error: networkError };
      }
    } catch (error) {
      console.error('Session verification error:', error);
      return { status: 'error', valid: false };
    }
  }

  async submitOfficialBusinessRequest(requestData: any): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      
      // Convert the time field names to match the backend expectations
      const formattedData = {
        ...requestData,
        // Make sure we're using consistent naming that matches the database columns
        time_departure: requestData.timeOfDeparture || requestData.time_departure,
        time_arrival: requestData.timeOfArrival || requestData.time_arrival,
      };
      
      // Remove the original fields if they exist to avoid duplication
      if (formattedData.timeOfDeparture) delete formattedData.timeOfDeparture;
      if (formattedData.timeOfArrival) delete formattedData.timeOfArrival;
      
      console.log('API Submitting formatted data:', formattedData);
      
      const response = await fetch(`${API_BASE_URL}/EmployeeController/submitOfficialBusiness`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit official business request');
      }

      return responseData;
    } catch (error) {
      console.error('Submit official business request error:', error);
      throw error;
    }
  }

  async getOfficialBusinessRequests(employeeId?: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        ...(employeeId ? { employee_id: employeeId } : {}),
      });

      const response = await fetch(`${API_BASE_URL}/EmployeeController/officialBusiness?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch official business requests');
      }

      return await response.json();
    } catch (error) {
      console.error('Get official business requests error:', error);
      throw error;
    }
  }

  async submitScheduleChangeRequest(scheduleData: any): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      
      // Make sure date fields are properly formatted
      const formattedData = {
        ...scheduleData,
        date: scheduleData.date || new Date().toISOString().split("T")[0],
        date_of_absence: scheduleData.date_of_absence || new Date().toISOString().split("T")[0],
      };
      
      console.log('Submitting schedule change request with data:', formattedData);
      
      const response = await fetch(`${API_BASE_URL}/EmployeeController/submitScheduleChange`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const responseData = await response.json();
      console.log('Schedule change response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit schedule change request');
      }

      return responseData;
    } catch (error) {
      console.error('Submit schedule change request error:', error);
      throw error;
    }
  }

  async getScheduleChangeRequests(employeeId?: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        ...(employeeId ? { employee_id: employeeId } : {}),
      });

      const response = await fetch(`${API_BASE_URL}/EmployeeController/scheduleChanges?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch schedule change requests');
      }

      return await response.json();
    } catch (error) {
      console.error('Get schedule change requests error:', error);
      throw error;
    }
  }

  async cancelScheduleChange(requestId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/EmployeeController/cancelScheduleChange/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel schedule change request');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel schedule change request error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
