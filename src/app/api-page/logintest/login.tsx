import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import localApiConfig from '../localapipath.json';

// 使用更通用的类型定义
interface ApiResult {
  success: boolean;
  statusCode: number;
  statusText: string;
  responseTime: number;
  data?: any;
  rawResponse?: string;
  headers?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  requestDetails?: { url: string; method: string };
  error?: string;
  errorDetails?: {
    code: string;
    message: string;
    suggestions: string[];
  };
  logs: string[];
}

const LoginTest: React.FC = () => {
  const router = useRouter();
  const [loginApi, setLoginApi] = useState<any | null>(null);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<ApiResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);

  // 加载API配置
  useEffect(() => {
    try {
      // 直接使用导入的API配置，使用类型断言
      const config = localApiConfig;
      const loginEndpoint = config.api.find((api: any) => api.name === '/api/users/login');

      if (loginEndpoint) {
        setLoginApi(loginEndpoint);
      } else {
        console.error('未找到登录API配置');
      }
    } catch (err) {
      console.error('加载API配置失败:', err);
    }
  }, []);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // 验证表单
  const validateForm = (): { isValid: boolean; message: string } => {
    if (!loginForm.username.trim()) {
      return { isValid: false, message: '用户名不能为空' };
    }
    
    if (!loginForm.password) {
      return { isValid: false, message: '密码不能为空' };
    }
    
    return { isValid: true, message: '' };
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 模拟API请求
      const startTime = Date.now();
      
      // 这里应该是实际的API调用，但为了演示，我们使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        success: true,
        data: {
          userId: '12345',
          username: loginForm.username,
          token: 'mock-jwt-token',
          role: 'user'
        },
        message: '登录成功'
      };
      
      const endTime = Date.now();
      
      // 构建API结果
      const apiResult: ApiResult = {
        success: mockResponse.success,
        statusCode: mockResponse.success ? 200 : 401,
        statusText: mockResponse.success ? 'OK' : 'Unauthorized',
        responseTime: endTime - startTime,
        data: mockResponse.data,
        rawResponse: JSON.stringify(mockResponse, null, 2),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockResponse.success ? 'mock-jwt-token' : ''}`
        },
        requestHeaders: {
          'Content-Type': 'application/json'
        },
        requestDetails: {
          url: '/api/users/login',
          method: 'POST'
        },
        error: mockResponse.success ? undefined : '用户名或密码错误',
        logs: [
          `[${new Date().toISOString()}] 开始请求: POST /api/users/login`,
          `[${new Date().toISOString()}] 请求参数: ${JSON.stringify(loginForm)}`,
          `[${new Date().toISOString()}] 响应状态: ${mockResponse.success ? '成功' : '失败'}`,
          `[${new Date().toISOString()}] 响应时间: ${endTime - startTime}ms`
        ]
      };
      
      setResult(apiResult);
      setShowModal(true);
      
      // 如果登录成功且不在测试模式下，导航到主页
      if (mockResponse.success && !testMode) {
        // 模拟存储token
        localStorage.setItem('authToken', 'mock-jwt-token');
        router.push('/');
      }
    } catch (err) {
      const apiResult: ApiResult = {
        success: false,
        statusCode: 500,
        statusText: 'Internal Server Error',
        responseTime: 0,
        error: '登录过程中发生错误',
        errorDetails: {
          code: 'SERVER_ERROR',
          message: err instanceof Error ? err.message : '未知错误',
          suggestions: ['请检查网络连接', '稍后再试', '联系管理员']
        },
        logs: [
          `[${new Date().toISOString()}] 登录请求失败: ${err instanceof Error ? err.message : '未知错误'}`
        ]
      };
      
      setResult(apiResult);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setShowModal(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录测试
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            测试API接口或正常登录
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="用户名"
                  value={loginForm.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="密码"
                  value={loginForm.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                测试模式
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </div>
              ) : (
                '登录'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 结果模态框 */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {result.success ? 'API调用成功' : 'API调用失败'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">状态码</div>
                <div className={`font-mono text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.statusCode} {result.statusText}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">响应时间</div>
                <div className="font-mono text-sm">{result.responseTime}ms</div>
              </div>
              {result.error && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">错误信息</div>
                  <div className="font-mono text-sm text-red-600">{result.error}</div>
                </div>
              )}
              {result.data && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">响应数据</div>
                  <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto font-mono text-sm">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              {result.logs && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">日志</div>
                  <div className="bg-gray-50 p-3 rounded-md font-mono text-sm max-h-40 overflow-y-auto">
                    {result.logs.map((log, index) => (
                      <div key={index} className="mb-1 last:mb-0">{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginTest;