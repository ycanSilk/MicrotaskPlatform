'use client';

import React, { useState, useEffect } from 'react';
import localApiConfig from '../localapipath.json';

// 定义API接口配置类型
interface ApiEndpoint {
  name: string;
  description: string;
  apipath: string;
  method: string;
  requiredFields: string[];
  requestBody: Record<string, any>;
  responseExample: Record<string, any>;
}

// 定义API响应结果类型
interface ApiResult {
  success: boolean;
  statusCode: number;
  data?: any;
  error?: string;
  message?: string;
}

// 定义注册表单类型
interface RegisterForm {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: 'commenter' | 'publisher';
}

const ApiTestPage: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'commenter'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 获取需要的三个API配置
  const apiEndpoints = localApiConfig.api.filter(api => 
    ['/api/users/register', '/api/users/login', '/api/users/me'].includes(api.name)
  );

  // 处理API点击
  const handleApiClick = async (api: ApiEndpoint) => {
    setSelectedApi(api);
    setIsModalOpen(true);
    setApiResult(null);
    setFormErrors({});
    
    // 如果是注册API，清空表单
    if (api.name === '/api/users/register') {
      setRegisterForm({
        username: '',
        password: '',
        email: '',
        phone: '',
        role: 'commenter'
      });
    } else {
      // 对于其他API，执行模拟调用
      await callApi(api);
    }
  };

  // 模拟API调用
  const callApi = async (api: ApiEndpoint) => {
    setIsLoading(true);
    setApiResult(null);

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模拟成功响应
      setApiResult({
        success: true,
        statusCode: 200,
        data: api.responseExample,
        message: 'API调用成功'
      });
    } catch (error) {
      // 模拟错误响应
      setApiResult({
        success: false,
        statusCode: 500,
        error: 'API调用失败',
        message: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理注册表单提交
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const errors: Record<string, string> = {};
    
    if (!registerForm.username.trim()) {
      errors.username = '用户名不能为空';
    } else if (registerForm.username.length < 6 || registerForm.username.length > 20) {
      errors.username = '用户名长度必须在6-20位之间';
    }
    
    if (!registerForm.password) {
      errors.password = '密码不能为空';
    } else if (registerForm.password.length < 6) {
      errors.password = '密码长度不能少于6位';
    }
    
    if (registerForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = '请输入正确的邮箱地址';
    }
    
    if (registerForm.phone && !/^1[3-9]\d{9}$/.test(registerForm.phone)) {
      errors.phone = '请输入正确的手机号码';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      // 调用真实的注册API
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerForm)
      });
      
      const data = await response.json();
      
      setApiResult({
        success: data.success,
        statusCode: response.status,
        data: data.data,
        message: data.message,
        error: data.error
      });
    } catch (error) {
      setApiResult({
        success: false,
        statusCode: 500,
        error: '注册过程中发生错误',
        message: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误信息
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 获取方法颜色
  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'GET': 'bg-blue-500',
      'POST': 'bg-green-500',
      'PUT': 'bg-orange-500',
      'DELETE': 'bg-red-500'
    };
    return colors[method] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API测试平台</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">API测试列表</h2>
          </div>
          
          <div className="px-4 py-6 space-y-4">
            {apiEndpoints.map((api, index) => (
              <button
                key={api.name}
                onClick={() => handleApiClick(api)}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
              >
                <div className="flex flex-col">
                  <div className="font-medium text-gray-900">
                    {index === 0 ? '用户注册API测试' : index === 1 ? '用户登录' : '获取当前用户信息'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {api.description}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`${getMethodColor(api.method)} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {api.method}
                  </span>
                  <span className="text-sm text-gray-400">{api.name}</span>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 模态框 */}
      {isModalOpen && selectedApi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedApi.name === '/api/users/register' ? '用户注册' : 'API调用结果: ' + selectedApi.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 flex-1 overflow-auto">
              {selectedApi.name === '/api/users/register' ? (
                // 注册表单
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      用户名 *
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={registerForm.username}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${formErrors.username ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="请输入用户名（6-20位）"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      密码 *
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={registerForm.password}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="请输入密码（至少6位）"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      邮箱（选填）
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={registerForm.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="请输入邮箱地址"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      手机号（选填）
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={registerForm.phone}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${formErrors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="请输入手机号码"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      用户角色 *
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={registerForm.role}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="commenter">评论员</option>
                      <option value="publisher">派单员</option>
                    </select>
                  </div>
                </form>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">正在调用API...</span>
                </div>
              ) : apiResult ? (
                <div className="space-y-4">
                  <div className={`p-3 rounded-md ${apiResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {apiResult.success ? (
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{apiResult.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">状态码</h4>
                      <p className="mt-1 text-sm text-gray-900">{apiResult.statusCode}</p>
                    </div>
                    
                    {apiResult.success && apiResult.data && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">响应数据</h4>
                        <pre className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-900 overflow-auto">
                          {JSON.stringify(apiResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {!apiResult.success && apiResult.error && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">错误信息</h4>
                        <p className="mt-1 text-sm text-gray-900">{apiResult.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  请点击API按钮进行测试
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              {selectedApi.name === '/api/users/register' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    onClick={handleRegisterSubmit}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        注册中...
                      </div>
                    ) : (
                      '注册'
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  关闭
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestPage;