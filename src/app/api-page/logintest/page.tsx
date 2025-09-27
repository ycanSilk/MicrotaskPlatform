'use client';

import React, { useState, useEffect } from 'react';
import localApiConfig from '../localapipath.json';
import { RegisterModal, RegisterResultDisplay, ApiResult } from './register';

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

const ApiTestPage: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // 获取需要的三个API配置
  const apiEndpoints = localApiConfig.api.filter(api => 
    ['/api/users/register', '/api/users/login', '/api/users/me'].includes(api.name)
  );

  // 处理API点击
  const handleApiClick = async (api: ApiEndpoint) => {
    setSelectedApi(api);
    
    // 如果是注册API，显示注册模态框
    if (api.name === '/api/users/register') {
      setShowRegisterModal(true);
    } else {
      // 对于其他API，执行模拟调用
      setIsModalOpen(true);
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

  // 处理注册成功
  const handleRegisterSuccess = (result: ApiResult) => {
    setShowRegisterModal(false);
    setApiResult(result);
    setShowResultModal(true);
  };

  // 处理注册失败
  const handleRegisterError = (result: ApiResult) => {
    setShowRegisterModal(false);
    setApiResult(result);
    setShowResultModal(true);
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

      {/* 注册模态框 */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onRegisterError={handleRegisterError}
      />

      {/* 注册结果展示模态框 */}
      {apiResult && (
        <RegisterResultDisplay
          result={apiResult}
          onClose={() => setShowResultModal(false)}
        />
      )}

      {/* 其他API的模态框 */}
      {isModalOpen && selectedApi && selectedApi.name !== '/api/users/register' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                API调用结果: {selectedApi.name}
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
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">正在调用API...</span>
                </div>
              ) : apiResult ? (
                <div className="space-y-4">
                  {/* 状态提示 */}
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
                  
                  {/* 请求信息 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">请求信息</h4>
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">URL:</span>
                        <span className="font-mono">{apiResult.requestDetails?.url || selectedApi.name}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">方法:</span>
                        <span className="font-mono font-bold text-green-600">{apiResult.requestDetails?.method || selectedApi.method}</span>
                      </div>
                      {apiResult.responseTime !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">响应时间:</span>
                          <span className="font-mono">{apiResult.responseTime}ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 状态码 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">状态码:</span>
                    <span className={`font-mono font-bold ${apiResult.success ? 'text-green-600' : 'text-red-600'}`}>
                      {apiResult.statusCode} {apiResult.statusText}
                    </span>
                  </div>
                  
                  {/* 响应数据 */}
                  {apiResult.data && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">响应数据</h4>
                      <pre className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-auto">
                        {JSON.stringify(apiResult.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {/* 错误信息 */}
                  {!apiResult.success && apiResult.error && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">错误信息</h4>
                      <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
                        {apiResult.error}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  请点击API按钮进行测试
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default ApiTestPage;