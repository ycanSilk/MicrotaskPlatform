// 简化的认证系统，用于演示
import usersData from '@/data/users.json';

export interface SimpleUser {
  id: string;
  username: string;
  role: string;
  nickname?: string;
  balance: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: SimpleUser;
  message: string;
}

// 简化的登录验证
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
  
  // 返回简化的用户信息
  const simpleUser: SimpleUser = {
    id: user.id,
    username: user.username,
    role: user.role,
    nickname: user.nickname,
    balance: user.balance
  };
  
  return {
    success: true,
    user: simpleUser,
    message: '登录成功'
  };
};

// 根据角色获取跳转路径
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

// 简化的本地存储管理
export const SimpleStorage = {
  saveUser: (user: SimpleUser): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('current_user', JSON.stringify(user));
      } catch (error) {
        console.error('保存用户信息失败:', error);
      }
    }
  },
  
  getUser: (): SimpleUser | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  },
  
  clearUser: (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('current_user');
      } catch (error) {
        console.error('清除用户信息失败:', error);
      }
    }
  }
};