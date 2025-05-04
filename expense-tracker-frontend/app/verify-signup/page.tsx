'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import Image from 'next/image';
import mainLogo from '../assets/mainLogo.png';

const VerifySignup = () => {
  const router = useRouter();
  const { verifyOTP, otpEmail, error: authError, otpType } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from localStorage if not in context
    const storedEmail = localStorage.getItem('otpEmail');
    if (!otpEmail && !storedEmail) {
      setError("Email not found. Please try signing up again.");
      return;
    }
    setEmail(otpEmail || storedEmail || '');
  }, [otpEmail]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await verifyOTP(otp);
      if (result.success) {
        // The navigation will be handled by the AuthContext
        return;
      }
      setError(result.message || 'OTP verification failed');
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // If not in signup verification flow, redirect to appropriate page
  useEffect(() => {
    if (otpType && otpType !== 'signup') {
      router.push('/verify');
    }
  }, [otpType, router]);

  if (!email) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">Email not found. Please try signing up again.</p>
          <button
            onClick={() => router.push('/signup')}
            className="bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-[#2ECC71]"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center">
      <div className="h-[90px] pt-[50px] flex flex-col w-full justify-start max-w-[1200px] max-auto">
        <Image src={mainLogo} alt="Finance Fusion Logo" width={200} height={90} />
      </div>

      <div className="mt-[80px] flex flex-col items-center w-full max-w-[510px] p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Verify Your Email</h1>
        <p className="text-gray-600 mb-8 text-center">
          We've sent a verification code to {email}. Please enter the code below to verify your account.
        </p>

        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4 w-full" role="alert">
            <span className="block sm:inline">{error || authError}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="w-full">
          <div className="mb-6">
            <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
              placeholder="Enter 6-digit code"
              required
              disabled={isLoading}
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#27AE60] text-white py-3 px-4 rounded hover:bg-[#2ECC71] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifySignup; 