'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useRouter } from 'next/navigation';
import { commonLogin } from '@/auth/common';
import { getRoleHomePath } from '@/auth/common';

// 登录验证展示页面
export default function LoginDemoPage() {
  // 状态管理
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'publisher' | 'commenter'>('admin');
  
  const router = useRouter();

  // 测试账号信息
  const testAccounts = {
    admin: { username: 'admin', password: 'admin123', role: '管理员' },
    publisher: { username: 'publisher01', password: 'pub123456', role: '发布者' },
    commenter: { username: 'commenter01', password: 'com123456', role: '评论者' }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 填充测试账号
  const fillTestAccount = () => {
    const account = testAccounts[selectedRole];
    setFormData({
      username: account.username,
      password: account.password
    });
  };

  // 处理登录提交
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // 验证表单数据
      if (!formData.username || !formData.password) {
        throw new Error('请输入用户名和密码');
      }

      // 调用真实的认证API
      const result = await commonLogin({
        username: formData.username,
        password: formData.password,
        role: selectedRole
      });

      setApiResponse(result);

      if (result.success) {
        setSuccess('登录验证成功！');
        // 根据选择的角色跳转到对应的首页
        setTimeout(() => {
          router.push(getRoleHomePath(selectedRole) as any);
        }, 2000);
      } else {
        setError(result.message || '登录验证失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 尝试直接获取API信息
  const fetchApiInfo = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/testapi');
      const data = await response.json();
      setApiResponse(data);
      
      if (data.success) {
        setSuccess('API信息获取成功！');
      } else {
        setError(data.message || 'API信息获取失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取API信息时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">登录验证演示</h1>
          <p className="text-gray-600">测试API集成和用户登录功能</p>
        </div>

        <Card className="p-6 shadow-lg bg-white border-0 rounded-xl">
          {/* 错误提示 */}
          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200 text-red-700">
              {error}
            </Alert>
          )}

          {/* 成功提示 */}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-700">
              {success}
            </Alert>
          )}

          {/* 角色选择器 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择角色
            </label>
            <div className="flex gap-2">
              {(['admin', 'publisher', 'commenter'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${selectedRole === role 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  {testAccounts[role].role}
                </button>
              ))}
            </div>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? '验证中...' : '登录验证'}
              </Button>
              <Button 
                type="button" 
                onClick={fillTestAccount}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors whitespace-nowrap"
                disabled={isLoading}
              >
                填充测试账号
              </Button>
            </div>
          </form>

          {/* API信息获取按钮 */}
          <div className="mt-6">
            <Button 
              onClick={fetchApiInfo}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '获取中...' : '获取API信息'}
            </Button>
          </div>

          {/* API响应展示 */}
          {apiResponse && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">API响应信息:</span>
                <span className={`inline-block px-2 py-0.5 text-xs rounded ${apiResponse.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {apiResponse.success ? '成功' : '失败'}
                </span>
              </h3>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap max-h-60 overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        {/* 测试账号信息 */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">测试账号信息:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <p className="font-medium text-blue-600">管理员账号:</p>
              <p>用户名: admin | 密码: admin123</p>
            </div>
            <div>
              <p className="font-medium text-purple-600">发布者账号:</p>
              <p>用户名: publisher01 | 密码: pub123456</p>
            </div>
            <div>
              <p className="font-medium text-green-600">评论者账号:</p>
              <p>用户名: commenter01 | 密码: com123456</p>
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">功能说明:</h3>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>此页面演示如何使用真实的认证API进行登录验证</li>
            <li>登录成功后会跳转到对应角色的仪表盘</li>
            <li>可以选择不同角色进行登录测试</li>
            <li>所有API响应会在下方展示</li>
          </ul>
        </div>
      </div>
    </div>
  );
}