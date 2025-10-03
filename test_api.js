const https = require('https');
const http = require('http');

const data = JSON.stringify({
  username: 'test',
  password: '123456'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api-page/logintest/login',
  method: 'POST',
  headers: {
    'accept': '*/*',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('正在发送请求到:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('请求头:', options.headers);
console.log('请求体:', data);

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log('响应头:', res.headers);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', responseBody);
    try {
      const parsedBody = JSON.parse(responseBody);
      console.log('解析后的JSON:', parsedBody);
    } catch (e) {
      console.log('响应不是有效的JSON:', e.message);
      console.log('响应内容类型:', res.headers['content-type']);
    }
  });
});

req.on('error', (e) => {
  console.error(`请求错误: ${e.message}`);
  console.log('请确认API服务器(localhost:8888)是否正在运行');
});

req.write(data);
req.end();