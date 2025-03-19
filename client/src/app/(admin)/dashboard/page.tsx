"use client";

import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/(auth)/signin');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
        >
          Logout
        </Button>
      </div>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Add your dashboard content here */}
        <div className="p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="text-gray-800 dark:text-gray-300">
            Welcome to your dashboard!
          </div>
        </div>
      </div>
    </div>
  );
}