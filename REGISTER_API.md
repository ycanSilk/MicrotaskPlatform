# 注册API使用说明

## 概述
本系统提供了两个角色专用的注册API，用于处理评论员和发布者的用户注册请求。注册成功后，用户数据会直接写入对应的JSON数据文件中。

## API端点

### 1. 评论员注册
- **URL**: `/api/register/commenter`
- **方法**: POST
- **请求体**:
  ```json
  {
    "username": "用户名（6-20位）",
    "password": "密码（至少6位）",
    "phone": "手机号（11位）",
    "inviteCode": "邀请码（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "注册成功消息",
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "role": "commenter"
    }
  }
  ```

### 2. 发布者注册
- **URL**: `/api/register/publisher`
- **方法**: POST
- **请求体**:
  ```json
  {
    "username": "用户名（6-20位）",
    "password": "密码（至少6位）",
    "phone": "手机号（11位）",
    "inviteCode": "邀请码（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "注册成功消息",
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "role": "publisher"
    }
  }
  ```

## 功能特性

1. **数据验证**：
   - 用户名长度验证（6-20位）
   - 密码强度验证（至少6位）
   - 手机号格式验证（11位中国手机号）
   - 必填字段检查

2. **重复检查**：
   - 用户名重复检查
   - 手机号重复检查

3. **数据存储**：
   - 评论员数据存储到 `src/data/commenteruser/commenteruser.json`
   - 发布者数据存储到 `src/data/publisheruser/publisheruser.json`
   - 自动生成唯一用户ID
   - 添加创建和更新时间戳

4. **错误处理**：
   - 详细的错误信息提示
   - 适当的HTTP状态码返回

## 使用示例

### 注册评论员
```bash
curl -X POST http://localhost:3000/api/register/commenter \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newcommenter",
    "password": "password123",
    "phone": "13812345678"
  }'
```

### 注册发布者
```bash
curl -X POST http://localhost:3000/api/register/publisher \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newpublisher",
    "password": "password123",
    "phone": "13912345678"
  }'
```

## 注意事项

1. 注册成功后，用户数据会直接写入对应的JSON文件中
2. 密码以明文形式存储（仅用于演示，生产环境应加密存储）
3. 用户ID自动生成，确保唯一性
4. 注册页面已更新为使用这些API端点