# Next.js + TypeScript + Tailwind CSS 技术实现方案

## 一、项目架构设计

### 1. Next.js 项目结构
```
douyin-task-system/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── hall/               # 任务大厅
│   │   ├── tasks/              # 我的任务
│   │   ├── earnings/           # 收益中心
│   │   ├── invite/             # 邀请好友
│   │   ├── profile/            # 个人中心
│   │   └── admin/              # 管理后台
│   ├── components/             # 组件库
│   │   ├── ui/                 # 基础UI组件
│   │   ├── business/           # 业务组件
│   │   └── layout/             # 布局组件
│   ├── lib/                    # 工具库
│   │   ├── utils.ts            # 通用工具函数
│   │   ├── api.ts              # API配置
│   │   └── constants.ts        # 常量定义
│   ├── hooks/                  # 自定义Hooks
│   ├── types/                  # TypeScript类型定义
│   └── store/                  # 状态管理
├── public/                     # 静态资源
├── tailwind.config.js          # Tailwind配置
├── next.config.js              # Next.js配置
└── tsconfig.json               # TypeScript配置
```

### 2. 核心配置文件

#### Next.js 配置 (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // H5移动端优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 图片优化
  images: {
    domains: ['douyin-api.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // PWA支持
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### Tailwind CSS 配置
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // H5移动端适配
      screens: {
        'xs': '320px',
        'sm': '375px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
      },
      // 设计系统颜色
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4A90E2',  // 主色
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        role: {
          admin: '#8B5CF6',
          publisher: '#4A90E2',
          commenter: '#10B981',
        }
      },
      // rem间距系统
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      // 移动端优化字体
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      // 安全区域适配
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // 动画
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

## 二、TypeScript 类型系统

### 1. 核心业务类型定义
```typescript
// types/index.ts

// 用户角色
export type UserRole = 'admin' | 'publisher' | 'commenter';

// 用户信息
export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  balance: number;
  level: number;
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  updatedAt: string;
}

// 任务相关
export interface Task {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  commentUrl?: string;
  price: number;
  total: number;
  remaining: number;
  requirements: TaskRequirement[];
  category: string;
  difficulty: 1 | 2 | 3;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  publisherId: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRequirement {
  type: 'comment' | 'like' | 'follow' | 'share';
  count?: number;
  atUser?: string;
  template?: string;
}

// 任务执行
export interface TaskExecution {
  id: string;
  taskId: string;
  commenterId: string;
  status: 'grabbed' | 'submitted' | 'approved' | 'rejected';
  screenshots: string[];
  submitTime?: string;
  reviewTime?: string;
  rejectReason?: string;
  earnings: number;
}

// 邀请系统
export interface InviteInfo {
  id: string;
  inviterUserId: string;
  inviteeUserId: string;
  inviteCode: string;
  commissionRate: number;
  totalCommission: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### 2. 组件Props类型
```typescript
// types/components.ts

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface TaskCardProps {
  task: Task;
  onGrab?: (taskId: string) => void;
  onView?: (taskId: string) => void;
  showGrabButton?: boolean;
  className?: string;
}

export interface BottomNavigationProps {
  currentPath: string;
  userRole: UserRole;
}

export interface EarningsHeaderProps {
  balance: number;
  todayIncome: number;
  grabMode: boolean;
  notificationCount: number;
  onToggleGrabMode: () => void;
}
```

## 三、核心组件实现

### 1. 根布局组件
```tsx
// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '抖音评论派单系统',
  description: 'H5移动端优先的评论任务平台',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#4A90E2',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '派单系统',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
```

### 2. 移动端布局组件
```tsx
// src/components/layout/MobileLayout.tsx
'use client';

import { ReactNode } from 'react';
import { EarningsHeader } from '@/components/business/EarningsHeader';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
}

export const MobileLayout = ({ 
  children, 
  showHeader = true, 
  showNavigation = true 
}: MobileLayoutProps) => {
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">加载中...</p>
      </div>
    </div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部收益栏 */}
      {showHeader && user.role === 'commenter' && (
        <EarningsHeader 
          balance={user.balance}
          todayIncome={0} // 从API获取
          grabMode={true} // 从状态获取
          notificationCount={3} // 从API获取
          onToggleGrabMode={() => {}} // 实现逻辑
        />
      )}

      {/* 主内容区 */}
      <main className={`flex-1 overflow-hidden ${showHeader ? 'pt-14' : ''} ${showNavigation ? 'pb-16' : ''}`}>
        {children}
      </main>

      {/* 底部导航 */}
      {showNavigation && (
        <BottomNavigation 
          currentPath={pathname} 
          userRole={user.role} 
        />
      )}
    </div>
  );
};
```

### 3. 任务卡片组件
```tsx
// src/components/business/TaskCard.tsx
'use client';

