// 登录API测试脚本
const http = require('http');
const https = require('https');


function testLoginApi() {
  console.log('====== 登录API测试 ======');
  console.log(new Date().toLocaleString());
  
  // API配置
  const apiConfig = {
    baseUrl: 'http://catchweight-graphemically-eldora.ngrok-free.dev/api/users/login',
    credentials: {
      username: 'apitestuser',
      password: '123456'
    },
    headers: {
      'accept': '*/*',
      'Authorization': 'Bearer 1',
      'Content-Type': 'application/json'
    }
  };
  
  console.log('\n测试配置信息:');
  console.log(`- API URL: ${apiConfig.baseUrl}`);
  console.log(`- 用户名: ${apiConfig.credentials.username}`);
  console.log(`- 请求方法: POST`);
  
  // 函数：发送请求并处理重定向
  function sendRequest(urlString, attempt = 1, maxAttempts = 3) {
    if (attempt > maxAttempts) {
      console.error(`\n❌ 达到最大重定向次数(${maxAttempts})，停止测试。`);
      console.log('\n测试完成！');
      console.log('========================');
      return;
    }
    
    try {
      const url = new URL(urlString);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          ...apiConfig.headers,
          'Content-Length': Buffer.byteLength(JSON.stringify(apiConfig.credentials))
        }
      };
      
      console.log(`\n[尝试 ${attempt}/${maxAttempts}] 正在发送${isHttps ? 'HTTPS' : 'HTTP'}登录请求到: ${urlString}`);
      
      // 发送请求
      const req = client.request(options, (res) => {
        let responseData = '';
        
        // 接收响应数据
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        // 响应结束时处理数据
        res.on('end', () => {
          console.log(`\n登录API响应状态码: ${res.statusCode}`);
          
          // 打印响应头
          console.log('\n响应头:');
          Object.entries(res.headers).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
          });
          
          // 处理重定向
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = new URL(res.headers.location, urlString);
            console.log(`\n检测到重定向(${res.statusCode})，目标URL: ${redirectUrl.href}`);
            
            // 如果是HTTP到HTTPS的重定向，直接跟随
            if (url.protocol === 'http:' && redirectUrl.protocol === 'https:') {
              console.log('\n正在跟随HTTP到HTTPS的安全重定向...');
              sendRequest(redirectUrl.href, attempt + 1, maxAttempts);
            } else {
              console.log('\n⚠️ 登录请求被重定向到其他类型的URL，未自动跟随。');
              console.log('\n测试完成！');
              console.log('========================');
            }
          } else {
            // 打印响应体
            console.log('\n响应体:');
            
            // 格式化输出响应体
            printResponseBody(responseData);
            
            // 分析登录结果和错误
            analyzeResponse(res.statusCode, responseData);
            
            console.log('\n测试完成！');
            console.log('========================');
          }
        });
      });
      
      // 处理请求错误
      req.on('error', (error) => {
        console.error(`\n❌ 请求发生错误: ${error.message}`);
        console.log('\n可能的原因:');
        console.log('1. 网络连接问题');
        console.log('2. API服务器不可用');
        console.log('3. URL格式错误');
        console.log('4. SSL/TLS证书问题（HTTPS）');
        console.log('\n建议的解决方案:');
        console.log('- 检查网络连接');
        console.log('- 验证API服务器是否正在运行');
        console.log('- 确认URL格式正确无误');
        console.log('\n测试完成！');
        console.log('========================');
      });
      
      // 设置请求超时
      req.setTimeout(10000, () => {
        req.abort();
        console.error('\n❌ 请求超时（10秒）');
      });
      
      // 发送请求体数据
      req.write(JSON.stringify(apiConfig.credentials));
      req.end();
    } catch (error) {
      console.error(`\n❌ URL解析错误: ${error.message}`);
      console.log('\n测试完成！');
      console.log('========================');
    }
  }
  
  // 辅助函数：格式化打印响应体
  function printResponseBody(responseData) {
    if (!responseData) {
      console.log('空响应体');
      return;
    }
    
    try {
      // 尝试解析JSON响应
      const parsedData = JSON.parse(responseData);
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (error) {
      // 如果不是有效的JSON，打印原始数据
      console.log(responseData);
      console.log('注意: 响应体不是有效的JSON格式');
    }
  }
  
  // 辅助函数：分析响应结果和错误
  function analyzeResponse(statusCode, responseData) {
    if (statusCode >= 200 && statusCode < 300) {
      console.log('\n✅ 登录请求发送成功！');
      
      try {
        const parsedData = JSON.parse(responseData);
        if (parsedData.token) {
          console.log('获取到Token，长度为:', parsedData.token.length);
        }
        if (parsedData.userId || parsedData.username) {
          console.log('登录成功，用户信息:', parsedData.userId ? `ID=${parsedData.userId}` : `用户名=${parsedData.username}`);
        }
      } catch (e) {
        // JSON解析失败，忽略
      }
    } else if (statusCode === 400) {
      console.log('\n❌ 登录请求失败：客户端错误（400）');
      console.log('这通常表示请求参数格式错误或缺少必要参数。');
      
      try {
        const parsedData = JSON.parse(responseData);
        if (parsedData.message) {
          console.log(`错误详情: ${parsedData.message}`);
          // 特别处理JWT密钥错误
          if (parsedData.message.includes('signing key')) {
            console.log('\n这是服务器端配置问题：');
            console.log('- JWT签名密钥大小不足（需要至少256位）');
            console.log('- 服务器应使用io.jsonwebtoken.security.Keys类的secretKeyFor方法生成安全密钥');
          }
        }
      } catch (e) {
        console.log('无法解析错误详情');
      }
    } else if (statusCode === 401) {
      console.log('\n❌ 登录请求失败：未授权（401）');
      console.log('用户名或密码错误，或者认证令牌无效。');
    } else if (statusCode === 404) {
      console.log('\n❌ 登录请求失败：未找到资源（404）');
      console.log('API端点路径可能不正确。');
    } else if (statusCode >= 500) {
      console.log('\n❌ 登录请求失败：服务器错误（5xx）');
      console.log('服务器内部发生错误，请稍后再试。');
    } else {
      console.log('\n❌ 登录请求失败！');
    }
  }
  
  // 辅助函数：检查字符串是否为有效的JSON
  function isJsonString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // 开始发送请求
  sendRequest(apiConfig.baseUrl);
}

// 启动测试
testLoginApi();