import publisherUsersData from '@/data/publisheruser/publisheruser.json';
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
export const generateToken = (user: User): string => {
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
    console.log('Validating token:', token);
    const payload = JSON.parse(atob(token));
    console.log('Token payload:', payload);
    
    // 检查是否过期
    if (payload.exp < Date.now()) {
      console.log('Token expired');
      return null;
    }
    
    // 从用户数据中找到对应用户
    const user = publisherUsersData.users.find(u => u.id === payload.userId);
    console.log('User found from token:', user);
    if (!user) {
      console.log('User not found for token');
      return null;
    }
    
    // 构造符合User接口的用户对象
    const userObject: User = {
      id: user.id,
      username: user.username,
      role: user.role as any,
      phone: user.phone,
      balance: user.balance || 0,
      status: 'active',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: new Date().toISOString()
    };
    
    console.log('Validated user object:', userObject);
    return userObject;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

// 登录验证
export const authenticateUser = async (credentials: LoginCredentials): Promise<LoginResult> => {
  const { username, password } = credentials;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 查找用户
  const user = publisherUsersData.users.find(u => 
    u.username === username
  );
  
  if (!user) {
    return {
      success: false,
      message: '用户名不存在'
    };
  }
  
  // 验证密码
  if (user.password !== password) {
    return {
      success: false,
      message: '密码错误'
    };
  }
  
  // 构造符合User接口的用户对象
  const userObject: User = {
    id: user.id,
    username: user.username,
    role: user.role as any,
    phone: user.phone,
    balance: user.balance || 0,
    status: 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: new Date().toISOString()
  };
  
  // 生成Token
  const token = generateToken(userObject);
  
  return {
    success: true,
    user: userObject,
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
      console.log('Saving auth session:', session);
      localStorage.setItem('auth_token', session.token);
      localStorage.setItem('user_info', JSON.stringify(session.user));
      localStorage.setItem('auth_expires', session.expiresAt.toString());
      console.log('Auth session saved to localStorage');
    } catch (error) {
      console.error('保存认证信息失败:', error);
    }
  },
  
  // 获取认证信息
  getAuth: (): AuthSession | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      console.log('Getting auth session from localStorage');
      const token = localStorage.getItem('auth_token');
      const userInfo = localStorage.getItem('user_info');
      const expiresAt = localStorage.getItem('auth_expires');
      
      console.log('Raw localStorage values - token:', token, 'user:', userInfo, 'expires:', expiresAt);
      
      if (!token || !userInfo || !expiresAt) {
        console.log('Missing required auth data in localStorage');
        return null;
      }
      
      // 检查是否过期
      if (parseInt(expiresAt) < Date.now()) {
        console.log('Auth session expired, clearing auth');
        AuthStorage.clearAuth();
        return null;
      }
      
      const authSession = {
        token,
        user: JSON.parse(userInfo),
        expiresAt: parseInt(expiresAt)
      };
      
      console.log('Parsed auth session:', authSession);
      return authSession;
    } catch (error) {
      console.error('获取认证信息失败:', error);
      return null;
    }
  },
  
  // 清除认证信息
  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      console.log('Clearing auth from localStorage');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_expires');
      console.log('Auth cleared from localStorage');
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
    // 根据当前路径判断应该跳转到哪个登录页面
    const currentPath = window.location.pathname;
    let loginPath = '/auth/login/publisherlogin'; // 默认跳转到派单员登录页
    
    if (currentPath.startsWith('/admin')) {
      loginPath = '/auth/login/adminlogin';
    } else if (currentPath.startsWith('/publisher')) {
      loginPath = '/auth/login/publisherlogin';
    } else if (currentPath.startsWith('/commenter')) {
      loginPath = '/auth/login/commenterlogin';
    }
    
    window.location.href = loginPath;
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
  
  // publisheruser.json中没有permissions字段
  return false;
};