import { Task } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onGrab?: (taskId: string) => void;
  onView?: (taskId: string) => void;
  className?: string;
}

export const TaskCard = ({ task, onGrab, onView, className }: TaskCardProps) => {
  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleGrab = async () => {
    if (!onGrab) return;
    
    setIsGrabbing(true);
    try {
      await onGrab(task.id);
    } finally {
      setIsGrabbing(false);
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return '⭐'.repeat(difficulty);
  };

  const getProgressPercentage = () => {
    return ((task.total - task.remaining) / task.total) * 100;
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}>
      {/* 任务头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-1">
            {task.title}
          </h3>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-primary font-bold text-lg">
              {formatCurrency(task.price)}
            </span>
            <span className="text-gray-600">
              剩余 {task.remaining}/{task.total}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <Badge variant="secondary" size="sm">
            {task.category}
          </Badge>
          {task.difficulty && (
            <span className="text-xs text-amber-600">
              {getDifficultyStars(task.difficulty)}
            </span>
          )}
        </div>
      </div>

      {/* 任务要求 */}
      <div className="mb-3">
        <div className="text-sm text-gray-600">
          要求：{task.requirements.map(req => {
            switch (req.type) {
              case 'comment': return '评论';
              case 'like': return '点赞';
              case 'follow': return '关注';
              case 'share': return '分享';
              default: return req.type;
            }
          }).join(' + ')}
        </div>
        
        {/* 进度条 */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>完成进度</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-3">
        {task.remaining > 0 ? (
          <Button 
            className="flex-1" 
            onClick={handleGrab}
            loading={isGrabbing}
            disabled={task.status !== 'active'}
          >
            {isGrabbing ? '抢单中...' : '立即抢单'}
          </Button>
        ) : (
          <Button className="flex-1" variant="ghost" disabled>
            已抢完
          </Button>
        )}
        
        <Button 
          variant="secondary" 
          onClick={() => onView?.(task.id)}
          className="px-6"
        >
          详情
        </Button>
      </div>
    </div>
  );
};
```

## 四、状态管理 (Zustand)

### 1. 用户状态管理
```typescript
// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user: User) => set({ 
        user, 
        isAuthenticated: true,
        loading: false 
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),

      updateBalance: (amount: number) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              balance: user.balance + amount 
            } 
          });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
```

### 2. 任务状态管理
```typescript
// src/store/taskStore.ts
import { create } from 'zustand';
import { Task, PaginatedResponse } from '@/types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  filters: {
    category?: string;
    difficulty?: number;
    priceRange?: [number, number];
  };
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  resetTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  hasMore: true,
  currentPage: 1,
  filters: {},

  setTasks: (tasks: Task[]) => set({ tasks, currentPage: 1 }),
  
  addTasks: (newTasks: Task[]) => {
    const { tasks, currentPage } = get();
    set({ 
      tasks: [...tasks, ...newTasks],
      currentPage: currentPage + 1,
      hasMore: newTasks.length > 0
    });
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    set({ tasks: updatedTasks });
  },

  setFilters: (newFilters) => {
    const { filters } = get();
    set({ 
      filters: { ...filters, ...newFilters },
      currentPage: 1
    });
  },

  setLoading: (loading: boolean) => set({ loading }),
  
  resetTasks: () => set({ 
    tasks: [], 
    currentPage: 1, 
    hasMore: true 
  }),
}));
```

## 五、API集成

### 1. API客户端配置
```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 添加认证token
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### 2. API服务层
```typescript
// src/lib/services/taskService.ts
import { apiClient } from '@/lib/api';
import { Task, PaginatedResponse, ApiResponse } from '@/types';

export const taskService = {
  // 获取任务列表
  async getTasks(params: {
    page?: number;
    pageSize?: number;
    category?: string;
    difficulty?: number;
  }): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Task>>>(
      `/tasks?${new URLSearchParams(params as any).toString()}`
    );
    return response.data;
  },

  // 抢单
  async grabTask(taskId: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/tasks/${taskId}/grab`);
  },

  // 提交任务结果
  async submitTaskResult(taskId: string, data: {
    screenshots: File[];
    comment: string;
  }): Promise<void> {
    const formData = new FormData();
    data.screenshots.forEach((file, index) => {
      formData.append(`screenshot_${index}`, file);
    });
    formData.append('comment', data.comment);

    await fetch(`${apiClient.baseURL}/tasks/${taskId}/submit`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
      },
    });
  },
};
```

这套技术方案为H5移动端优先的抖音评论派单系统提供了完整的技术架构，支持高性能、可维护的现代Web应用开发。