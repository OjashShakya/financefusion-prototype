'use client';

import Image from "next/image";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import mainLogo from "../assets/mainLogo.png";
import ResetPassword_icon from "../assets/Resetpassword.png";
import { useAuth } from '../../src/context/AuthContext';

const VerifyOTPContent: React.FC = () => {
  const router = useRouter();
  const { resetVerify } = useAuth();
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleVerifyOTP = async () => {
    setError("");
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetVerify(otp, email);
      if (result.success) {
        router.push(`/newPassword?email=${encodeURIComponent(email)}`);
      } else {
        setError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] flex flex-col items-center">
      <div className="h-[90px] pt-[50px] flex flex-col w-full justify-start max-w-[1200px] max-auto">
        <Image src={mainLogo} alt="Finance Fusion Logo" width={200} height={90} />
      </div>

      <div className="mt-[50px] flex w-full max-w-[1200px] bg-[#f9f9f9] gap-28">
        <div className="flex-1 w-full max-w-[510px] mt-[140px]">
          <div className="flex">
            <p className="text-[47px] text-black mb-[15px] font-medium">Verify Your</p>
            <p className="text-[47px] text-[#27AE60] mb-[15px] pl-[15px] font-medium">OTP</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Enter OTP</h4>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50 bg-white text-black "
          />

          <div className="flex flex-col items-center mt-[15px] gap-4">
            <button 
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-[510px] h-[50px] px-[15px] py-[6px] border-none rounded-lg cursor-pointer text-[20px] font-medium bg-[#27AE60] text-white hover:bg-[#2ECC71] disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <span className="text-sm text-[#333]">
              Didn't receive OTP?{" "}
              <span 
                onClick={() => router.push("/login")}
                className="text-[#27AE60] cursor-pointer hover:underline"
              >
                Resend
              </span>
            </span>
          </div>
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