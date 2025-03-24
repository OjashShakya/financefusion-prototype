'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import mainLogo from "../assets/mainLogo.png";
import OTP_icon from "../../../assets/otp.png";
import NewPassword_icon from "../assets/Newpassword.png";
import { useAuth } from "../context/AuthContext";

const NewPassword: React.FC = () => {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(password);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
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
        <div className="flex-1 w-full max-w-[510px] mt-[40px]">
          <div className="flex">
            <p className="text-[47px] text-black mb-[15px] font-medium">Reset Your</p>
            <p className="text-[47px] text-[#27AE60] mb-[15px] pl-[15px] font-medium">Password</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">New Password</h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
          />

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Confirm Password</h4>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
          />

          <div className="flex flex-col items-center mt-[15px] gap-4">
            <button 
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-[510px] h-[50px] px-[15px] py-[6px] border-none rounded-lg cursor-pointer text-[20px] font-medium bg-[#27AE60] text-white hover:bg-[#2ECC71] disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
            <span className="text-sm text-[#333]">
              Remember your password?{" "}
              <span 
                onClick={() => router.push("/login")}
                className="text-[#27AE60] cursor-pointer hover:underline"
              >
                Login
              </span>
            </span>
          </div>
        </div>

        <div className="flex-1">
          <Image src={NewPassword_icon} alt="New Password Illustration" width={560} height={700} />
        </div>
      </div>
    </div>
  );
};

export default NewPassword; 