// 测试token文件路径是否正确
import fs from 'fs';
import path from 'path';

// 获取当前工作目录
const cwd = process.cwd();
console.log('当前工作目录:', cwd);

// 构建token文件路径
try {
  const tokenFilePath = path.join(cwd, 'src', 'app', 'api-page', 'logintest', 'auth-token.json');
  console.log('Token文件路径:', tokenFilePath);
  
  // 确保目录存在
  const tokenDir = path.dirname(tokenFilePath);
  if (!fs.existsSync(tokenDir)) {
    fs.mkdirSync(tokenDir, { recursive: true });
    console.log('已创建目录:', tokenDir);
  }
  
  // 创建一个测试token文件
  const testTokenData = {
    token: 'test-token-123456',
    tokenType: 'Bearer',
    expiresIn: 3600,
    timestamp: Date.now(),
    expiresAt: Date.now() + 3600 * 1000
  };
  
  fs.writeFileSync(tokenFilePath, JSON.stringify(testTokenData, null, 2));
  console.log('测试token文件已创建:', tokenFilePath);
  
  // 读取测试文件
  const fileContent = fs.readFileSync(tokenFilePath, 'utf8');
  console.log('文件内容:', fileContent);
  
  // 保留测试文件以便验证
  console.log('测试token文件已创建并保留');
} catch (error) {
  console.error('测试失败:', error);
}