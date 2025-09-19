// 生成评论员测试token的脚本
const fs = require('fs');

// 用户信息（使用com004用户）
const user = {
  userId: 'com004',
  username: 'test123',
  role: 'commenter',
  exp: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
};

// 生成token
const token = Buffer.from(JSON.stringify(user)).toString('base64');
console.log('生成的有效测试token:', token);
console.log('\n请使用以下命令测试API:');
console.log(`curl -X GET http://localhost:3000/api/commenter/user-tasks -H "Authorization: Bearer ${token}"`);

// 将token保存到文件，方便复制
fs.writeFileSync('test_token.txt', token);
console.log('\nToken已保存到test_token.txt文件');