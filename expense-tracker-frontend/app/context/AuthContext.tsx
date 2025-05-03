'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  fullname: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (fullname: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (otp: string, email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (newPassword: string , email: string) => Promise<void>;
  resetVerify: (otp: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('Checking authentication with token:', token.substring(0, 10) + '...');
        
        const response = await authAPI.getCurrentUser();
        console.log('Auth check response:', response);

        if ('status' in response && response.status === 'error') {
          console.error('Auth check failed:', response);
          
          if ('error' in response) {
            if (response.error === 'SERVER_ERROR') {
              toast({
                title: "Server Error",
                description: "Please try again later",
                variant: "destructive",
              });
            } else if (response.error === 'UNAUTHORIZED' || response.error === 'FORBIDDEN') {
              toast({
                title: "Session Expired",
                description: "Please log in again",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Authentication Error",
                description: response.message || "Please log in again",
                variant: "destructive",
              });
            }
          }
          
          localStorage.removeItem('token');
          setUser(null);
          router.push('/login');
          return;
        }

        if ('status' in response && response.status === 'success' && 'user' in response && response.user) {
          console.log('Auth check successful, setting user:', response.user);
          const userData: User = {
            id: response.user.id,
            email: response.user.email,
            fullname: response.user.fullname || ''
          };
          setUser(userData);
          // Don't redirect if we're already on the dashboard
          if (window.location.pathname === '/dashboard') {
            return;
          }
          router.push('/dashboard');
        } else {
          console.error('Invalid auth response:', response);
          localStorage.removeItem('token');
          setUser(null);
          router.push('/login');
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const signup = async (fullname: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(fullname, email, password);
      console.log('Signup successful, redirecting to login');
      toast({
        title: "Registration Successful",
        description: "Please log in with your credentials.",
        variant: "success",
      });
      router.replace('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for email:', email);
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (response.status === 'success' && response.token) {
        localStorage.setItem('tempToken', response.token);
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else if (response.status === 'otp_required') {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        console.error('Login failed:', response);
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('token');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "success",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyOTP = async (otp: string, email: string) => {
    try {
      console.log('Starting OTP verification for email:', email);
      const response = await authAPI.verifyOTP(otp, email);
      console.log('OTP verification response:', response);
      
      if (response.status === 'success' && response.token && response.user) {
        console.log('OTP verification successful, processing response:', {
          token: response.token.substring(0, 10) + '...',
          user: response.user
        });

        // Remove temporary token and set the verified token
        localStorage.removeItem('tempToken');
        localStorage.setItem('token', response.token);
        console.log('Token stored in localStorage');

        const userData: User = {
          id: response.user.id || '',
          email: response.user.email || '',
          fullname: response.user.fullname || ''
        };
        
        // Set user state first
        setUser(userData);
        console.log('User state updated:', userData);
        
        toast({
          title: "Verification Successful",
          description: "Welcome to your dashboard!",
          variant: "success",
        });
        console.log('Success toast shown');

        // Wait a moment for state to update
        setTimeout(() => {
          console.log('Navigating to dashboard...');
          router.replace('/dashboard');
        }, 100);
      } else {
        console.error('OTP verification failed:', response);
        toast({
          title: "Verification Failed",
          description: response.message || "Invalid OTP",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred during verification",
        variant: "destructive",
      });
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await authAPI.sendPasswordResetEmail(email);
      toast({
        title: "Reset Email Sent",
        description: "Please check your email for password reset instructions.",
        variant: "success",
      });
      router.push(`/resetVerify?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.response?.data?.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (newPassword: string , email: string) => {
    try {
      await authAPI.resetPassword(newPassword, email);
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully.",
        variant: "success",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.response?.data?.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetVerify = async (otp: string, email: string) => {
    try {
      const response = await authAPI.verifyOTP(otp, email);
      
      if (response.status === 'success' && response.token && response.user) {
        const userData: User = {
          id: response.user.id || '',
          email: response.user.email || '',
          fullname: response.user.fullname || ''
        };
        
        setUser(userData);
        localStorage.setItem('token', response.token);
        toast({
          title: "OTP Verified",
          description: "Your email has been verified successfully. Please change your password.",
          variant: "success",
        });
        router.push(`/newPassword?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          title: "Verification Failed",
          description: response.message || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Reset verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    verifyOTP,
    sendPasswordResetEmail,
    resetVerify,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 