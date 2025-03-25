'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import mainLogo from "../assets/mainLogo.png";
import Signup_icon from "../assets/signup.png";
import google_icon from "../assets/google.png";
import { useAuth } from "../context/AuthContext";

const Signup: React.FC = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setError("You must accept the terms and policy");
      return;
    }

    setIsLoading(true);
    try {
      await signup(fullname, email, password);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration. Please try again.");
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
            <p className="text-[47px] text-black mb-[15px] font-medium">Create Your</p>
            <p className="text-[47px] text-[#27AE60] mb-[15px] pl-[15px] font-medium">Account</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Full Name</h4>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
          />

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Email</h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
          />

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Password</h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
          />

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Confirm Password</h4>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
          />

          <div className="flex items-center mt-[15px] gap-2">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 border border-[#9E9E9E] rounded cursor-pointer disabled:opacity-50"
            />
            <span className="text-sm text-[#333]">I accept terms and policy</span>
          </div>

          <div className="flex flex-col items-center mt-[15px] gap-4">
            <button 
              onClick={handleSignup}
              disabled={isLoading}
              className="w-[510px] h-[50px] px-[15px] py-[6px] border-none rounded-lg cursor-pointer text-[20px] font-medium bg-[#27AE60] text-white hover:bg-[#2ECC71] disabled:opacity-50"
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
            <span className="text-sm text-[#333]">
              Already have an account?{" "}
              <span 
                onClick={() => router.push("/login")}
                className="text-[#27AE60] cursor-pointer hover:underline"
              >
                Login
              </span>
            </span>
          </div>

          <div className="flex items-center mt-[15px] max-w-[510px]">
            <div className="flex-1 border-b border-[#aaa] mx-2.5 max-w-[40%]"></div>
            <span className="text-[#777] text-sm">Or Continue with</span>
            <div className="flex-1 border-b border-[#aaa] mx-2.5 max-w-[40%]"></div>
          </div>

          <button
            type="button"
            className="flex justify-center items-center mt-[15px] max-w-[510px] w-full h-[50px] rounded-lg border p-[6px_15px] gap-2.5 text-[15px] font-medium hover:scale-105 transition-transform duration-300 disabled:opacity-50"
            onClick={() => alert("Google signup feature coming soon!")}
            disabled={isLoading}
          >
            <Image src={google_icon} alt="Google" width={20} height={20} />
            Google
          </button>
        </div>

        <div className="flex-1">
          <Image src={Signup_icon} alt="Signup Illustration" width={560} height={700} />
        </div>
      </div>
    </div>
  );
};

export default Signup;