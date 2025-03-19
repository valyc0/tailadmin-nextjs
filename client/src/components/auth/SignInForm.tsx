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
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await login(username, password);
    } catch (error) {
      // Display the error message from the server if available
      const errorMessage = error instanceof Error
        ? error.message
        : "Authentication failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login error details:", error);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-error-500 bg-error-50 rounded-lg">
                  {error}
                </div>
              )}
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
                {loading ? (
                  <div className="flex justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                  >
                    Sign in
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
