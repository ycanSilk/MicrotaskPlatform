import { NextResponse } from 'next/server';
import commenterUsers from '@/data/commenteruser/commenteruser.json';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 查找评论员用户
    const user = commenterUsers.users.find(u => 
      u.username === username
    );

    // 用户不存在
    if (!user) {
      return NextResponse.json(
        { success: false, message: '评论员账户不存在' },
        { status: 401 }
      );
    }

    // 验证密码
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: '密码错误' },
        { status: 401 }
      );
    }

    // 构造返回的用户信息（不包含密码）
    const { password: _, ...userInfo } = user;

    // 登录成功
    return NextResponse.json({
      success: true,
      user: userInfo,
      message: '评论员登录成功'
    });

  } catch (error) {
    console.error('Commenter login error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}