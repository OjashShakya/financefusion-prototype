export interface User {
  id: string;
  fullname: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  requiresOTP?: boolean;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  otpStep: boolean;
  otpEmail: string;
  otpType: 'signup' | 'login' | '';
  register: (userData: { fullname: string; email: string; password: string }) => Promise<AuthResponse>;
  verifyOTP: (otp: string) => Promise<AuthResponse>;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  logout: () => void;
  setOtpStep: (value: boolean) => void;
  signup: (fullname: string, email: string, password: string) => Promise<AuthResponse>;
} 