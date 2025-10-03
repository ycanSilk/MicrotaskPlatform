import { NextResponse } from 'next/server';

// GET登录API实现
export async function GET(request: Request) {
  try {
    // 获取URL参数
    const url = new URL(request.url);
    const username = url.searchParams.get('username') || 'test';
    const password = url.searchParams.get('password') || '123456';

    // 验证用户名和密码
    // 在实际应用中，这里应该连接数据库进行验证
    if (username !== 'test' || password !== '123456') {
      return NextResponse.json(
        {
          code: 401,
          message: '用户名或密码错误',
          data: null,
          timestamp: Date.now()
        },
        {
          status: 401,
          headers: {
            'cache-control': 'no-cache,no-store,max-age=0,must-revalidate',
            'connection': 'keep-alive',
            'content-type': 'application/json',
            'date': new Date().toUTCString(),
            'expires': '0',
            'keep-alive': 'timeout=60',
            'pragma': 'no-cache',
            'transfer-encoding': 'chunked',
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
            'x-xss-protection': '1; mode=block'
          }
        }
      );
    }

    // 生成token和响应数据
    const now = Date.now();
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsImV4cCI6${now + 86400000}`;
    const randomUserIds = [1, 10, 42, 100, 500, 999];
    const randomPhoneSuffixes = ['0001', '1234', '5678', '8888', '6666', '9999'];
    const randomEmails = ['test@example.com', 'user@demo.org', 'login@test.com', 'demo@mail.net'];

    // 构造响应数据
    const responseData = {
      code: 200,
      message: '登录成功',
      data: {
        token: token,
        tokenType: 'Bearer',
        expiresIn: 86400000,
        userInfo: {
          id: randomUserIds[Math.floor(Math.random() * randomUserIds.length)],
          username: username,
          email: randomEmails[Math.floor(Math.random() * randomEmails.length)],
          phone: `1380013${randomPhoneSuffixes[Math.floor(Math.random() * randomPhoneSuffixes.length)]}`,
          avatarUrl: `/images/avatar.jpg?t=${now}`
        }
      },
      timestamp: now
    };

    // 返回成功响应
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'cache-control': 'no-cache,no-store,max-age=0,must-revalidate',
        'connection': 'keep-alive',
        'content-type': 'application/json',
        'date': new Date().toUTCString(),
        'expires': '0',
        'keep-alive': 'timeout=60',
        'pragma': 'no-cache',
        'transfer-encoding': 'chunked',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block'
      }
    });
  } catch (error) {
    // 错误处理
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
        data: null,
        timestamp: Date.now()
      },
      {
        status: 500,
        headers: {
          'cache-control': 'no-cache,no-store,max-age=0,must-revalidate',
          'connection': 'keep-alive',
          'content-type': 'application/json',
          'date': new Date().toUTCString(),
          'expires': '0',
          'keep-alive': 'timeout=60',
          'pragma': 'no-cache',
          'transfer-encoding': 'chunked',
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY',
          'x-xss-protection': '1; mode=block'
        }
      }
    );
  }
}