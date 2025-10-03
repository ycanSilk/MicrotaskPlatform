import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 从类型文件导入用户信息接口
import type { UserInfo } from '../../../types/user';

// 从文件中读取token
function getTokenFromFile() {
  try {
    const tokenFilePath = path.join(process.cwd(), 'src', 'app', 'api-page', 'logintest', 'auth-token.json');
    console.log('尝试从文件读取token:', tokenFilePath);
    
    if (!fs.existsSync(tokenFilePath)) {
      console.log('Token文件不存在:', tokenFilePath);
      return null;
    }
    
    const tokenFileContent = fs.readFileSync(tokenFilePath, 'utf-8');
    console.log('Token文件内容长度:', tokenFileContent.length, '字符');
    
    const tokenData = JSON.parse(tokenFileContent);
    console.log('Token数据字段列表:', Object.keys(tokenData));
    
    // 检查token是否过期
    if (tokenData.expiresAt && tokenData.expiresAt < Date.now()) {
      const expiredTime = new Date(tokenData.expiresAt);
      console.log('Token已过期于:', expiredTime.toLocaleString('zh-CN'));
      console.log('当前时间:', new Date().toLocaleString('zh-CN'));
      return null;
    } else if (tokenData.expiresAt) {
      const expiresTime = new Date(tokenData.expiresAt);
      const timeRemaining = Math.ceil((expiresTime.getTime() - Date.now()) / (1000 * 60));
      console.log('Token有效期剩余:', timeRemaining, '分钟');
    }
    
    return tokenData;
  } catch (error) {
    console.error('读取token文件失败:', error instanceof Error ? error.message : '未知错误');
    return null;
  }
}

// 配置CORS响应头
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
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

// 处理GET请求
export async function GET(request: NextRequest) {
  try {
    console.log('开始处理获取用户信息请求');
    
    // 从Authorization头中获取token，优先于文件读取
    const authHeader = request.headers.get('authorization');
    let token = null;
    let tokenSource = 'none';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      tokenSource = 'header';
      console.log('从请求头获取到token，长度:', token.length);
    } else {
      // 如果请求头中没有token，从文件中读取
      const tokenData = getTokenFromFile();
      if (tokenData && tokenData.token) {
        token = tokenData.token;
        tokenSource = 'file';
        console.log('从文件获取到token，长度:', token.length);
      }
    }
    
    if (!token) {
      console.log('未找到有效的token');
      return NextResponse.json(
        { success: false, error: '未提供有效的认证token', errorCode: 401, debugInfo: { tokenSource } },
        { status: 401, headers: getCorsHeaders() }
      );
    }
    
    // 调用外部API获取用户信息
    const externalApiUrl = 'http://localhost:8888/api/users/me';
    console.log('调用外部API:', externalApiUrl);
    
    const startTime = Date.now();
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const responseTime = Date.now() - startTime;
    console.log('API响应时间:', responseTime, '毫秒');
    
    // 记录请求头和响应头信息用于调试
    const requestHeaders = Object.fromEntries(request.headers.entries());
    const responseHeaders = Object.fromEntries(response.headers.entries());
    
    console.log('请求头信息:', JSON.stringify(requestHeaders, null, 2));
    console.log('API响应状态码:', response.status);
    console.log('响应头信息:', JSON.stringify(responseHeaders, null, 2));
    
    // 处理非成功响应
    if (!response.ok) {
      console.log('API返回非成功状态码:', response.status);
      
      // 尝试解析错误响应
      let errorData: any = {};
      let responseText = '';
      
      try {
        errorData = await response.json();
        console.log('解析到的错误数据:', JSON.stringify(errorData, null, 2));
      } catch (jsonError) {
        console.log('JSON解析失败，尝试读取原始文本:', jsonError instanceof Error ? jsonError.message : '未知错误');
        responseText = await response.text();
        console.log('原始响应文本(前200字符):', responseText.substring(0, 200));
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorData?.message || `API请求失败: ${response.status}`,
          errorCode: response.status,
          responseTime,
          responseText: responseText.substring(0, 200), // 只返回部分文本避免过长
          debugInfo: {
            tokenSource,
            authHeaderUsed: authHeader ? authHeader.substring(0, 20) + '...' : null,
            requestUrl: externalApiUrl
          }
        },
        { status: response.status, headers: getCorsHeaders() }
      );
    }
    
    // 检查响应内容类型
    const contentType = response.headers.get('content-type');
    console.log('响应内容类型:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log('API返回非JSON响应，内容类型:', contentType);
      const responseText = await response.text();
      console.log('非JSON响应文本(前200字符):', responseText.substring(0, 200));
      
      return NextResponse.json(
        {
          success: false,
          error: `API返回了非JSON响应 (${contentType || '未知类型'})`,
          errorCode: response.status,
          responseText: responseText.substring(0, 200),
          debugInfo: {
            tokenSource,
            authHeaderUsed: authHeader ? authHeader.substring(0, 20) + '...' : null,
            requestUrl: externalApiUrl
          }
        },
        { status: 200, headers: getCorsHeaders() }
      );
    }
    
    // 解析成功响应
    try {
      const data = await response.json();
      console.log('成功解析API响应数据');
      
      return NextResponse.json({
        success: true,
        data,
        responseTime,
        debugInfo: {
          tokenSource,
          authHeaderUsed: authHeader ? authHeader.substring(0, 20) + '...' : null,
          requestUrl: externalApiUrl
        }
      }, { status: 200, headers: getCorsHeaders() });
    } catch (jsonError) {
      console.error('成功响应JSON解析失败:', jsonError instanceof Error ? jsonError.message : '未知错误');
      return NextResponse.json(
        {
          success: false,
          error: `JSON解析失败: ${jsonError instanceof Error ? jsonError.message : '未知错误'}`,
          errorCode: 400,
          responseTime,
          debugInfo: {
            tokenSource,
            authHeaderUsed: authHeader ? authHeader.substring(0, 20) + '...' : null,
            requestUrl: externalApiUrl
          }
        },
        { status: 400, headers: getCorsHeaders() }
      );
    }
  } catch (error) {
    console.error('处理请求时发生异常:', error instanceof Error ? error.message : '未知错误');
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