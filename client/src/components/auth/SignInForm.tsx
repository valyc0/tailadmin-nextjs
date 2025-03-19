"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { FormEvent, useState } from "react";

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="fill-gray-500 dark:fill-gray-400">{children}</div>
);

export default function SignInForm() {
  const { login, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    try {
      setLoading(true);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Server timeout')), 15000)
      );
      
      await Promise.race([
        login(username, password),
        timeoutPromise
      ]);
    } catch (err: any) {
      console.error("Login error:", err);
      if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Unable to connect to server. Please try again later.");
      } else if (err.message === 'Server timeout') {
        setError("Server is not responding. Please try again later.");
      } else {
        setError(err.message || "Invalid username or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                {error && (
                  <div className="p-4 text-lg font-bold text-red-600 bg-red-100 rounded border-l-4 border-red-600">
                    ⚠️ {error}
                  </div>
                )}
              </div>
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  placeholder="admin"
                  type="text"
                  defaultValue={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    defaultValue={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <IconWrapper><EyeIcon /></IconWrapper>
                    ) : (
                      <IconWrapper><EyeCloseIcon /></IconWrapper>
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={loading || authLoading}
                >
                  {(loading || authLoading) ? (
                    <div className="flex justify-center items-center">
                      <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
