import { NextResponse } from 'next/server';
import axios from 'axios';

// 这个API接口用于获取指定的Swagger UI页面信息
export async function GET() {
  try {
    // 目标API地址
    const targetUrl = 'https://catchweight-graphemically-eldora.ngrok-free.dev/api/swagger-ui/index.html#/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86';
    
    console.log('尝试获取API页面信息:', targetUrl);
    
    // 由于直接获取完整的HTML页面可能会有跨域问题
    // 这里我们可以模拟获取API文档信息，实际项目中可能需要调整
    
    // 检查URL是否可达
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'ngrok-skip-browser-warning': '1' // 尝试跳过ngrok的浏览器警告
      },
      timeout: 10000 // 10秒超时
    });
    
    console.log('API页面信息获取成功，状态码:', response.status);
    
    // 返回成功响应，包含HTML内容
    return NextResponse.json({
      success: true,
      message: 'API页面信息获取成功',
      data: {
        url: targetUrl,
        status: response.status,
        contentLength: (response.data as string)?.length || 0,
        contentType: response.headers['content-type']
        // 注意：在实际应用中，可能需要处理HTML内容以提取有用信息
      }
    });
  } catch (error) {
    console.error('获取API页面信息失败:', error);
    
    // 错误处理
    let errorMessage = '获取API页面信息失败';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : '未知错误',
        data: {
          url: 'https://catchweight-graphemically-eldora.ngrok-free.dev/api/swagger-ui/index.html#/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86',
          info: '这是一个通过ngrok提供的Swagger UI接口文档页面，可能存在访问限制'
        }
      },
      { status: 500 }
    );
  }
}

// 支持POST请求以便登录验证
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 可以根据请求体中的参数定制获取信息的方式
    const targetUrl = body.url || 'https://catchweight-graphemically-eldora.ngrok-free.dev/api/swagger-ui/index.html#/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86';
    
    // 提取用户名和密码进行验证
    const { username, password } = body;
    
    console.log('尝试通过POST请求获取API页面信息:', targetUrl);
    
    // 模拟登录验证逻辑
    // 这里只是简单演示，实际项目中应该使用真实的验证机制
    let isAuthenticated = false;
    let userRole = '';
    let userId = '';
    
    if (username === 'admin' && password === 'admin123') {
      isAuthenticated = true;
      userRole = 'admin';
      userId = 'admin-1';
    } else if (username === 'publisher01' && password === 'pub123456') {
      isAuthenticated = true;
      userRole = 'publisher';
      userId = 'publisher-1';
    } else if (username === 'commenter01' && password === 'com123456') {
      isAuthenticated = true;
      userRole = 'commenter';
      userId = 'commenter-1';
    }
    
    // 返回模拟的登录验证结果
    if (isAuthenticated) {
      return NextResponse.json({
        success: true,
        message: '登录验证成功',
        data: {
          url: targetUrl,
          user: {
            id: userId,
            username,
            role: userRole,
            token: `mock-token-${Date.now()}`,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
          },
          info: '这是模拟的登录验证结果，实际项目中应该连接真实的用户系统'
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: '用户名或密码错误',
          data: {
            url: targetUrl
          }
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('POST请求获取API页面信息失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '服务器内部错误'
      },
      { status: 500 }
    );
  }
}