"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface LoadingWrapperProps {
  children: ReactNode;
  isLoading: boolean;
}

const LoadingWrapper = ({ children, isLoading }: LoadingWrapperProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  return <>{children}</>;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = sessionStorage.getItem('token');
        if (!storedToken) {
          setIsAuthenticated(false);
          setToken(null);
          setIsLoading(false);
          return;
        }

        const isValid = await validateToken(storedToken);
        if (!isValid) {
          sessionStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        sessionStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const handleRouting = async () => {
      if (isLoading) return;

      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/signin';

      if (isAuthenticated === false && !isAuthPage) {
        // Prevent any route changes while transitioning
        setIsLoading(true);
        await router.push('/signin');
        setIsLoading(false);
      } else if (isAuthenticated === true && isAuthPage) {
        // Redirect to home if authenticated and on signin page
        setIsLoading(true);
        await router.push('/');
        setIsLoading(false);
      }
    };

    handleRouting();
  }, [isLoading, isAuthenticated, router]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Invalid username or password';
        throw new Error(errorMessage);
      }

      const newToken = data.token;
      
      sessionStorage.setItem('token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const currentToken = sessionStorage.getItem('token');
      
      if (currentToken) {
        // Do backend logout first
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
          credentials: 'include'
        });
      }

      // Clear session storage and React state only after successful backend logout
      sessionStorage.clear();
      setToken(null);
      setIsAuthenticated(false);
      
      // Use router.push instead of window.location.replace
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // If backend logout fails, still clear local state for security
      sessionStorage.clear();
      setToken(null);
      setIsAuthenticated(false);
      router.push('/signin');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, token }}>
      <LoadingWrapper isLoading={isLoading}>
        {children}
      </LoadingWrapper>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}