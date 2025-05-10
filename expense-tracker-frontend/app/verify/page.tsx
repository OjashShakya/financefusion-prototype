'use client';

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import mainLogo from "../assets/mainLogo.png";
import ResetPassword_icon from "../assets/Resetpassword.png";
import { useAuth } from "../../src/context/AuthContext";
import { AuthResponse } from "../../src/types/auth";

const VerifyOTPContent: React.FC = () => {
  const router = useRouter();
  const { verifyOTP, otpEmail, error: authError, otpType, user, setOtpType } = useAuth();
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || otpEmail || "";

  // useEffect(() => {
  //   if (!email) {
  //     router.push('/login');
  //   }
  // }, [email, router]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setOtpType("login");
    try {
      const result: AuthResponse = await verifyOTP(otp);
      if (!result.success) {
        setError(result.message || "Invalid OTP. Please try again.");
      }

      console.log("Result", result);


    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/login');
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] flex flex-col items-center">
      <div className="h-[90px] pt-[50px] flex flex-col w-full justify-start max-w-[1200px] max-auto">
        <Image src={mainLogo} alt="Finance Fusion Logo" width={200} height={90} />
      </div>

      <div className="mt-[50px] flex w-full max-w-[1200px] bg-[#f9f9f9] gap-28">
        <div className="flex-1 w-full max-w-[510px] mt-[140px]">
          <div className="flex">
            <p className="text-[47px] text-black mb-[15px] font-medium">Verify Your </p>
            <p className="text-[47px] text-[#27AE60] mb-[15px] pl-[15px] font-medium">Email</p>
          </div>

          {(error || authError) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4 w-full" role="alert">
              <span className="block sm:inline">{error || authError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="w-full">
            <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Enter OTP</h4>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              disabled={isLoading}
              className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50 bg-white text-black"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
            />

            <div className="flex flex-col items-center mt-[15px] gap-4">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-[510px] h-[50px] px-[15px] py-[6px] border-none rounded-lg cursor-pointer text-[20px] font-medium bg-[#27AE60] text-white hover:bg-[#2ECC71] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>
              <span className="text-sm text-[#333]">
                Didn't receive OTP?{" "}
                <span 
                  onClick={handleBack}
                  className="text-[#27AE60] cursor-pointer hover:underline"
                >
                  Go back
                </span>
              </span>
            </div>
          </form>
        </div>

        <div className="flex-1">
          <Image src={ResetPassword_icon} alt="Forgot Password Illustration" width={560} height={700} />
        </div>
      </div>
    </div>
  );
};

const VerifyOTP: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#27AE60] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
};

export default VerifyOTP; 