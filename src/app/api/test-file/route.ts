import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
    console.log('File path:', filePath);
    
    // 检查文件是否存在
    const exists = fs.existsSync(filePath);
    console.log('File exists:', exists);
    
    if (exists) {
      // 尝试读取文件
      const fileContents = fs.readFileSync(filePath, 'utf8');
      console.log('File read successfully, content length:', fileContents.length);
      
      // 尝试写入文件
      fs.writeFileSync(filePath, fileContents, 'utf8');
      console.log('File write successfully');
      
      return NextResponse.json({ success: true, message: '文件读写测试成功' });
    } else {
      return NextResponse.json({ success: false, message: '文件不存在' });
    }
  } catch (error) {
    console.error('File test error:', error);
    return NextResponse.json({ success: false, message: '文件测试失败', error: error.message });
  }
}