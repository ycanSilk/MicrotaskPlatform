import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 获取用户数据文件路径
const getUserDataFilePath = (role: string) => {
  const roleDir = role === 'commenter' ? 'commenteruser' : 'publisheruser';
  return path.join(process.cwd(), `src/data/${roleDir}/${roleDir}.json`);
};

// 读取用户数据
const getUsersData = (role: string) => {
  const filePath = getUserDataFilePath(role);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
};

// 保存用户数据
const saveUsersData = (role: string, data: any) => {
  const filePath = getUserDataFilePath(role);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function POST(request: Request) {
  try {
    const { username, password, email, phone, role } = await request.json();

    // 验证输入
    if (!username || !password || !role) {
      return NextResponse.json(
        { success: false, message: '用户名、密码和用户角色不能为空' },
        { status: 400 }
      );
    }

    // 验证角色是否有效
    if (!['commenter', 'publisher'].includes(role)) {
      return NextResponse.json(
        { success: false, message: '无效的用户角色' },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (username.length < 6 || username.length > 20) {
      return NextResponse.json(
        { success: false, message: '用户名长度必须在6-20位之间' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: '密码长度不能少于6位' },
        { status: 400 }
      );
    }

    // 如果提供了手机号，则验证手机号格式
    if (phone) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { success: false, message: '请输入正确的手机号码' },
          { status: 400 }
        );
      }
    }

    // 如果提供了邮箱，则验证邮箱格式
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: '请输入正确的邮箱地址' },
          { status: 400 }
        );
      }
    }

    // 读取现有用户数据
    const userData = getUsersData(role);
    
    // 检查用户名是否已存在
    const existingUser = userData.users.find((u: any) => u.username === username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户名已存在，请选择其他用户名' },
        { status: 400 }
      );
    }

    // 如果提供了手机号，检查手机号是否已存在
    if (phone) {
      const existingPhone = userData.users.find((u: any) => u.phone === phone);
      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: '手机号已被注册，请使用其他手机号' },
          { status: 400 }
        );
      }
    }

    // 生成新用户ID
    const prefix = role === 'commenter' ? 'com' : 'pub';
    const newId = `${prefix}${(userData.users.length + 1).toString().padStart(3, '0')}`;

    // 创建新用户对象，根据角色添加不同的字段
    const baseUser = {
      id: newId,
      username,
      password, // 注意：实际项目中应该加密存储密码
      role,
      phone: phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 如果有邮箱，添加邮箱字段
    if (email) {
      (baseUser as any).email = email;
    }

    // 对于publisher用户，添加额外字段
    if (role === 'publisher') {
      (baseUser as any).balance = 0;
      (baseUser as any).status = 'active';
    }

    // 添加新用户到用户列表
    userData.users.push(baseUser);

    // 保存更新后的用户数据
    saveUsersData(role, userData);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: `${role === 'commenter' ? '评论员' : '派单员'}账号注册成功！`,
      data: {
        id: baseUser.id,
        username: baseUser.username,
        role: baseUser.role,
        email: (baseUser as any).email || null,
        phone: baseUser.phone
      },
      timestamp: Date.now()
    }, { status: 200 });

  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '服务器内部错误',
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}