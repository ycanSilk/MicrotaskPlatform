'use client';

import React, { useState } from 'react';

// 定义注册表单类型
export interface RegisterForm {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: 'commenter' | 'publisher';
}

// 定义详细的API响应结果类型
export interface ApiResult {
  success: boolean;
  statusCode: number;
  statusText?: string;
  responseTime?: number;
  data?: any;
  error?: string;
  message?: string;
  rawResponse?: string;
  headers?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  requestDetails?: { url: string; method: string };
  requestBody?: any;
  logs?: string[];
  errorDetails?: {
    code: string;
    message: string;
    suggestions: string[];
  };
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: (result: ApiResult) => void;
  onRegisterError?: (result: ApiResult) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose,
  onRegisterSuccess,
  onRegisterError 
}) => {
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'commenter'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  // 验证表单
  const validateForm = (): boolean => {
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
      return false;
    }
    
    return true;
  };

  // 处理注册表单提交
  const handleRegisterSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormErrors({});
    
    // 准备请求头
    const requestHeaders = {
      'Content-Type': 'application/json'
    };
    
    // 准备日志
    const logs: string[] = [];
    logs.push(`[${new Date().toISOString()}] 开始请求: POST /api/users/register`);
    logs.push(`[${new Date().toISOString()}] 请求参数: ${JSON.stringify(registerForm)}`);

    try {
      const startTime = Date.now();
      
      // 调用真实的注册API
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(registerForm)
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // 收集响应头信息
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      // 尝试解析响应体
      let data: any;
      let rawResponse = '';
      try {
        rawResponse = await response.text();
        data = rawResponse ? JSON.parse(rawResponse) : {};
      } catch (parseError) {
        data = {};
        logs.push(`[${new Date().toISOString()}] 响应解析错误: ${parseError instanceof Error ? parseError.message : '未知错误'}`);
      }
      
      // 更新日志
      logs.push(`[${new Date().toISOString()}] 响应状态: ${response.status} ${response.statusText}`);
      logs.push(`[${new Date().toISOString()}] 响应时间: ${responseTime}ms`);
      
      // 构建详细的API结果
      const result: ApiResult = {
        success: response.ok && (data.success !== false),
        statusCode: response.status,
        statusText: response.statusText,
        responseTime,
        data: data.data || data,
        message: data.message || (response.ok ? '注册成功' : '注册失败'),
        error: data.error || (response.ok ? undefined : '请求失败'),
        rawResponse,
        headers,
        requestHeaders,
        requestDetails: {
          url: '/api/users/register',
          method: 'POST'
        },
        requestBody: registerForm,
        logs,
        errorDetails: data.errorDetails
      };
      
      // 触发回调
      if (result.success && onRegisterSuccess) {
        onRegisterSuccess(result);
      } else if (!result.success && onRegisterError) {
        onRegisterError(result);
      }
    } catch (error) {
      const endTime = Date.now();
      logs.push(`[${new Date().toISOString()}] 请求失败: ${error instanceof Error ? error.message : '未知错误'}`);
      
      const result: ApiResult = {
        success: false,
        statusCode: 500,
        statusText: 'Internal Server Error',
        responseTime: endTime - (logs[0]?.match(/\[(.*?)\]/)?.[1] ? new Date(logs[0].match(/\[(.*?)\]/)?.[1] || '').getTime() : Date.now()),
        error: '注册过程中发生错误',
        message: error instanceof Error ? error.message : '未知错误',
        requestHeaders,
        requestDetails: {
          url: '/api/users/register',
          method: 'POST'
        },
        requestBody: registerForm,
        logs,
        errorDetails: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : '未知错误',
          suggestions: ['请检查网络连接', '稍后再试', '联系管理员']
        }
      };
      
      // 触发错误回调
      if (onRegisterError) {
        onRegisterError(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">用户注册</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 flex-1 overflow-auto">
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
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
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
        </div>
      </div>
    </div>
  );
};

// 注册结果展示组件
interface RegisterResultDisplayProps {
  result: ApiResult;
  onClose: () => void;
}

const RegisterResultDisplay: React.FC<RegisterResultDisplayProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">API调用结果: /api/users/register</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 flex-1 overflow-auto">
          <div className="space-y-4">
            {/* 状态提示 */}
            <div className={`p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {result.success ? (
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
                  <p className="text-sm font-medium">{result.message}</p>
                </div>
              </div>
            </div>
            
            {/* 请求信息 */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">请求信息</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">URL:</span>
                  <span className="font-mono">{result.requestDetails?.url || '-'}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">方法:</span>
                  <span className="font-mono font-bold text-green-600">{result.requestDetails?.method || '-'}</span>
                </div>
                {result.responseTime !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">响应时间:</span>
                    <span className="font-mono">{result.responseTime}ms</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 请求体 */}
            {result.requestBody && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">请求数据</h4>
                <pre className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-auto">
                  {JSON.stringify(result.requestBody, null, 2)}
                </pre>
              </div>
            )}
            
            {/* 状态码 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">状态码:</span>
              <span className={`font-mono font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.statusCode} {result.statusText}
              </span>
            </div>
            
            {/* 响应数据 */}
            {result.data && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">响应数据</h4>
                <pre className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
            
            {/* 错误信息 */}
            {!result.success && result.error && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">错误信息</h4>
                <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
                  {result.error}
                </div>
                {result.errorDetails && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-md text-xs font-mono">
                    <div className="mb-1"><strong>错误代码:</strong> {result.errorDetails.code}</div>
                    <div className="mb-1"><strong>详细信息:</strong> {result.errorDetails.message}</div>
                    {result.errorDetails.suggestions && result.errorDetails.suggestions.length > 0 && (
                      <div><strong>建议:</strong> {result.errorDetails.suggestions.join(', ')}</div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* 日志 */}
            {result.logs && result.logs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">日志输出</h4>
                <div className="bg-gray-900 text-gray-300 p-3 rounded-md text-xs font-mono max-h-40 overflow-y-auto">
                  {result.logs.map((log, index) => (
                    <div key={index} className="mb-1 last:mb-0">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export { RegisterModal, RegisterResultDisplay };