import usersData from '@/data/users.json';
import { User } from '@/types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  message: string;
  token?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

// 生成简单的JWT Token（仅用于演示）
const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24小时过期
  };
  
  // 简单的Base64编码（生产环境需要使用真正的JWT）
  return btoa(JSON.stringify(payload));
};

// 验证Token
export const validateToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token));
    
    // 检查是否过期
    if (payload.exp < Date.now()) {
      return null;
    }
    
    // 从用户数据中找到对应用户
    const user = usersData.users.find(u => u.id === payload.userId);
    return user as User || null;
  } catch (error) {
    return null;
  }
};

// 登录验证
export const authenticateUser = async (credentials: LoginCredentials): Promise<LoginResult> => {
  const { username, password } = credentials;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 查找用户
  const user = usersData.users.find(u => 
    u.username === username && u.status === 'active'
  );
  
  if (!user) {
    return {
      success: false,
      message: '用户名不存在或账户已被禁用'
    };
  }
  
  // 验证密码
  if (user.password !== password) {
    return {
      success: false,
      message: '密码错误'
    };
  }
  
  // 生成Token
  const token = generateToken(user as User);
  
  // 更新最后登录时间（在实际应用中这应该更新到数据库）
  const updatedUser = {
    ...user,
    lastLoginAt: new Date().toISOString()
  } as User;
  
  return {
    success: true,
    user: updatedUser,
    token,
    message: '登录成功'
  };
};

// 本地存储管理
export const AuthStorage = {
  // 保存认证信息
  saveAuth: (session: AuthSession): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('auth_token', session.token);
      localStorage.setItem('user_info', JSON.stringify(session.user));
      localStorage.setItem('auth_expires', session.expiresAt.toString());
    } catch (error) {
      console.error('保存认证信息失败:', error);
    }
  },
  
  // 获取认证信息
  getAuth: (): AuthSession | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const token = localStorage.getItem('auth_token');
      const userInfo = localStorage.getItem('user_info');
      const expiresAt = localStorage.getItem('auth_expires');
      
      if (!token || !userInfo || !expiresAt) {
        return null;
      }
      
      // 检查是否过期
      if (parseInt(expiresAt) < Date.now()) {
        AuthStorage.clearAuth();
        return null;
      }
      
      return {
        token,
        user: JSON.parse(userInfo),
        expiresAt: parseInt(expiresAt)
      };
    } catch (error) {
      console.error('获取认证信息失败:', error);
      return null;
    }
  },
  
  // 清除认证信息
  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_expires');
    } catch (error) {
      console.error('清除认证信息失败:', error);
    }
  },
  
  // 检查是否已登录
  isLoggedIn: (): boolean => {
    return AuthStorage.getAuth() !== null;
  },
  
  // 获取当前用户
  getCurrentUser: (): User | null => {
    const auth = AuthStorage.getAuth();
    return auth ? auth.user : null;
  }
};

// 登出
export const logout = (): void => {
  AuthStorage.clearAuth();
  
  // 重定向到登录页
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

// 根据角色获取默认跳转路径
export const getRoleHomePath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'publisher':
      return '/publisher/dashboard';
    case 'commenter':
      return '/commenter/hall';
    default:
      return '/';
  }
};

// 检查权限
export const hasPermission = (user: User, permission: string): boolean => {
  if (user.role === 'admin') {
    return true; // 管理员拥有所有权限
  }
  
  if ('permissions' in user && Array.isArray(user.permissions)) {
    return (user.permissions as string[]).includes(permission);
  }
  
  return false;
};