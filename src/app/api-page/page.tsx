'use client';


import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import apipathd from './apipathd.json';

// 动态导入RegisterModal组件，并确保它只在客户端渲染
const RegisterModal = dynamic(
  () => import('./RegisterModal'),
  { ssr: false, loading: () => null }
);

// 动态导入LoginModal组件，并确保它只在客户端渲染
const LoginModal = dynamic(
  () => import('./LoginModal'),
  { ssr: false, loading: () => null }
);

// API接口类型定义
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requiresAuth?: boolean;
}

// API结果类型定义
export interface ApiResult {
  success: boolean;
  statusCode: number;
  statusText: string;
  responseTime: number;
  data?: any;
  rawResponse?: string;
  headers?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  error?: string;
  errorDetails?: {
    code: string;
    message: string;
    suggestions: string[];
  };
  logs?: string[];
  requestDetails?: {
    url: string;
    method: string;
  };
}

// 注册表单数据类型
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// 登录表单数据类型
export interface LoginFormData {
  username: string;
  password: string;
}

const ApiPage: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint | null>(null);
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'system'>('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [showFullLogs, setShowFullLogs] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // API列表状态 - 从真实API获取
  const [userApis, setUserApis] = useState<ApiEndpoint[]>([]);
  const [systemApis, setSystemApis] = useState<ApiEndpoint[]>([]);
  const [isLoadingApis, setIsLoadingApis] = useState(true);
  const [apiListError, setApiListError] = useState<string | null>(null);
  
  // 注册相关状态
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

  // 登录相关状态
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loginLogs, setLoginLogs] = useState<string[]>([]);
  
  // 确保在客户端挂载后再显示动态内容
  useEffect(() => {
    setMounted(true);
    
    // 加载API列表
    loadApiList();
  }, []);

  // 从真实API获取接口列表
  const loadApiList = async () => {
    setIsLoadingApis(true);
    setApiListError(null);
    
    try {
      // 从apipathd.json中提取API列表
      // 这模拟了从真实API获取接口列表的过程
      const userApiList: ApiEndpoint[] = [];
      const systemApiList: ApiEndpoint[] = [];
      
      // 遍历apipathd中的所有API，并根据路径分类
      apipathd.apis.forEach(api => {
        // 构建完整的API信息
        const apiInfo: ApiEndpoint = {
          method: 'GET', // 默认为GET，可以根据实际情况设置
          path: `/api/${api.name}`,
          description: api.description || `API: ${api.name}`,
          requiresAuth: api.requiresAuth || false
        };
        
        // 根据API类型进行分类
        if (api.category === 'user' || api.name.includes('user')) {
          userApiList.push(apiInfo);
        } else {
          systemApiList.push(apiInfo);
        }
      });
      
      // 添加一些额外的常用API
      if (!userApiList.some(api => api.path === '/api/users/register')) {
        userApiList.push({
          method: 'POST',
          path: '/api/users/register',
          description: '用户注册',
          requiresAuth: false
        });
      }
      
      if (!userApiList.some(api => api.path === '/api/users/me')) {
        userApiList.push({
          method: 'GET',
          path: '/api/users/me',
          description: '获取当前用户信息',
          requiresAuth: true
        });
      }
      
      if (!systemApiList.some(api => api.path === '/api/testapi')) {
        systemApiList.push({
          method: 'GET',
          path: '/api/testapi',
          description: '测试API连接'
        });
      }
      
      // 设置API列表
      setUserApis(userApiList);
      setSystemApis(systemApiList);
      
      console.log('API列表加载成功:', { userApiList, systemApiList });
    } catch (error) {
      console.error('API列表加载失败:', error);
      setApiListError('无法加载API接口列表，请稍后重试');
      
      // 如果加载失败，使用备用的API列表
      setUserApis([
        { method: 'GET', path: '/api/users', description: '获取用户列表' },
        { method: 'GET', path: '/api/users/{id}', description: '获取用户详情' },
        { method: 'POST', path: '/api/users/register', description: '用户注册' },
        { method: 'GET', path: '/api/users/me', description: '获取当前用户信息' }
      ]);
      setSystemApis([
        { method: 'GET', path: '/api/testapi', description: '测试API连接' }
      ]);
    } finally {
      setIsLoadingApis(false);
    }
  };

  // 刷新API列表
  const refreshApiList = () => {
    loadApiList();
  };


  // 处理注册表单输入变化
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理登录表单输入变化
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 验证注册表单
  const validateRegisterForm = (): { isValid: boolean; message: string } => {
    // 用户名验证
    if (!registerForm.username.trim()) {
      return { isValid: false, message: '用户名不能为空' };
    }
    
    if (registerForm.username.length < 3 || registerForm.username.length > 20) {
      return { isValid: false, message: '用户名长度必须在3-20个字符之间' };
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(registerForm.username)) {
      return { isValid: false, message: '用户名只能包含字母、数字和下划线' };
    }

    // 密码验证
    if (!registerForm.password) {
      return { isValid: false, message: '密码不能为空' };
    }
    
    if (registerForm.password.length < 6 || registerForm.password.length > 20) {
      return { isValid: false, message: '密码长度必须在6-20个字符之间' };
    }

    // 确认密码验证（如果填写了）
    if (registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword) {
      return { isValid: false, message: '两次输入的密码不一致' };
    }

    // 邮箱验证（如果填写了）
    if (registerForm.email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(registerForm.email)) {
        return { isValid: false, message: '请输入有效的邮箱地址' };
      }
    }

    // 手机号验证（如果填写了）
    if (registerForm.phone && registerForm.phone.trim()) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(registerForm.phone.trim())) {
        return { isValid: false, message: '请输入有效的手机号码' };
      }
    }

    return { isValid: true, message: '' };
  };

  // 提交注册表单
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 重置状态
    setRegisterError('');
    setRegisterSuccess(false);
    
    // 验证表单
    const validation = validateRegisterForm();
    if (!validation.isValid) {
      setRegisterError(validation.message);
      return;
    }
    
    setIsRegistering(true);
    
    try {
      // 创建注册请求数据
      const registerData = {
        username: registerForm.username,
        password: registerForm.password,
        // 可选字段
        ...(registerForm.email ? { email: registerForm.email } : {}),
        ...(registerForm.phone ? { phone: registerForm.phone } : {})
      };
      
      // 调用实际可用的注册API接口
      // 使用相对路径请求，让Next.js的代理功能处理跨域问题
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': 'Bearer 1'
        },
        body: JSON.stringify(registerData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `注册失败，状态码: ${response.status}`);
      }
      
      // 如果API调用成功
      const result = await response.json();
      setRegisterSuccess(true);
      
      // 在控制台打印注册结果
      console.log('注册成功:', result);
      
      // 显示成功消息并在2秒后关闭模态框
      setTimeout(() => {
        closeRegisterModal();
      }, 2000);
      
    } catch (error) {
      // 处理错误情况
      console.error('注册失败:', error);
      
      // 显示实际错误信息
      setRegisterError(error instanceof Error ? error.message : '注册失败，请稍后重试');
    } finally {
      setIsRegistering(false);
    }
  };

  // 验证登录表单
  const validateLoginForm = (): { isValid: boolean; message: string } => {
    // 用户名验证
    if (!loginForm.username.trim()) {
      return { isValid: false, message: '用户名不能为空' };
    }
    
    // 密码验证
    if (!loginForm.password) {
      return { isValid: false, message: '密码不能为空' };
    }
    
    if (loginForm.password.length < 6 || loginForm.password.length > 20) {
      return { isValid: false, message: '密码长度必须在6-20个字符之间' };
    }
    
    return { isValid: true, message: '' };
  };

  // 提交登录表单
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 重置状态
    setLoginError('');
    setLoginSuccess(false);
    
    // 验证表单
    const validation = validateLoginForm();
    if (!validation.isValid) {
      setLoginError(validation.message);
      return;
    }
    
    setIsLoggingIn(true);
    
    // 调试日志数组
    const loginLogs: string[] = [];
    const startTime = Date.now();
    
    // 记录环境信息
    const environmentInfo = `[${new Date().toISOString()}] 环境信息: 浏览器=${navigator.userAgent}, 时区=${Intl.DateTimeFormat().resolvedOptions().timeZone}, 语言=${navigator.language}`;
    loginLogs.push(environmentInfo);
    
    // 创建登录请求数据
    const loginData = {
      username: loginForm.username,
      password: loginForm.password
    };
    
    // 记录开始日志
    const startLog = `[${new Date().toISOString()}] 开始登录请求`;
    loginLogs.push(startLog);
    console.log(startLog);
    
    // 记录请求信息
    const requestInfoLog = `[${new Date().toISOString()}] 请求信息:
  URL: /api/users/login
  用户名: ${loginForm.username}
  密码: [已隐藏]
  请求方法: POST
  请求体长度: ${JSON.stringify(loginData).length} 字符`;
    loginLogs.push(requestInfoLog);
    console.log(requestInfoLog);
    
    // 打印完整的请求对象到控制台，方便调试
    console.log('请求详情:', {
      url: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': 'Bearer 1'
      },
      body: {
        username: loginForm.username,
        password: '[已隐藏]'
      }
    });
    
    // 首先尝试使用相对路径请求，让Next.js的代理功能处理跨域问题
    let response;
    
    try {
      response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': 'Bearer 1'
        },
        body: JSON.stringify(loginData),
        redirect: 'follow', // 自动跟随重定向
        signal: AbortSignal.timeout(5000) // 设置5秒超时
      });
      
      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - startTime;
      
      // 记录响应状态
      const statusDescription = getStatusCodeDescription(response.status);
      const responseLog = `[${new Date().toISOString()}] 收到响应:
  状态码: ${response.status}
  状态文本: ${response.statusText}
  状态描述: ${statusDescription}
  耗时: ${requestDuration}ms
  响应类型: ${response.type}
  重定向次数: ${response.redirected ? '是' : '否'}`;
      loginLogs.push(responseLog);
      console.log(responseLog);
      
      // 记录响应头
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      const headersLog = `[${new Date().toISOString()}] 响应头:
${Object.entries(responseHeaders).map(([key, value]) => `  ${key}: ${value}`).join('\n')}`;
      loginLogs.push(headersLog);
      console.log(headersLog);
      
      if (!response.ok) {
        // 记录错误响应内容
        const errorData = await response.json().catch(() => null);
        const errorContentLog = `[${new Date().toISOString()}] 错误响应内容: ${errorData ? JSON.stringify(errorData) : '无法解析响应内容'}`;
        loginLogs.push(errorContentLog);
        console.log(errorContentLog);
        
        throw new Error(errorData?.message || `登录失败，状态码: ${response.status}`);
      }
      
      // 如果API调用成功
      const result = await response.json();
      
      // 记录成功响应内容
      const successContentLog = `[${new Date().toISOString()}] 成功响应内容:
  响应数据长度: ${JSON.stringify(result).length} 字符
  是否包含token: ${result.data?.token ? '是' : '否'}
  是否包含用户信息: ${result.data?.userInfo ? '是' : '否'}`;
      loginLogs.push(successContentLog);
      console.log(successContentLog);
      
      // 在控制台打印格式化的成功数据
      console.log('登录成功数据:', {
        tokenInfo: result.data?.token ? {
          tokenType: result.data.tokenType,
          expiresIn: result.data.expiresIn,
          tokenLength: result.data.token.length
        } : null,
        userInfo: result.data?.userInfo || null
      });
      
      setLoginSuccess(true);
      
      // 存储返回的token和用户信息到localStorage
      if (result.data?.token) {
        localStorage.setItem('userToken', result.data.token);
        localStorage.setItem('tokenType', result.data.tokenType || 'Bearer');
        localStorage.setItem('expiresIn', String(result.data.expiresIn || 86400000));
        localStorage.setItem('loginTime', String(Date.now()));
        
        // 存储用户信息
        if (result.data.userInfo) {
          localStorage.setItem('userInfo', JSON.stringify(result.data.userInfo));
        }
        
        // 记录存储信息
        const storageLog = `[${new Date().toISOString()}] 已存储Token到localStorage，token长度=${result.data.token.length} 字符`;
        loginLogs.push(storageLog);
        console.log(storageLog);
        console.log('用户信息已存储:', result.data.userInfo);
      }
      
      // 在控制台打印完整登录日志
      console.groupCollapsed('登录请求完整日志');
      loginLogs.forEach(log => console.log(log));
      console.groupEnd();
      
      // 显示成功消息并在2秒后关闭模态框
      setTimeout(() => {
        closeLoginModal();
        // 可以在这里添加登录成功后的页面跳转逻辑
        // window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error) {
      // 网络错误或超时，直接抛出错误
      const errorLog = `[${new Date().toISOString()}] 登录请求失败: 
  错误类型: ${error instanceof Error ? error.name : '未知'}
  错误消息: ${error instanceof Error ? error.message : '无法连接到服务器'}`;
      loginLogs.push(errorLog);
      console.error(errorLog);
      
      // 记录错误详情
      const errorTime = Date.now();
      const errorDuration = errorTime - startTime;
      
      // 分析错误类型
      let errorType = '未知错误';
      let errorDetails = '';
      
      if (error instanceof Error) {
        errorType = error.name;
        errorDetails = error.message;
        
        // 网络相关错误判断
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorType = '网络错误';
          errorDetails += '\n建议检查网络连接或API服务器是否可用';
        } else if (error.message.includes('404')) {
          errorType = '资源不存在';
          errorDetails += '\nAPI接口可能已更改或服务器路径错误';
        } else if (error.message.includes('401')) {
          errorType = '未授权';
          errorDetails += '\n请确认用户名和密码是否正确';
        } else if (error.message.includes('500')) {
          errorType = '服务器内部错误';
          errorDetails += '\n服务器可能暂时不可用，请稍后重试';
        }
      }
      
      // 在控制台打印增强的错误详情
      console.group('登录请求详细调试信息');
      console.error('❌ 登录失败总结:', {
        type: errorType,
        message: errorDetails,
        duration: errorDuration,
        timestamp: new Date().toLocaleString()
      });
      console.info('📋 完整日志列表:');
      loginLogs.forEach((log, index) => {
        console.log(`[${index + 1}]`, log);
      });
      console.error('🔍 原始错误对象:', error);
      console.groupEnd();
      
      // 显示实际错误信息
      setLoginError(error instanceof Error ? error.message : '登录失败，请稍后重试');
      
      // 传递日志给LoginModal组件
      setLoginLogs(loginLogs);
      
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 关闭注册模态框
  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
    setRegisterForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      
    });
    setRegisterError('');
    setRegisterSuccess(false);
  };

  // 关闭登录模态框
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginForm({
      username: '',
      password: ''
    });
    setLoginError('');
    setLoginSuccess(false);
  };

  // 获取HTTP方法对应的样式颜色
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-orange-500';
      case 'DELETE': return 'bg-red-500';
      case 'PATCH': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // 根据HTTP状态码获取状态描述
  const getStatusCodeDescription = (statusCode: number): string => {
    const statusMap: Record<number, string> = {
      200: 'OK - 请求成功',
      201: 'Created - 资源创建成功',
      204: 'No Content - 请求成功但无响应体',
      301: 'Moved Permanently - 资源永久移动',
      302: 'Found - 资源临时移动',
      400: 'Bad Request - 请求参数错误',
      401: 'Unauthorized - 未授权访问',
      403: 'Forbidden - 服务器拒绝访问',
      404: 'Not Found - 请求的资源不存在',
      405: 'Method Not Allowed - 请求方法不支持',
      500: 'Internal Server Error - 服务器内部错误',
      502: 'Bad Gateway - 网关错误',
      503: 'Service Unavailable - 服务不可用',
      504: 'Gateway Timeout - 网关超时',
    };
    return statusMap[statusCode] || `未知状态码 - ${statusCode}`;
  };

  // 测试API连接
  const testApi = async (api: ApiEndpoint) => {
    setSelectedApi(api);
    setIsTesting(true);
    setApiResult(null);
    setShowFullLogs(false);

    const startTime = Date.now();
    const logs: string[] = [];
    
    // 记录测试开始日志
    const testStartTime = new Date();
    const startLog = `[${testStartTime.toISOString()}] 开始测试API: ${api.method} ${api.path}`;
    logs.push(startLog);
    console.log(startLog);

    try {
      // 构建真实的API请求URL
      let apiUrl = getApiUrlFromPath(api.path);
      
      // 记录URL构建日志
      const urlLog = `[${new Date().toISOString()}] 构建API请求URL: ${apiUrl}`;
      logs.push(urlLog);
      console.log(urlLog);

      // 设置请求头
      const headers: HeadersInit = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Referer': 'http://localhost:3000/',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1'
      };
      
      // 复制请求头用于记录
      const requestHeadersCopy: Record<string, string> = {};
      Object.entries(headers).forEach(([key, value]) => {
        requestHeadersCopy[key] = Array.isArray(value) ? value.join(', ') : value.toString();
      });
      
      // 记录请求头日志
      const headersLog = `[${new Date().toISOString()}] 设置请求头: ${JSON.stringify(requestHeadersCopy)}`;
      logs.push(headersLog);
      console.log(headersLog);

      // 执行真实的API请求
      const requestStart = Date.now();
      logs.push(`[${new Date().toISOString()}] 发起请求: ${api.method} ${apiUrl}`);
      console.log(`发起请求: ${api.method} ${apiUrl}`);
      
      // 使用AbortController实现超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000); // 10秒超时
      
      let response;
      try {
        response = await fetch(apiUrl, {
          method: 'GET', // 为了简化，这里统一使用GET请求
          headers,
          credentials: 'include', // 包含cookie信息
          signal: controller.signal, // 使用AbortController的signal
        });
        clearTimeout(timeoutId); // 请求成功，清除超时定时器
      } catch (fetchError) {
        clearTimeout(timeoutId); // 请求失败，清除超时定时器
        // 网络请求错误处理
        const fetchErrorLog = `[${new Date().toISOString()}] 请求失败: ${fetchError instanceof Error ? fetchError.message : '未知错误'}`;
        logs.push(fetchErrorLog);
        console.error(fetchErrorLog);
        throw fetchError;
      }
      
      const requestEnd = Date.now();
      const requestDuration = requestEnd - requestStart;
      
      // 记录响应状态日志
      const responseLog = `[${new Date().toISOString()}] 收到响应: 状态码 ${response.status} ${response.statusText}, 耗时 ${requestDuration}ms`;
      logs.push(responseLog);
      console.log(responseLog);

      // 保存响应头
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // 记录响应头日志
      const responseHeadersLog = `[${new Date().toISOString()}] 响应头: ${JSON.stringify(responseHeaders)}`;
      logs.push(responseHeadersLog);
      console.log(responseHeadersLog);

      // 保存原始响应文本
      const rawResponse = await response.text();
      logs.push(`[${new Date().toISOString()}] 响应内容长度: ${rawResponse.length} 字节`);
      console.log(`响应内容长度: ${rawResponse.length} 字节`);
      
      let parsedData = null;
      
      // 尝试解析JSON响应
      try {
        parsedData = JSON.parse(rawResponse);
        logs.push(`[${new Date().toISOString()}] 成功解析JSON响应`);
        console.log('成功解析JSON响应');
      } catch (jsonError) {
        // 如果不是JSON格式，仍然保存原始文本
        const jsonErrorLog = `[${new Date().toISOString()}] JSON解析失败: ${jsonError instanceof Error ? jsonError.message : '无法解析JSON'}`;
        logs.push(jsonErrorLog);
        console.warn(jsonErrorLog);
        
        parsedData = {
          rawText: rawResponse,
          parsingError: jsonError instanceof Error ? jsonError.message : '无法解析JSON'
        };
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // 构建响应结果
      const result: ApiResult = {
        success: response.ok,
        statusCode: response.status,
        statusText: response.statusText,
        responseTime,
        data: parsedData,
        rawResponse,
        headers: responseHeaders,
        requestHeaders: requestHeadersCopy,
        requestDetails: { url: apiUrl, method: api.method },
        logs // 添加日志信息
      };

      // 为403错误添加详细信息
      if (response.status === 403) {
        result.errorDetails = {
          code: 'FORBIDDEN',
          message: '服务器拒绝了您的请求。这通常是由于权限不足或认证失败导致的。',
          suggestions: [
            '确认您是否已经登录并拥有足够的权限',
            '检查API密钥或认证令牌是否有效',
            '查看请求头中的认证信息是否正确',
            '联系API管理员确认您的访问权限'
          ]
        };
      }

      setApiResult(result);
      setIsModalOpen(true); // 打开模态框显示结果
      
      // 记录测试完成日志
      const completeLog = `[${new Date().toISOString()}] 测试完成: 总耗时 ${responseTime}ms, 成功: ${response.ok}`;
      logs.push(completeLog);
      console.log(completeLog);
      console.log('完整响应数据:', result);
      
      // 在控制台打印完整请求和响应信息（便于调试）
      console.groupCollapsed(`API测试详情: ${api.method} ${api.path}`);
      console.log('请求URL:', apiUrl);
      console.log('请求头:', requestHeadersCopy);
      console.log('响应状态:', response.status, response.statusText);
      console.log('响应头:', responseHeaders);
      console.log('响应数据:', parsedData);
      console.groupEnd();
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // 处理各种可能的错误情况
      let errorMessage = '未知错误';
      let errorDetails = { code: 'UNKNOWN_ERROR', message: '', suggestions: [] as string[] };
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '网络连接失败，请检查网络设置或API服务是否可用';
          errorDetails = {
            code: 'NETWORK_ERROR',
            message: '无法建立与服务器的连接',
            suggestions: [
              '检查您的网络连接是否正常',
              '确认API服务地址是否正确',
              '验证API服务是否正在运行',
              '检查是否存在防火墙或代理限制'
            ]
          };
          
          // 可能是CORS问题或网络不通
          if (error.message.includes('CORS')) {
            errorMessage = '跨域请求被拒绝（CORS限制），请确保API服务支持跨域请求';
            errorDetails = {
              code: 'CORS_ERROR',
              message: '浏览器的同源策略阻止了跨域请求',
              suggestions: [
                '确认API服务是否配置了正确的CORS头',
                '考虑使用代理服务器转发请求',
                '在开发环境中使用浏览器扩展临时禁用CORS限制'
              ]
            };
          }
        } else if (error.message.includes('protocol')) {
          errorMessage = 'URL协议错误，请确保使用http或https协议';
          errorDetails = {
            code: 'URL_ERROR',
            message: 'API地址格式错误',
            suggestions: [
              '验证URL格式是否正确（必须包含http://或https://）',
              '检查URL中是否包含非法字符'
            ]
          };
        } else if (error.name === 'AbortError') {
          errorMessage = '请求超时，请检查网络连接或API服务响应速度';
          errorDetails = {
            code: 'TIMEOUT_ERROR',
            message: 'API请求超过了10秒的超时限制',
            suggestions: [
              '检查网络连接速度',
              '确认API服务是否负载过高',
              '考虑增加请求超时时间'
            ]
          };
        } else {
          errorMessage = error.message;
          errorDetails = {
            code: 'REQUEST_ERROR',
            message: error.message,
            suggestions: [
              '查看浏览器控制台获取更详细的错误信息',
              '确认API服务是否可用',
              '检查请求参数和格式是否正确'
            ]
          };
        }
      }
      
      // 记录错误日志
      const errorLog = `[${new Date().toISOString()}] 测试失败: ${errorMessage}, 总耗时 ${responseTime}ms`;
      logs.push(errorLog);
      console.error(errorLog);
      console.error('错误详情:', error);
      
      // 在控制台打印完整错误详情
      console.groupCollapsed('API错误详情');
      console.error('错误类型:', errorDetails.code);
      console.error('错误消息:', errorDetails.message);
      console.error('排查建议:', errorDetails.suggestions);
      console.error('完整错误对象:', error);
      console.groupEnd();

      setApiResult({
        success: false,
        statusCode: 0,
        statusText: 'Request Failed',
        responseTime,
        error: errorMessage,
        errorDetails,
        data: null, // 不提供模拟数据
        logs, // 添加日志信息
        requestDetails: {
          url: getApiUrlFromPath(api.path),
          method: api.method
        }
      });
      setIsModalOpen(true); // 打开模态框显示错误结果
    } finally {
      setIsTesting(false);
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
    setApiResult(null);
    setSelectedApi(null);
    setShowFullLogs(false);
  };

  // 获取当前显示的API列表
  const currentApis = activeTab === 'user' ? userApis : systemApis;

  // 根据API路径从apipathd.json中获取完整URL
  const getApiUrlFromPath = (path: string): string => {
    // 忽略apipathd.json中的apipath字段，始终返回相对路径
    // 这样Next.js的代理功能就能正确处理这些请求
    return path;
  };

  // 模态框组件
  const ResultModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {selectedApi && (
              <span className={`${getMethodColor(selectedApi.method)} text-white text-xs font-bold px-2 py-1 rounded`}>
                {selectedApi.method}
              </span>
            )}
            <h2 className="text-lg font-bold text-gray-800"> API响应结果 </h2>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="p-4 overflow-auto flex-1">
          {isTesting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">正在测试API连接...</p>
            </div>
          ) : apiResult && (
            <div className="space-y-4">
              {/* 响应状态 */}
              <div className="p-3 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-700">响应状态</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${apiResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {apiResult.statusCode} {apiResult.statusText}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
                  <div>响应时间: {apiResult.responseTime}ms</div>
                  <div>测试时间: {new Date().toLocaleString()}</div>
                </div>
                {/* 状态码描述 */}
                {apiResult.statusCode > 0 && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {getStatusCodeDescription(apiResult.statusCode)}
                  </div>
                )}
              </div>

              {/* 请求详情 */}
              {apiResult.requestDetails && (
                <div className="p-3 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">请求详情</h3>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">请求方法:</span>
                      <span className="font-medium text-gray-800">{apiResult.requestDetails.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">请求URL:</span>
                      <span className="font-medium text-gray-800 break-all max-w-[60%] text-right">{apiResult.requestDetails.url}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 请求头信息 */}
              {apiResult.requestHeaders && Object.keys(apiResult.requestHeaders).length > 0 && (
                <div className="p-3 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">请求头信息</h3>
                  <div className="bg-gray-50 p-3 rounded-lg overflow-auto max-h-32">
                    <table className="w-full text-xs">
                      <tbody>
                        {Object.entries(apiResult.requestHeaders).map(([key, value], idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-1 px-2 font-medium text-gray-700">{key}:</td>
                            <td className="py-1 px-2 text-gray-600 break-all">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 数据展示切换按钮 */}
              {apiResult.data && (
                <div className="flex justify-end">
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className={`px-3 py-1 text-xs ${viewMode === 'formatted' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => setViewMode('formatted')}
                    >
                      格式化视图
                    </button>
                    <button
                      className={`px-3 py-1 text-xs ${viewMode === 'raw' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => setViewMode('raw')}
                    >
                      原始视图
                    </button>
                  </div>
                </div>
              )}

              {/* 详细日志信息 */}
              {apiResult.logs && apiResult.logs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-700">详细日志</h3>
                    <div className="flex space-x-2">
                      <button
                        className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                        onClick={() => setShowFullLogs(!showFullLogs)}
                      >
                        {showFullLogs ? '收起日志' : '展开全部日志'}
                      </button>
                      <button
                        className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                        onClick={() => {
                          // 在控制台打印完整日志
                          console.group('API测试完整日志');
                          apiResult.logs?.forEach(log => console.log(log));
                          console.groupEnd();
                          alert('完整日志已打印到浏览器控制台（按F12查看）');
                        }}
                      >
                        控制台输出
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 overflow-auto max-h-40">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                      {showFullLogs 
                        ? apiResult.logs.join('\n') 
                        : apiResult.logs.slice(-10).join('\n') + 
                          (apiResult.logs.length > 10 ? '\n... 还有更多日志，请点击"展开全部日志"按钮' : '')
                      }
                    </pre>
                  </div>
                </div>
              )}

              {/* 响应数据 */}
              {apiResult.data ? (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">响应数据</h3>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 overflow-auto max-h-[50vh]">
                    {viewMode === 'formatted' ? (
                      <div>
                        {/* 显示内容类型提示 */}
                        {apiResult.headers && apiResult.headers['content-type'] && (
                          <div className="text-xs text-gray-500 mb-2 italic">
                            内容类型: {apiResult.headers['content-type']}
                          </div>
                        )}
                        
                        {/* 根据数据类型显示不同的格式化内容 */}
                        {typeof apiResult.data === 'object' && apiResult.data !== null ? (
                          apiResult.data.rawText ? (
                            // 显示解析失败的提示和原始文本
                            <div>
                              <div className="text-xs text-red-500 mb-2">
                                JSON解析失败: {apiResult.data.parsingError}
                              </div>
                              <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                                {apiResult.data.rawText}
                              </pre>
                            </div>
                          ) : (
                            // 正常显示JSON对象
                            <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                              {JSON.stringify(apiResult.data, null, 2)}
                            </pre>
                          )
                        ) : (
                          <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                            {apiResult.data}
                          </pre>
                        )}
                      </div>
                    ) : (
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                        {apiResult.rawResponse}
                      </pre>
                    )}
                  </div>
                </div>
              ) : !apiResult.success && apiResult.error ? (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">响应数据</h3>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center py-8">
                    <p className="text-sm text-gray-500">API请求失败，未返回数据</p>
                  </div>
                </div>
              ) : null}

              {/* 错误信息 */}
              {!apiResult.success && apiResult.error && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-red-700">错误信息</h3>
                    <span className="text-xs text-red-500">❌ 失败</span>
                  </div>
                  <p className="text-xs text-red-600 mb-2">{apiResult.error}</p>
                  
                  {/* 错误详情 */}
                  {apiResult.errorDetails && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-600 mb-1">错误代码: {apiResult.errorDetails.code}</div>
                      {apiResult.errorDetails.message && (
                        <div className="text-xs text-gray-600 mb-2">{apiResult.errorDetails.message}</div>
                      )}
                    </div>
                  )}
                  
                  {/* 排查建议 */}
                  {apiResult.errorDetails?.suggestions && apiResult.errorDetails.suggestions.length > 0 && (
                    <div className="text-xs text-gray-500">
                      <p className="font-medium mb-1">建议排查方向：</p>
                      <ul className="list-disc list-inside space-y-1">
                        {apiResult.errorDetails.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* 通用排查建议 */}
                  {(!apiResult.errorDetails || !apiResult.errorDetails.suggestions || apiResult.errorDetails.suggestions.length === 0) && (
                    <div className="text-xs text-gray-500">
                      <p>建议排查方向：</p>
                      <ul className="list-disc list-inside space-y-1">
                        {apiResult.error?.includes('网络连接失败') && <li>检查网络连接是否正常</li>}
                        {apiResult.error?.includes('CORS') && <li>确认API服务是否配置了正确的跨域头</li>}
                        {apiResult.error?.includes('protocol') && <li>验证URL格式是否正确（http/https）</li>}
                        <li>查看浏览器控制台（F12）获取更详细的错误信息</li>
                        <li>确认API服务是否正在运行</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 响应头 */}
              {apiResult.headers && Object.keys(apiResult.headers).length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">响应头</h3>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 overflow-auto max-h-40">
                    <table className="w-full text-xs">
                      <tbody>
                        {Object.entries(apiResult.headers).map(([key, value], idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-1 px-2 font-medium text-gray-700">{key}:</td>
                            <td className="py-1 px-2 text-gray-600 break-all">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 成功提示 */}
              {apiResult.success && (
                <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                  <div className="flex items-start space-x-2">
                    <div className="mt-0.5 text-green-500">✓</div>
                    <div>
                      <h3 className="text-sm font-bold text-green-700 mb-1">API连接成功</h3>
                      <p className="text-xs text-green-600">
                        该API接口已成功连接并返回数据。所有字段均已正确获取，可以在上方查看详细信息。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 模态框底部 */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={closeModal}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">API接口测试平台</h1>
          <p className="text-gray-600">测试系统各API接口的连接状态与响应数据</p>
        </div>

        {/* 导航标签 */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('user')}
          >
            用户相关API
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'system' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('system')}
          >
            系统相关API
          </button>
        </div>

        {/* API列表 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-gray-800">API接口列表</div>
          {/* 只在客户端挂载后显示按钮，避免hydration错误 */}
          {mounted && (
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                用户注册
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                onClick={() => setIsLoginModalOpen(true)}
              >
                用户登录
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-1"
                onClick={refreshApiList}
                disabled={isLoadingApis}
              >
                {isLoadingApis ? (
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : '刷新'}
              </button>
            </div>
          )}
          </div>
          
          {/* API列表内容 */}
          {isLoadingApis ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600">正在加载API接口列表...</p>
            </div>
          ) : apiListError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-600 mb-3">{apiListError}</p>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={refreshApiList}
              >
                重试
              </button>
            </div>
          ) : currentApis.length === 0 ? (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <p className="text-gray-600">暂无可用的API接口</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentApis.map((api, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group"
                  onClick={() => testApi(api)}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${getMethodColor(api.method)} text-white text-xs font-bold px-2 py-1 rounded`}>
                      {api.method}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {api.path}
                      </div>
                      <div className="text-xs text-gray-500">{api.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {api.requiresAuth && (
                      <span className="text-xs text-blue-500">🔒</span>
                    )}
                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                      测试连接 →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <ResultModal />}
       

        <Suspense fallback={null}>
          <RegisterModal
            isOpen={isRegisterModalOpen}
            form={registerForm}
            isRegistering={isRegistering}
            registerError={registerError}
            registerSuccess={registerSuccess}
            onInputChange={handleRegisterInputChange}
            onSubmit={handleRegisterSubmit}
            onClose={closeRegisterModal}
          />
          <LoginModal
                isOpen={isLoginModalOpen}
                form={loginForm}
                isLoggingIn={isLoggingIn}
                loginError={loginError}
                loginSuccess={loginSuccess}
                loginLogs={loginLogs}
                onInputChange={handleLoginInputChange}
                onSubmit={handleLoginSubmit}
                onClose={closeLoginModal}
              />
        </Suspense>
    </div>
  );
};

export default ApiPage;