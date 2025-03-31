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
  resetPassword: (newPassword: string) => Promise<void>;
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
        if (token) {
          const userData = await authAPI.getCurrentUser();
          console.log(token)
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (fullname: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(fullname, email, password);
      toast({
        title: "Registration Successful",
        description: "Please check your email for OTP verification.",
        variant: "success",
      });
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
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
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "success",
      });
      // Force a hard navigation to ensure the page reloads with the new auth state
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
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
      const response = await authAPI.verifyOTP(otp, email);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      toast({
        title: "OTP Verified",
        description: "Your email has been verified successfully. Please log in.",
        variant: "success",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      throw error;
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

  const resetPassword = async (newPassword: string) => {
    try {
      await authAPI.resetPassword(newPassword);
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
      setUser(response.user);
      localStorage.setItem('token', response.token);
      toast({
        title: "OTP Verified",
        description: "Your email has been verified successfully. Please Change your password.",
        variant: "success",
      });
      router.push('/newPassword');
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      throw error;
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