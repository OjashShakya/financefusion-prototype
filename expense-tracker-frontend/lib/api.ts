import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401/403 errors for non-auth endpoints
    if (error.response?.status === 401 || error.response?.status === 403) {
      const url = error.config?.url || '';
      if (!url.includes('/users/login') && !url.includes('/users/verify-otp')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (fullname: string, email: string, password: string) => {
    const response = await api.post('/users/register', { fullname, email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    try {
      console.log('Making login request to:', `${API_URL}/users/login`);
      console.log('Request payload:', { email, password });
      
      const response = await api.post('/users/login', { 
        email, 
        password 
      });

      // Log the entire response object for debugging
      console.log('Full response object:', {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config
      });

      // If response is empty or invalid
      if (!response || !response.data || Object.keys(response.data).length === 0) {
        console.error('Empty or invalid response from server');
        return {
          status: 'error',
          message: 'Server returned an empty response',
          error: 'EMPTY_RESPONSE'
        };
      }

      // Check for OTP requirement
      if (response.data.requiresOTP || response.data.message?.includes('OTP')) {
        return {
          status: 'otp_required',
          email: email,
          message: response.data.message || 'OTP has been sent to your email'
        };
      }

      // Check for successful login
      if (response.data.token || response.data.accessToken) {
        const token = response.data.token || response.data.accessToken;
        
        // Validate token format
        if (typeof token !== 'string' || token.length < 10) {
          console.error('Invalid token format received');
          return {
            status: 'error',
            message: 'Invalid token received from server',
            error: 'INVALID_TOKEN'
          };
        }

        return {
          status: 'success',
          token: token,
          user: response.data.user || {
            email: email,
            id: response.data.userId || response.data.id
          }
        };
      }

      // If we get here, return the response data as is
      return {
        status: 'success',
        ...response.data
      };

    } catch (error: any) {
      console.error('Login API error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        return {
          status: 'error',
          message: 'Invalid email or password',
          error: 'INVALID_CREDENTIALS'
        };
      }

      if (error.response?.status === 403) {
        return {
          status: 'error',
          message: 'Access forbidden',
          error: 'FORBIDDEN'
        };
      }

      // Return a structured error response
      return {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Login failed',
        error: error.response?.data || 'UNKNOWN_ERROR'
      };
    }
  },

  verifyOTP: async (otp: string, email: string) => {
    try {
      console.log('Verifying OTP...', { email, otpLength: otp.length });
      
      // Validate OTP format
      if (!otp || otp.length !== 6) {
        return {
          status: 'error',
          message: 'Invalid OTP format. OTP must be 6 digits.',
          error: 'INVALID_OTP_FORMAT'
        };
      }

      const response = await api.post('/users/verify-otp', { otp, email });
      
      if (!response || !response.data) {
        return {
          status: 'error',
          message: 'Invalid response from server',
          error: 'INVALID_RESPONSE'
        };
      }

      // Log the response for debugging
      console.log('OTP verification response:', response.data);

      // Handle 500 error from backend
      if (response.status === 500) {
        console.error('Server error:', response.data);
        return {
          status: 'error',
          message: 'Server error occurred',
          error: 'SERVER_ERROR'
        };
      }

      // Check for successful verification
      if (response.data.token) {
        // Store token immediately
        localStorage.setItem('token', response.data.token);
        
        return {
          status: 'success',
          token: response.data.token,
          user: {
            id: response.data.user?.id || '',
            email: email,
            fullname: response.data.user?.fullname || ''
          }
        };
      }
      
      return {
        status: 'error',
        message: response.data.message || 'Invalid OTP',
        error: 'INVALID_OTP'
      };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Log the error response for debugging
        console.error('Error response:', {
          status,
          data,
          headers: error.response.headers
        });

        return {
          status: 'error',
          message: data?.message || 'Verification failed',
          error: status === 400 ? 'INVALID_OTP' :
                 status === 401 ? 'UNAUTHORIZED' :
                 status === 403 ? 'FORBIDDEN' :
                 status === 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR'
        };
      }

      return {
        status: 'error',
        message: error.message || 'An unexpected error occurred',
        error: 'UNKNOWN_ERROR'
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        return {
          status: 'error',
          message: 'No authentication token found',
          error: 'NO_TOKEN'
        };
      }

      console.log('Fetching current user with token:', token.substring(0, 10) + '...');
      
      // Add token to request headers
      const response = await api.get<{ user: { id: string; email: string; fullname?: string } }>('/current-user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        // Log the complete error object for debugging
        console.error('API Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          },
          stack: error.stack
        });

        // Handle 500 error specifically
        if (error.response?.status === 500) {
          console.error('Server error details:', {
            message: error.response.data?.message || 'Unknown server error',
            error: error.response.data?.error || 'SERVER_ERROR',
            details: error.response.data
          });
          
          // Clear invalid token
          localStorage.removeItem('token');
          
          return {
            status: 'error',
            message: 'Server error occurred while fetching user data',
            error: 'SERVER_ERROR',
            details: error.response.data
          };
        }

        throw error;
      });

      // Type guard to check if response is an error object
      if (response && 'status' in response && response.status === 'error') {
        return response;
      }

      // Type guard to check if response is an AxiosResponse
      if (!response || !('data' in response) || !response.data) {
        console.error('Empty response from server');
        return {
          status: 'error',
          message: 'Invalid response from server',
          error: 'INVALID_RESPONSE'
        };
      }

      // Log the response for debugging
      console.log('Current user response:', response.data);

      // Ensure we have the minimum required user data
      if (!response.data.user || !response.data.user.email) {
        console.error('Invalid user data:', response.data);
        localStorage.removeItem('token');
        return {
          status: 'error',
          message: 'Invalid user data received',
          error: 'INVALID_USER_DATA'
        };
      }

      // Validate user data structure
      const userData = response.data.user;
      if (!userData.id || !userData.email) {
        console.error('Missing required user fields:', userData);
        localStorage.removeItem('token');
        return {
          status: 'error',
          message: 'Invalid user data structure',
          error: 'INVALID_USER_STRUCTURE'
        };
      }

      return {
        status: 'success',
        user: {
          id: userData.id,
          email: userData.email,
          fullname: userData.fullname || ''
        }
      };
    } catch (error: any) {
      console.error('Error fetching current user:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Log the error response for debugging
        console.error('Error response:', {
          status,
          data,
          headers: error.response.headers
        });

        // Clear token for authentication errors
        if (status === 401 || status === 403 || status === 500) {
          localStorage.removeItem('token');
        }

        return {
          status: 'error',
          message: data?.message || 'Authentication failed',
          error: status === 401 ? 'UNAUTHORIZED' : 
                 status === 403 ? 'FORBIDDEN' : 
                 status === 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR',
          details: data
        };
      }

      return {
        status: 'error',
        message: error.message || 'An unexpected error occurred',
        error: 'UNKNOWN_ERROR'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  sendPasswordResetEmail: async (email: string) => {
    const response = await api.post('/users/password-reset/request', { email });
    return response.data;
  },

  resetPassword: async (newPassword: string, email: string) => {
    const response = await api.post('/users/password-reset/reset', { newPassword, email });
    return response.data;
  },
};

export default api; 