import { NextRequest, NextResponse } from 'next/server';

// 定义响应数据类型
interface RegisterResponse {
  code: number;
  message: string;
  data?: any;
  timestamp: number;
}

// 定义请求参数类型
interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
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
    const { username, password, email, phone }: RegisterRequest = body;
    
    // 验证必要的字段，现在只要求用户名和密码是必需的
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段: username, password' },
        { status: 400, headers: getCorsHeaders() }
      );
    }
    
    // 直接使用外部API URL，不再从配置文件读取
    const externalApiUrl = 'http://localhost:8888/api/users/register';
    
    // 调用外部注册API
    const startTime = Date.now();
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({ username, password, email, phone })
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
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
      const data: RegisterResponse = await response.json();
      
      console.log('注册API调用结果:', { code: data.code, message: data.message });
      
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