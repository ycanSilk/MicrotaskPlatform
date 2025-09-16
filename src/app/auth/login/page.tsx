'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser, getRoleHomePath, SimpleStorage } from '@/lib/simple-auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authenticateUser({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success && result.user) {
        console.log('Login success, user data:', result.user); // 调试信息
        
        // 保存用户信息
        SimpleStorage.saveUser(result.user);
        
        // 等待一短暂时间确保数据保存完成
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 验证保存是否成功
        const savedUser = SimpleStorage.getUser();
        console.log('Login - Saved user verification:', savedUser); // 调试信息
        
        if (!savedUser || savedUser.id !== result.user.id) {
          console.error('Login - Failed to save user data');
          setErrorMessage('用户信息保存失败，请重试');
          return;
        }
        
        // 显示成功消息
        alert(`登录成功！欢迎 ${result.user.nickname || result.user.username}`);
        
        // 根据角色跳转到对应模块
        const homePath = getRoleHomePath(result.user.role);
        console.log('Login - Redirecting to:', homePath); // 调试信息
        
        // 使用 replace 方式跳转，避免在浏览器历史中留下登录页记录
        router.replace(homePath as any);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('登录过程中发生错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 快捷填充演示账号
  const handleQuickFill = (username: string, password: string) => {
    setFormData({ username, password });
    setErrorMessage(''); // 清除之前的错误信息
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部装饰 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-12 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-white text-4xl font-bold mb-3">
            🎯 抖音派单系统
          </div>
          <div className="text-blue-100 text-sm">
            专业的评论任务派发平台
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 -mt-8">
        <div className="max-w-md mx-auto px-4">
          {/* 登录卡片 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎登录</h2>
              <p className="text-sm text-gray-600">请输入您的账号信息</p>
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
                  placeholder="请输入用户名"
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
                {isLoading ? '登录中...' : '立即登录'}
              </button>
            </form>

            {/* 演示账号提示 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800 font-medium mb-3">演示账号（点击快速填充）：</div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', 'admin123')}
                  className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="text-xs text-blue-600">
                    👨‍💼 管理员: admin / admin123
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('padmin', 'p123456')}
                  className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="text-xs text-blue-600">
                    📋 派单员: padmin / p123456
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('commenter01', 'com123456')}
                  className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="text-xs text-blue-600">
                    💬 评论员: commenter01 / com123456
                  </div>
                </button>
              </div>
              <div className="mt-3 text-xs text-blue-700">
                点击上方账号可快速填充，然后点击“立即登录”按钮即可登录
              </div>
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
