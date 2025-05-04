'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import mainLogo from "../assets/mainLogo.png";
import Signup_icon from "../assets/signup.png";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Signup: React.FC = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 5;
    const maxLength = 15;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);
    
    if (password.length < minLength) {
      return "Password must be at least 5 characters long";
    }
    if (password.length > maxLength) {
      return "Password must be less than 15 characters";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateFullname = (name: string) => {
    if (name.length < 6) {
      return "Name must be at least 6 characters";
    }
    if (name.length > 50) {
      return "Name must be less than 50 characters";
    }
    return "";
  };

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

    const fullnameError = validateFullname(fullname);
    if (fullnameError) {
      setError(fullnameError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
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

      <div className="mt-[80px] flex w-full max-w-[1200px] bg-[#f9f9f9] gap-28">
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
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50 bg-white text-black"
          />

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Email</h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50 bg-white text-black"
          />

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Password</h4>
          <div className="relative">
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

          <h4 className="text-[20px] font-medium text-[#333] mt-[15px] mb-[5px]">Confirm Password</h4>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full max-w-[510px] p-2.5 border border-[#9E9E9E] rounded-[5px] text-sm h-[50px] disabled:opacity-50 bg-white text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center mt-[15px] gap-2">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 border border-[#9E9E9E] rounded cursor-pointer disabled:opacity-50 bg-white"
            />
            <span className="text-sm text-[#333]">I accept terms and policy</span>
          </div>

          <div className="flex flex-col items-center mt-[15px] gap-4">
            <button 
              onClick={handleSignup}
              disabled={isLoading}
              className="w-[510px] h-[50px] px-[15px] py-[6px] border-none rounded-lg cursor-pointer text-[20px] font-medium bg-[#27AE60] text-white hover:bg-[#2ECC71] disabled:opacity-50 relative overflow-hidden group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Signing up...</span>
                </div>
              ) : (
                <span className="relative z-10">Sign up</span>
              )}
              <div className="absolute inset-0 bg-[#2ECC71] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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
        </div>

        <div className="flex-1">
          <Image src={Signup_icon} alt="Signup Illustration" width={560} height={700} />
        </div>
      </div>
    </div>
  );
};

export default Signup;