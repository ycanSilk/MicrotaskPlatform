'use client';

import React, { useState } from 'react';

// 定义注册表单数据类型
interface RegisterFormData {
  username: string;
  password: string;
  email: string;
  phone: string;
}

const RegisterTestClient: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: 'testuser' + Math.floor(Math.random() * 1000),
    password: '123456',
    email: '',
    phone: ''
  });
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestInfo, setRequestInfo] = useState<any | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [requestBody, setRequestBody] = useState<string | null>(null); // 保存请求体

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
    const apiUrl = '/api/login-test/register';
    // 准备请求数据，过滤空字段
    const filteredFormData: Partial<RegisterFormData> = {};
    if (formData.username.trim()) filteredFormData.username = formData.username;
    if (formData.password.trim()) filteredFormData.password = formData.password;
    if (formData.email.trim()) filteredFormData.email = formData.email;
    if (formData.phone.trim()) filteredFormData.phone = formData.phone;

    const requestData = {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filteredFormData)
    };
    
    // 保存请求信息，包括原始表单数据和实际发送的数据
    setRequestInfo({
      url: apiUrl,
      method: 'POST',
      params: formData,
      sentData: filteredFormData, // 实际发送给API的数据
      timestamp: new Date().toLocaleString('zh-CN')
    });
    
    // 保存请求体
    setRequestBody(requestData.body);

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
        setError(apiResponse.error || '注册失败');
      }
    } catch (err) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setError('API请求失败：' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 生成随机用户名和密码
  const generateRandomCredentials = () => {
    // 生成6位小写字母用户名
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let randomUsername = '';
    for (let i = 0; i < 6; i++) {
      randomUsername += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // 生成6位随机数字密码
    let randomPassword = '';
    for (let i = 0; i < 6; i++) {
      randomPassword += Math.floor(Math.random() * 10);
    }
    
    setFormData(prev => ({
      ...prev,
      username: randomUsername,
      password: randomPassword
    }));
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      username: 'testuser' + Math.floor(Math.random() * 1000),
      password: '123456',
      email: '',
      phone: ''
    });
    setResponse(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">用户注册API测试</h2>
        
        <p className="mb-4 text-sm text-gray-500">
          当前正在通过内部路由调用外部API: http://localhost:8888/api/users/register
        </p>
        
        {/* 注册表单 */}
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
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              手机号
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={generateRandomCredentials}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              生成随机信息
            </button>
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
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </div>
          {/* 返回按钮 */}
          <div className="mb-6">
            <button
              type="button"
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
                <div>
                  <p className="text-sm font-medium text-gray-700">邮箱:</p>
                  <p className="text-sm text-gray-900">{requestInfo.params.email || '(空)'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">手机号:</p>
                  <p className="text-sm text-gray-900">{requestInfo.params.phone || '(空)'}</p>
                </div>
              </div>
            </div>

            {/* 实际发送数据显示 */}
            <h3 className="text-lg font-semibold mb-3 bg-blue-50 px-4 py-2 rounded-md">实际发送数据</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">发送字段:</p>
                  <div className="mt-2">
                    {Object.entries(requestInfo.sentData).length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {Object.entries(requestInfo.sentData).map(([key, value]) => (
                          <li key={key} className="text-sm text-gray-900">
                            <span className="font-medium">{key}:</span> {JSON.stringify(value)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">无数据发送</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 完整请求JSON显示 */}
            <h3 className="text-lg font-semibold mb-3 bg-blue-50 px-4 py-2 rounded-md">完整请求体</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 overflow-auto max-h-60">
              <pre className="whitespace-pre-wrap text-sm">
                {requestBody}
              </pre>
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

export default RegisterTestClient;