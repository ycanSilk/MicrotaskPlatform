const http = require('http');

// 测试函数：通过页面组件的修改后路径调用API
function testCompleteFlow() {
  try {
    console.log('开始测试完整流程...');
    
    // 1. 直接调用内部路由API
    console.log('正在调用内部路由API: /api-page/logintest/login');
    const startTime = Date.now();
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api-page/logintest/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    };
    
    const req = http.request(options, (res) => {
      const responseTime = Date.now() - startTime;
      console.log(`API调用完成，状态码: ${res.statusCode}，响应时间: ${responseTime}ms`);
      
      // 检查响应内容类型
      const contentType = res.headers['content-type'];
      console.log(`响应内容类型: ${contentType}`);
      
      let data = '';
      
      // 接收数据
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // 数据接收完毕
      res.on('end', () => {
        // 尝试解析JSON响应
        try {
          const jsonData = JSON.parse(data);
        console.log('响应数据解析成功');
        console.log('响应数据摘要:');
        console.log(`- 成功状态: ${jsonData.success}`);
        console.log(`- 响应时间: ${jsonData.responseTime}ms`);
        
        // 输出完整的JSON格式响应数据
        console.log('\n完整的JSON响应数据:');
        console.log(JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success && jsonData.data) {
          console.log(`\n- 服务器返回数据: 包含token和用户信息`);
          // 检查嵌套的数据结构
          const hasNestedData = jsonData.data.data !== undefined;
          const hasToken = hasNestedData && jsonData.data.data.token !== undefined;
          const hasUserInfo = hasNestedData && jsonData.data.data.userInfo !== undefined;
          
          console.log(`  - token存在: ${hasToken}`);
          console.log(`  - 用户信息存在: ${hasUserInfo}`);
          if (hasUserInfo && jsonData.data.data.userInfo.username) {
            console.log(`  - 用户名: ${jsonData.data.data.userInfo.username}`);
          }
        } else if (!jsonData.success) {
          console.log(`- 错误信息: ${jsonData.error || '未知错误'}`);
        }
        
        console.log('\n测试结果: 成功！完整流程已验证');
      } catch (jsonError) {
        console.error('响应JSON解析失败:', jsonError.message);
        console.log('原始响应文本:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
      }
    });
  });
  
  // 发送请求体
  req.write(JSON.stringify({
    username: 'test',
    password: '123456'
  }));
  req.end();
  
  // 处理请求错误
  req.on('error', (error) => {
    console.error('测试过程中发生错误:', error.message);
    console.log('\n测试结果: 失败！请检查服务器是否运行以及网络连接是否正常');
  });
  
} catch (error) {
  console.error('测试过程中发生错误:', error.message);
  console.log('\n测试结果: 失败！请检查服务器是否运行以及网络连接是否正常');
}
}

// 执行测试
console.log('注意：请确保Next.js开发服务器正在运行 (npm run dev)');
console.log('注意：请确保外部API服务器正在运行 (localhost:8888)');
console.log('3秒后开始测试...');

setTimeout(testCompleteFlow, 3000);