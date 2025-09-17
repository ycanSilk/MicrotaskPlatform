import { NextResponse } from 'next/server';
import publisherUsers from '@/data/publisheruser/publisheruser.json';
import { generateToken } from '@/lib/auth'; // 导入生成token的函数

export async function POST(request: Request) {
  console.log('=== Publisher Login API Called ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  
  try {
    // 尝试读取请求体
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { success: false, message: '请求体解析失败' },
        { status: 400 }
      );
    }
    
    const { username, password } = body;
    
    console.log('Publisher login API called with:', { username, password });

    // 验证输入
    if (!username || !password) {
      console.log('Publisher login failed: Username or password is empty');
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 查找发布者用户
    const user = publisherUsers.users.find(u => 
      u.username === username
    );
    
    console.log('User lookup result:', user);

    // 用户不存在
    if (!user) {
      console.log('Publisher login failed: User not found');
      return NextResponse.json(
        { success: false, message: '发布者账户不存在' },
        { status: 401 }
      );
    }

    // 验证密码
    if (user.password !== password) {
      console.log('Publisher login failed: Password incorrect');
      return NextResponse.json(
        { success: false, message: '密码错误' },
        { status: 401 }
      );
    }

    // 构造返回的用户信息（不包含密码）
    const { password: _, ...userInfo } = user;
    
    // 确保返回的用户信息包含role字段
    const userResponse = {
      ...userInfo,
      role: user.role
    };
    
    console.log('User info to return:', userResponse);

    // 生成认证token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role as any,
      phone: user.phone,
      balance: user.balance || 0,
      status: 'active',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: new Date().toISOString()
    });
    
    console.log('Generated token:', token);

    // 登录成功
    console.log('Publisher login successful for user:', username);
    return NextResponse.json({
      success: true,
      user: userResponse,
      token, // 返回生成的token
      message: '发布者登录成功'
    });

  } catch (error) {
    console.error('Publisher login error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}