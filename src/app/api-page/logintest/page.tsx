'use client';
import React, { useState } from 'react';
import Link from 'next/link';

// 定义共享的文本常量
const SHARED_TEXT = {
  apiTestTitle: '用户登录API测试',
  apiPath: '/api-page/logintest/login',
  userInfoApiTitle: '获取用户信息API测试',
  userInfoApiPath: '/api/users/me',
  registerApiTitle: '用户注册API测试',
  registerApiPath: '/api/users/register'
};

// 客户端实际内容组件
const LoginTestClient: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API测试平台</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">API测试列表</h2>
          </div>
          
          <div className="px-4 py-6">
            {/* 用户登录API测试项 */}
            <Link href="/api-page/logintest/login" className="block" passHref>
              <div
                className={`w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-colors duration-200 text-left cursor-pointer hover:bg-gray-50 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col">
                  <div className="font-medium text-gray-900">{SHARED_TEXT.apiTestTitle}</div>
                  <div className="text-sm text-gray-500 mt-1">{SHARED_TEXT.apiPath}</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                  <span className="text-sm text-gray-400">{SHARED_TEXT.apiPath}</span>
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </div>
              </div>
            </Link>
            
            {/* 用户信息API测试项 */}
            <Link href="/api-page/logintest/getme" className="block" passHref>
              <div
                className={`w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-colors duration-200 text-left cursor-pointer hover:bg-gray-50 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col">
                  <div className="font-medium text-gray-900">{SHARED_TEXT.userInfoApiTitle}</div>
                  <div className="text-sm text-gray-500 mt-1">{SHARED_TEXT.userInfoApiPath}</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                  <span className="text-sm text-gray-400">{SHARED_TEXT.userInfoApiPath}</span>
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </div>
              </div>
            </Link>
            
            {/* 用户注册API测试项 */}
            <Link href="/api-page/logintest/register" className="block" passHref>
              <div
                className={`w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-colors duration-200 text-left cursor-pointer hover:bg-gray-50 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col">
                  <div className="font-medium text-gray-900">{SHARED_TEXT.registerApiTitle}</div>
                  <div className="text-sm text-gray-500 mt-1">{SHARED_TEXT.registerApiPath}</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                  <span className="text-sm text-gray-400">{SHARED_TEXT.registerApiPath}</span>
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTestClient;