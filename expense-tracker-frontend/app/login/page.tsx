'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import mainLogo from "../assets/mainLogo.png";
import Login_icon from "../assets/Login.png";
import { useAuth } from '../../src/context/AuthContext';
import { Eye, EyeOff } from "lucide-react";
import { AuthResponse } from '../../src/types/auth';

const Login: React.FC = () => {
  const router = useRouter();
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result: AuthResponse = await login({ email, password });
      if (result.success && result.requiresOTP) {
        router.push('/verify');
      } else if (!result.success) {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full min-h-screen bg-[#f9f9f9] flex flex-col items-center">
      <div className="h-[90px] pt-[50px] flex flex-col w-full justify-start max-w-[1200px] max-auto">
        <Image src={mainLogo} alt="Finance Fusion Logo" width={200} height={90} />
      </div>

      <div className="mt-[80px] flex w-full max-w-[1200px] bg-[#f9f9f9] gap-28">
        <div className="flex-1 mt-[120px]">
          <div className="flex">
            <p className="text-[47px] text-black mb-[15px] font-medium">Login to Your</p>
            <p className="text-[47px] text-[#27AE60] mb-[15px] pl-[15px] font-medium">Account</p>
          </div>

          {(error || authError) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error || authError}</span>
            </div>
          )}

          <h4 className="text-[20px] font-medium text-[#333] mt-[25px] mb-[5px]">Email</h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50 bg-white text-black"
          />

          <div className="flex justify-between items-center w-full max-w-[510px]">
            <h4 className="text-[20px] font-medium text-[#333] mt-[25px] mb-[5px]">Password</h4>
            <span
              className="text-sm font-medium text-[#757575] mt-[25px] mb-[5px] cursor-pointer hover:text-[#3b3a3a]"
              onClick={() => router.push("/resetPassword")}
            >
              Forgot Password?
            </span>
          </div>

          <div className="relative max-w-[510px]">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50 bg-white text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex mt-[25px] gap-5">
            <button 
              type="submit" 
              className="w-[246.5px] h-[50px] px-[15px] py-[6px] border-none rounded-lg cursor-pointer text-[20px] font-medium bg-[#27AE60] text-white hover:bg-[#2ECC71] disabled:opacity-50 relative overflow-hidden group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-[246.5px] h-[50px] px-[15px] py-[6px] border border-[#27AE60] rounded-lg cursor-pointer text-[20px] font-medium bg-transparent text-[#27AE60] hover:bg-[#27AE60] hover:text-white transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="flex-1">
          <Image src={Login_icon} alt="Login Illustration" width={560} height={700} />
        </div>
      </div>
    </form>
  );
};

export default Login;
