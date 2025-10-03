import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 定义响应数据类型
interface LoginResponse {
  code: number;
  message: string;
  data?: {
    token: string;
    tokenType: string;
    expiresIn: number;
    userInfo: {
      id: number;
      username: string;
      email: string;
      phone: string;
      avatarUrl: string | null;
    };
  };
  timestamp: number;
}

// 定义请求参数类型
interface LoginRequest {
  username: string;
  password: string;
}

// 保存token到文件
function saveTokenToFile(tokenData: {token: string; tokenType: string; expiresIn: number}, username: string, password: string) {
  try {
    const tokenFilePath = path.join(process.cwd(), 'src', 'app', 'api-page', 'logintest', 'auth-token.json');
    const tokenDataWithTimestamp = {
      ...tokenData,
      username: username,
      password: password,
      timestamp: Date.now(),
      expiresAt: Date.now() + (tokenData.expiresIn * 1000) // 转换为毫秒
    };
    
    // 确保目录存在
    const tokenDir = path.dirname(tokenFilePath);
    if (!fs.existsSync(tokenDir)) {
      fs.mkdirSync(tokenDir, { recursive: true });
    }
    
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokenDataWithTimestamp, null, 2));
    console.log('Token saved successfully to:', tokenFilePath);
    console.log('Token data includes:', Object.keys(tokenDataWithTimestamp));
  } catch (error) {
    console.error('Failed to save token:', error);
  }
}

// 配置CORS响应头
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  };
}

// 处理OPTIONS预检请求
export function OPTIONS() {
  return NextResponse.json(
    { success: true, message: 'CORS preflight request successful' },
    { headers: getCorsHeaders() }
  );
}

// 直接使用外部API的POST方法
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { username, password }: LoginRequest = body;
    
    // 验证必要的字段
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段: username, password' },
        { status: 400, headers: getCorsHeaders() }
      );
    }
    
    // 直接使用外部API URL，不再从配置文件读取
    const externalApiUrl = 'http://localhost:8888/api/users/login';
    
    // 调用外部登录API
    const startTime = Date.now();
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({ username, password })
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || `API请求失败: ${response.status}`,
          errorCode: response.status,
          responseTime
        },
        { status: response.status, headers: getCorsHeaders() }
      );
    }
    
    // 检查响应头中的内容类型
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      // 如果不是JSON响应，读取响应文本并返回错误
      const responseText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: `API返回了非JSON响应 (${contentType || '未知类型'})`,
          errorCode: response.status,
          responseText,
          responseTime
        },
        { status: response.status, headers: getCorsHeaders() }
      );
    }
    
    try {
      // 解析API返回的真实数据
      const data: LoginResponse = await response.json();
      
      // 如果登录成功且有token数据，保存token到文件
      if (data.code === 200 && data.data?.token) {
        console.log('登录成功，准备保存token到文件');
        const tokenResult = saveTokenToFile({
          token: data.data.token,
          tokenType: data.data.tokenType || 'Bearer',
          expiresIn: data.data.expiresIn || 3600
        }, username, password);
        console.log('Token保存操作完成，已保存用户名和密码');
        console.log('API返回的token数据:', { token: data.data.token.substring(0, 20) + '...', tokenType: data.data.tokenType, expiresIn: data.data.expiresIn });
      } else {
        console.log('登录未成功或没有token数据:', { code: data.code, hasToken: !!data.data?.token });
      }
      
      return NextResponse.json({
        success: true,
        data,
        responseTime
      }, { status: 200, headers: getCorsHeaders() });
    } catch (jsonError) {
      // JSON解析失败的情况
      return NextResponse.json(
        {
          success: false,
          error: `JSON解析失败: ${jsonError instanceof Error ? jsonError.message : '未知错误'}`,
          errorCode: 400,
          responseTime
        },
        { status: 400, headers: getCorsHeaders() }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '网络请求失败', 
        errorCode: 500 
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}