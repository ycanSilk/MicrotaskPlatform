// 直接测试API的脚本，不依赖文件读写
const https = require('https');
const http = require('http');

// 生成有效token
const user = {
  userId: 'com004',
  username: 'test123',
  role: 'commenter',
  exp: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
};

const token = Buffer.from(JSON.stringify(user)).toString('base64');
console.log('生成的Token:', token);

// 测试API调用
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/commenter/user-tasks',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

console.log('发送API请求...');
const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`响应状态码: ${res.statusCode}`);
    console.log('响应头:', res.headers);
    console.log('响应体:', data);
  });
});

req.on('error', (e) => {
  console.error(`请求错误: ${e.message}`);
});

req.end();