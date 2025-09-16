'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SimpleStorage } from '@/lib/simple-auth';

export default function PublisherLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: ''
  });
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
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

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setFormData({ ...formData, captcha: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // 验证表单
    if (!formData.username.trim()) {
      setErrorMessage('请输入用户名');
      return;
    }
    
    if (!formData.password.trim()) {
      setErrorMessage('请输入密码');
      return;
    }
    
    if (!formData.captcha.trim()) {
      setErrorMessage('请输入验证码');
      return;
    }
    
    if (formData.captcha.toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('验证码错误');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    
    try {
      // 调用发布者登录API
      const response = await fetch('/api/publisher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const result = await response.json();
      
      if (result.success && result.user) {
        // 构造简化的用户信息
        const simpleUser = {
          id: result.user.id,
          username: result.user.username,
          role: result.user.role,
          balance: result.user.balance || 0, // 发布者用户数据中包含余额字段
        };
        
        // 保存用户信息
        SimpleStorage.saveUser(simpleUser);
        
        // 显示成功消息
        alert(`发布者登录成功！欢迎 ${result.user.username}`);
        
        // 跳转到发布者首页
        router.replace('/publisher/dashboard');
      } else {
        setErrorMessage(result.message || '登录失败');
        refreshCaptcha();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('登录过程中发生错误，请重试');
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
            📋 发布者登录
          </div>
          <div className="text-blue-100 text-sm">
            抖音派单系统发布者平台
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 -mt-8">
        <div className="max-w-md mx-auto px-4">
          {/* 登录卡片 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">发布者登录</h2>
              <p className="text-sm text-gray-600">请输入发布者账号信息</p>
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
                  placeholder="请输入发布者用户名"
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
                {isLoading ? '登录中...' : '发布者登录'}
              </button>
            </form>

            {/* 注册提示 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有发布者账户？{' '}
                <a href="/auth/register/publisher" className="text-blue-500 hover:underline">
                  立即注册
                </a>
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