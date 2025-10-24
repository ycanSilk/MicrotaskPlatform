'use client'

import { useState } from 'react';
import type { UserInfo } from '../../../types/user';
// 导入客户端token存储服务
import { getAuthToken, clearAuthToken, hasAuthToken } from '../clientTokenStorage';

// 获取用户信息组件
// 定义请求信息类型
interface RequestInfo {
  url: string;
  method: string;
  timestamp: string;
  tokenUsed: boolean;
}

export default function GetUserInfo() {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // 格式化JSON输出
  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    console.log('Starting to fetch user info');
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);
    
    const startTime = Date.now();
    const apiUrl = '/api/login-test/getme';
    console.log('API URL:', apiUrl);
    
    // 创建请求头
    const headers = new Headers({
      'accept': '*/*'
    });
    
    // 尝试获取token信息
    console.log('Attempting to get auth token from client storage');
    const tokenData = await getAuthToken();
    let tokenUsed = false;
    
    if (tokenData) {
      // 如果有token，添加到请求头中
      console.log('Found token data, adding to request headers');
      console.log('Token details:', {
        tokenType: tokenData.tokenType,
        hasUsername: !!tokenData.username,
        hasPassword: !!tokenData.password,
        expiresAt: tokenData.expiresAt
      });
      const authHeaderValue = `${tokenData.tokenType} ${tokenData.token}`;
      headers.append('Authorization', authHeaderValue);
      console.log('Added Authorization header:', authHeaderValue.substring(0, 30) + '...');
      tokenUsed = true;
    } else {
      console.warn('未找到有效的token信息，请先登录');
    }
    
    const requestData = {
      method: 'GET',
      headers: headers
    };
    
    setRequestInfo({
      url: apiUrl,
      method: 'GET',
      timestamp: new Date().toLocaleString('zh-CN'),
      tokenUsed: tokenUsed
    });

    try {
      // 直接调用内部路由API
      console.log('Making request to internal API with tokenUsed:', tokenUsed);
      const result = await fetch(apiUrl, requestData);
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      console.log('API response received with status:', result.status);
      
      // 记录响应头
      console.log('API response headers:');
      result.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      const apiResponse = await result.json();
      console.log('API response data:', apiResponse);
      
      setResponse({
        ...apiResponse,
        statusCode: result.status
      });
      
      if (!apiResponse.success) {
        console.error('API request failed:', apiResponse.error || 'Unknown error');
        setError(apiResponse.error || '获取用户信息失败');
      } else {
        console.log('API request successful, user info retrieved');
      }
    } catch (err) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      const errorMessage = 'API请求失败：' + (err instanceof Error ? err.message : '未知错误');
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      console.log('API request completed');
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">获取用户信息API测试</h2>
          
          <p className="mb-4 text-sm text-gray-500">
            当前正在通过内部路由调用外部API: http://localhost:8888/api/users/me
          </p>
          
           

        
           {/* 获取用户信息按钮 */}
          <div className="mb-6">
            <button
              onClick={fetchUserInfo}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? '获取中...' : '获取用户信息'}
            </button>
          </div>

            {/* 返回按钮 */}
          <div className="mb-6">
            <button
              onClick={() => window.location.href = '/api-page/logintest'}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              返回
            </button>
          </div>

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
                  <div>
                    <p className="text-sm font-medium text-gray-700">Token使用状态:</p>
                    <p className={`text-sm ${requestInfo.tokenUsed ? 'text-green-600' : 'text-red-600'}`}>
                      {requestInfo.tokenUsed ? '已使用token' : '未使用token'}
                    </p>
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
                          <p className="text-sm font-medium text-gray-700">ID:</p>
                          <p className="text-sm text-gray-900">{response.data.data.id || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">用户名:</p>
                          <p className="text-sm text-gray-900">{response.data.data.username || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">邮箱:</p>
                          <p className="text-sm text-gray-900">{response.data.data.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">手机号:</p>
                          <p className="text-sm text-gray-900">{response.data.data.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">创建时间:</p>
                          <p className="text-sm text-gray-900">{formatDateTime(response.data.data.createTime || '')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">更新时间:</p>
                          <p className="text-sm text-gray-900">{formatDateTime(response.data.data.updateTime || '')}</p>
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
                        {formatJson(response)}
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
}



