'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { AuthStorage, AuthSession, LoginCredentials, authenticateUser, logout as logoutUser } from '@/lib/auth';

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 初始化用户状态
  useEffect(() => {
    const initializeAuth = () => {
      // 确保在客户端执行
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        const auth = AuthStorage.getAuth();
        if (auth) {
          setUser(auth.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 登录函数
  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      const result = await authenticateUser(credentials);
      
      if (result.success && result.user && result.token) {
        const session: AuthSession = {
          user: result.user,
          token: result.token,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24小时
        };
        
        // 保存认证信息
        AuthStorage.saveAuth(session);
        
        // 更新状态
        setUser(result.user);
        setIsLoggedIn(true);
        
        return {
          success: true,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: '登录过程中发生错误，请重试'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const handleLogout = () => {
    AuthStorage.clearAuth();
    setUser(null);
    setIsLoggedIn(false);
    
    // 触发全局登出
    logoutUser();
  };

  // 刷新用户信息
  const refreshUser = () => {
    const auth = AuthStorage.getAuth();
    if (auth) {
      setUser(auth.user);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // 更新用户信息
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // 更新存储的用户信息
    const auth = AuthStorage.getAuth();
    if (auth) {
      const updatedSession: AuthSession = {
        ...auth,
        user: updatedUser
      };
      AuthStorage.saveAuth(updatedSession);
    }
  };

  return {
    user,
    isLoading,
    isLoggedIn,
    login: handleLogin,
    logout: handleLogout,
    refreshUser,
    updateUser,
    isAuthenticated: isLoggedIn && !!user
  };
}