import { generateToken, validateToken, AuthStorage } from '../lib/auth';
import { User } from '@/types';

// 创建测试用户
const testUser1: User = {
  id: 'test001',
  username: 'testuser1',
  role: 'publisher' as any,
  phone: '13800138001',
  balance: 1000,
  status: 'active' as any,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString()
};

const testUser2: User = {
  id: 'test002',
  username: 'testuser2',
  role: 'publisher' as any,
  phone: '13800138002',
  balance: 2000,
  status: 'active' as any,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString()
};

// 测试Token生成和验证
console.log('=== Token生成和验证测试 ===');

const token1 = generateToken(testUser1);
console.log('用户1的Token:', token1);

const token2 = generateToken(testUser2);
console.log('用户2的Token:', token2);

// 验证Token
const validatedUser1 = validateToken(token1);
console.log('验证用户1 Token 结果:', validatedUser1?.username === testUser1.username ? '通过' : '失败');

const validatedUser2 = validateToken(token2);
console.log('验证用户2 Token 结果:', validatedUser2?.username === testUser2.username ? '通过' : '失败');

// 测试AuthStorage
console.log('\n=== AuthStorage测试 ===');

// 模拟浏览器环境
global.window = {
  localStorage: {
    store: {} as any,
    getItem: function(key: string) {
      return this.store[key] || null;
    },
    setItem: function(key: string, value: string) {
      this.store[key] = value;
    },
    removeItem: function(key: string) {
      delete this.store[key];
    }
  } as any
} as any;

// 保存用户1的认证信息
const session1 = {
  user: testUser1,
  token: token1,
  expiresAt: Date.now() + (24 * 60 * 60 * 1000)
};

AuthStorage.saveAuth(session1);
console.log('保存用户1认证信息完成');

// 获取用户1的认证信息
const retrievedSession1 = AuthStorage.getAuth();
console.log('获取用户1认证信息结果:', retrievedSession1?.user.username === testUser1.username ? '通过' : '失败');

// 保存用户2的认证信息（覆盖用户1）
const session2 = {
  user: testUser2,
  token: token2,
  expiresAt: Date.now() + (24 * 60 * 60 * 1000)
};

AuthStorage.saveAuth(session2);
console.log('保存用户2认证信息完成');

// 获取用户2的认证信息
const retrievedSession2 = AuthStorage.getAuth();
console.log('获取用户2认证信息结果:', retrievedSession2?.user.username === testUser2.username ? '通过' : '失败');

// 验证用户信息确实是独立的
console.log('验证用户信息独立性:', 
  retrievedSession2?.user.username === testUser2.username && 
  retrievedSession2?.user.id === testUser2.id ? '通过' : '失败');

console.log('\n=== 测试完成 ===');