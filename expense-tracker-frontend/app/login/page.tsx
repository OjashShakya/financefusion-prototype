'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import mainLogo from "../assets/mainLogo.png";
import Login_icon from "../assets/Login.png";
import google_icon from "../assets/google.png";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // router.push("/components/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login feature coming soon!");
  };

  return (
    <form onSubmit={handleLogin} className="w-full min-h-screen bg-[#f9f9f9] flex flex-col items-center">
      <div className="h-[90px] pt-[50px] flex flex-col w-full justify-start max-w-[1200px] max-auto">
        <Image src={mainLogo} alt="Finance Fusion Logo" width={200} height={90} />
      </div>

      <div className="mt-[50px] flex w-full max-w-[1200px] bg-[#f9f9f9] gap-28">
        <div className="flex-1 mt-[120px]">
          <div className="flex">
            <p className="text-[47px] text-black mb-[15px] font-medium">Login to Your</p>
            <p className="text-[47px] text-[#27AE60] mb-[15px] pl-[15px] font-medium">Account</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <h4 className="text-[20px] font-medium text-[#333] mt-[25px] mb-[5px]">Email</h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
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

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50"
          />

          <div className="flex mt-[25px] gap-5">
            <button 
              type="submit" 
              className="w-[246.5px] h-[50px] px-[15px] py-[6px] border-none rounded-lg cursor-pointer text-[20px] font-medium bg-[#27AE60] text-white hover:bg-[#2ECC71] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              className="w-[246.5px] h-[50px] px-[15px] py-[6px] border rounded-lg cursor-pointer text-[20px] font-medium bg-white hover:bg-[#e9e7e7] disabled:opacity-50"
              onClick={() => router.push("/signup")}
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>

          <div className="flex items-center mt-[25px] max-w-[510px]">
            <div className="flex-1 border-b border-[#aaa] mx-2.5 max-w-[40%]"></div>
            <span className="text-[#777] text-sm">Or Continue with</span>
            <div className="flex-1 border-b border-[#aaa] mx-2.5 max-w-[40%]"></div>
          </div>

          <button
            type="button"
            className="flex justify-center items-center mt-[27px] max-w-[510px] w-full h-[50px] rounded-lg border p-[6px_15px] gap-2.5 text-[15px] font-medium hover:scale-105 transition-transform duration-300 disabled:opacity-50"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Image src={google_icon} alt="Google" width={20} height={20} />
            Google
          </button>
        </div>

        <div className="flex-1">
          <Image src={Login_icon} alt="Login Illustration" width={560} height={700} />
        </div>
      </div>
    </form>
  );
};

export default Login;
