'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateCommenter, CommenterAuthStorage, getCommenterHomePath, clearAllAuth } from '@/auth';

export default function CommenterLoginPage() {
  const [formData, setFormData] = useState({
    username: 'test123',
    password: '123456',
    captcha: ''
  });
  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // 生成随机验证码
  function generateCaptcha(length = 4) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 初始化验证码
  useEffect(() => {
    console.log('Initializing captcha');
    const initialCaptcha = generateCaptcha();
    setCaptchaCode(initialCaptcha);
    // 默认填充验证码
    setFormData(prev => ({ ...prev, captcha: initialCaptcha }));
  }, []);

  // 自动填充测试账号
  useEffect(() => {
    // 设置默认测试账号
    setFormData({
      username: 'test123',
      password: '123456',
      captcha: captchaCode
    });
  }, [captchaCode]);

  // 刷新验证码
  const refreshCaptcha = () => {
    console.log('Refreshing captcha');
    const newCaptcha = generateCaptcha();
    setCaptchaCode(newCaptcha);
    // 刷新验证码时保持用户名和密码不变，只更新验证码
    setFormData(prev => ({
      ...prev,
      captcha: newCaptcha
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 重置错误信息
    setErrorMessage('');
    
    // 验证用户名和密码
    if (!formData.username || !formData.password) {
      setErrorMessage('请输入用户名和密码');
      return;
    }
    
    // 验证验证码
    if (!formData.captcha || formData.captcha.toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('请输入正确的验证码');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const result = await authenticateCommenter({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success && result.user && result.token) {
        // 先清除所有其他角色的认证信息，确保只有评论员角色有效
        clearAllAuth();
        
        // 保存认证信息到本地存储
        CommenterAuthStorage.saveAuth({
          token: result.token,
          user: result.user,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
        });
        
        console.log('评论员登录成功，用户角色:', result.user.role);
        console.log('保存的认证信息:', result.token.substring(0, 20) + '...');
        
        // 登录成功后跳转
        // 使用window.location.href确保在任何环境下都能正确跳转
        if (typeof window !== 'undefined') {
          window.location.href = getCommenterHomePath();
        }
      } else {
        setErrorMessage(result.message || '登录失败');
        refreshCaptcha();
      }
    } catch (error) {
      console.error('登录错误:', error);
      setErrorMessage('登录过程中出现错误，请稍后再试');
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部装饰 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-12 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-white text-4xl font-bold mb-3">
            💬 评论员登录
          </div>
          <div className="text-blue-100 text-sm">
            抖音派单系统评论员平台
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 -mt-8">
        <div className="max-w-md mx-auto px-4">
          {/* 登录卡片 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">评论员登录</h2>
              <p className="text-sm text-gray-600">请输入评论员账号信息</p>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 用户名输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  placeholder="请输入评论员用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 验证码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  验证码
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.captcha}
                    onChange={(e) => setFormData({...formData, captcha: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div 
                    className="w-24 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg font-bold text-lg cursor-pointer"
                    onClick={refreshCaptcha}
                  >
                    {captchaCode}
                  </div>
                </div>
              </div>

              {/* 错误信息 */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">⚠️</span>
                    <span className="text-sm text-red-700">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '评论员登录'}
              </button>
            </form>

            {/* 注册提示 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有评论员账户？{' '}
                <button 
                  onClick={() => router.push('/auth/register/commenter')}
                  className="text-blue-500 hover:underline"
                >
                  立即注册
                </button>
              </p>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="text-center text-xs text-gray-500 mb-8">
            <p>© 2024 抖音派单系统 版本 v2.0.0</p>
            <p className="mt-1">安全登录 · 数据加密</p>
          </div>
        </div>
      </div>
    </div>
  );
}