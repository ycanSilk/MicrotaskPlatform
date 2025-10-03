'use client';

import React, { useState } from 'react';
// 导入客户端token存储服务
import { saveAuthToken } from '../clientTokenStorage';

// 定义登录表单数据类型
interface LoginFormData {
  username: string;
  password: string;
}

const LoginTestClient: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: 'test',
    password: '123456'
  });
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestInfo, setRequestInfo] = useState<any | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);
    
    const startTime = Date.now();
    const apiUrl = '/api/login-test/login';
    const requestData = {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    };
    
    setRequestInfo({
      url: apiUrl,
      method: 'POST',
      params: formData,
      timestamp: new Date().toLocaleString('zh-CN')
    });

    try {
      // 直接调用内部路由API
      const result = await fetch(apiUrl, requestData);
      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      const apiResponse = await result.json();
      setResponse({
        ...apiResponse,
        statusCode: result.status
      });
      
      if (!apiResponse.success) {
        setError(apiResponse.error || '登录失败');
      } else if (apiResponse.data && apiResponse.data.data && apiResponse.data.data.token) {
        // 登录成功，保存token信息
        const tokenData = {
          token: apiResponse.data.data.token,
          tokenType: apiResponse.data.data.tokenType || 'Bearer',
          expiresIn: apiResponse.data.data.expiresIn || 3600,
          timestamp: Date.now(),
          expiresAt: Date.now() + (apiResponse.data.data.expiresIn || 3600) * 1000
        };
        
        await saveAuthToken(tokenData);
        console.log('Token已成功保存');
      }
    } catch (err) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setError('API请求失败：' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      username: 'admin',
      password: '123456'
    });
    setResponse(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">登录API测试</h2>
        
        <p className="mb-4 text-sm text-gray-500">
          当前正在通过内部路由调用外部API: http://localhost:8888/api/users/login
        </p>
        
        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码（明文显示）
            </label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              重置
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
          {/* 获取用户信息按钮 */}
          <div className="mb-6">
            <button
              onClick={() => window.location.href = '/api-page/logintest'}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              返回
            </button>
          </div>
        </form>

        {/* 错误信息显示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            <strong>错误:</strong> {error}
          </div>
        )}

        {/* 响应结果显示 */}
        {(response || error) && requestInfo && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 bg-blue-50 px-4 py-2 rounded-md">请求信息</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">请求命令:</p>
                  <p className="text-sm text-gray-900">{requestInfo.method} {requestInfo.url}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">请求时间:</p>
                  <p className="text-sm text-gray-900">{requestInfo.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">响应时间:</p>
                  <p className="text-sm text-gray-900">{responseTime} 毫秒</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">响应状态码:</p>
                  <p className="text-sm text-gray-900">{response?.statusCode || 'N/A'}</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3 bg-blue-50 px-4 py-2 rounded-md">请求参数</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">用户名:</p>
                  <p className="text-sm text-gray-900">{requestInfo.params.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">密码:</p>
                  <p className="text-sm text-gray-900">{requestInfo.params.password} (明文)</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <h4 className="font-semibold text-red-700 mb-2">错误信息</h4>
                <p className="text-sm text-red-600">{error}</p>
                {response?.errorCode && (
                  <p className="text-sm text-red-600 mt-1">错误代码: {response.errorCode}</p>
                )}
              </div>
            )}

            {response && (
              <>
                <h3 className="text-lg font-semibold mb-3 bg-blue-50 px-4 py-2 rounded-md">用户信息</h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  {response.success && response.data && response.data.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">用户名:</p>
                        <p className="text-sm text-gray-900">{response.data.data.userInfo?.username || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">邮箱:</p>
                        <p className="text-sm text-gray-900">{response.data.data.userInfo?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">手机号:</p>
                        <p className="text-sm text-gray-900">{response.data.data.userInfo?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Token有效期:</p>
                        <p className="text-sm text-gray-900">{response.data.data.expiresIn ? `${(response.data.data.expiresIn / 3600000).toFixed(1)} 小时` : 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  {(!response.success || !response.data || !response.data.data) && (
                    <p className="text-sm text-gray-500">无用户信息</p>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-3 bg-blue-50 px-4 py-2 rounded-md">完整响应数据</h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96">
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded ${response.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {response.success ? '成功' : '失败'}
                    </span>
                    {response.errorCode && (
                      <span className="ml-2 text-sm text-gray-600">错误代码: {response.errorCode}</span>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginTestClient;