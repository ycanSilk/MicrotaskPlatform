# 评论员财务数据模型文档

## 概述
本文档详细描述了微任务平台中与评论员财务相关的四个核心JSON文件的结构、作用及字段功能，包括账户信息、收益记录、提现记录和财务模型定义。

## 1. commenter_finance_model.json

### 作用
`commenter_finance_model.json`是整个评论员财务系统的数据模型定义文件，它包含了评论员账户、收益记录、提现记录等所有财务相关数据的结构和示例数据。该文件作为系统财务数据的完整模板和参考。

### 主要字段结构

#### 1.1 accounts
存储所有评论员的账户信息，以用户ID为键。

```json
"accounts": {
  "com001": {
    "userId": "com001",
    "availableBalance": 150.00,
    "frozenBalance": 0.00,
    "totalEarnings": 200.00,
    "completedTasks": 10,
    "lastUpdated": "2023-10-01T08:00:00Z"
  }
}
```

#### 1.2 earnings
存储所有评论员的任务收益明细记录。

```json
"earnings": [
  {
    "id": "earning_001",
    "userId": "com001",
    "taskId": "task_001",
    "taskName": "评论任务示例",
    "amount": 2.00,
    "status": "completed",
    "earnedTime": "2023-10-01T09:00:00Z",
    "description": "评论任务完成奖励",
    "type": "comment"
  }
]
```

#### 1.3 withdrawals
存储所有评论员的提现记录。

```json
"withdrawals": [
  {
    "id": "withdrawal_001",
    "userId": "com001",
    "amount": 100.00,
    "fee": 1.00,
    "totalAmount": 101.00,
    "method": "wechat",
    "status": "completed",
    "requestTime": "2023-10-01T10:00:00Z",
    "completeTime": "2023-10-01T11:00:00Z",
    "description": "提现至微信钱包"
  }
]
```

#### 1.4 teamMembers
存储评论员的团队成员信息，用于团队佣金计算。

```json
"teamMembers": [
  {
    "userId": "com002",
    "inviterId": "com001",
    "joinTime": "2023-09-15T08:00:00Z",
    "status": "active"
  }
]
```

#### 1.5 commissions
存储佣金收益历史记录。

```json
"commissions": [
  {
    "id": "commission_001",
    "recipientId": "com001",
    "sourceId": "com002",
    "amount": 1.00,
    "type": "team",
    "commissionTime": "2023-10-01T12:00:00Z",
    "description": "团队成员任务佣金"
  }
]
```

#### 1.6 config
系统配置信息，包含提现规则等。

```json
"config": {
  "withdrawal": {
    "minAmount": 10,
    "maxAmount": 5000,
    "fee": 1.00,
    "amountUnit": 10,
    "allowedDays": [1, 3, 5]
  }
}
```

## 2. commenterAccount.json

### 作用
`commenterAccount.json`是评论员账户数据的专用存储文件，用于保存所有评论员的账户余额、任务完成情况等核心账户信息。该文件在系统运行时会被频繁读取和更新。

### 主要字段结构

```json
{
  "accounts": [
    {
      "userId": "com001",
      "availableBalance": 150.00,
      "frozenBalance": 0.00,
      "totalEarnings": 200.00,
      "completedTasks": 10,
      "lastUpdated": "2023-10-01T08:00:00Z"
    },
    {
      "userId": "com002",
      "availableBalance": 80.00,
      "frozenBalance": 0.00,
      "totalEarnings": 120.00,
      "completedTasks": 6,
      "lastUpdated": "2023-10-01T09:00:00Z"
    }
  ]
}
```

### 字段说明
- **userId**: 评论员用户唯一标识
- **availableBalance**: 可提现余额（元）
- **frozenBalance**: 冻结余额（元），通常是正在提现审核中的金额
- **totalEarnings**: 累计总收益（元）
- **completedTasks**: 已完成任务数量
- **lastUpdated**: 账户信息最后更新时间

## 3. earningsRecords.json

### 作用
`earningsRecords.json`用于存储所有评论员的任务收益明细记录，每条记录对应一个已完成任务的收益结算。该文件是用户收益数据的主要来源，前端收益页面会从这里获取数据进行展示。

### 主要字段结构

```json
{
  "earnings": [
    {
      "id": "earning_001",
      "userId": "com001",
      "taskId": "task_001",
      "taskName": "评论任务示例",
      "amount": 2.00,
      "status": "completed",
      "earnedTime": "2023-10-01T09:00:00Z",
      "description": "评论任务完成奖励",
      "type": "comment"
    },
    {
      "id": "earning_002",
      "userId": "com001",
      "taskId": "task_002",
      "taskName": "视频推荐任务",
      "amount": 3.00,
      "status": "completed",
      "earnedTime": "2023-10-01T10:00:00Z",
      "description": "视频推荐任务完成奖励",
      "type": "video"
    }
  ]
}
```

### 字段说明
- **id**: 收益记录唯一标识
- **userId**: 获得收益的评论员用户ID
- **taskId**: 产生收益的任务ID
- **taskName**: 任务名称
- **amount**: 收益金额（元）
- **status**: 收益状态（completed: 已到账, pending: 处理中）
- **earnedTime**: 收益产生时间
- **description**: 收益描述
- **type**: 任务类型（comment: 评论任务, video: 视频推荐, account_rental: 租号任务, task: 普通任务）

## 4. withdrawalRecords.json

### 作用
`withdrawalRecords.json`用于存储所有评论员的提现申请记录，记录了用户的每一笔提现请求及处理状态。该文件是提现流程管理的核心数据来源。

### 主要字段结构

```json
{
  "withdrawals": [
    {
      "id": "withdrawal_001",
      "userId": "com001",
      "amount": 100.00,
      "fee": 1.00,
      "totalAmount": 101.00,
      "method": "wechat",
      "status": "completed",
      "requestTime": "2023-10-01T10:00:00Z",
      "completeTime": "2023-10-01T11:00:00Z",
      "description": "提现至微信钱包"
    },
    {
      "id": "withdrawal_002",
      "userId": "com002",
      "amount": 50.00,
      "fee": 1.00,
      "totalAmount": 51.00,
      "method": "alipay",
      "status": "pending",
      "requestTime": "2023-10-01T14:00:00Z",
      "completeTime": null,
      "description": "提现至支付宝"
    }
  ]
}
```

### 字段说明
- **id**: 提现记录唯一标识
- **userId**: 发起提现的评论员用户ID
- **amount**: 提现金额（元）
- **fee**: 提现手续费（元）
- **totalAmount**: 提现总金额（提现金额+手续费，元）
- **method**: 提现方式（wechat: 微信钱包, alipay: 支付宝, bank: 银行卡）
- **status**: 提现状态（pending: 待审核, completed: 已完成, rejected: 已拒绝）
- **requestTime**: 提现申请时间
- **completeTime**: 提现完成时间（未完成时为null）
- **description**: 提现描述

## 数据流转关系

1. **任务发布与执行**：发布者创建任务 → 评论员领取任务 → 评论员提交任务
2. **任务审核与结算**：发布者审核任务 → 任务通过审核 → 系统自动创建收益记录 → 更新用户账户余额
3. **收益查询与展示**：用户访问收益页面 → 前端从earningsRecords.json和commenterAccount.json获取数据 → 展示收益概览和明细
4. **提现申请与处理**：用户提交提现申请 → 系统创建提现记录 → 冻结用户余额 → 管理员审核 → 提现完成/拒绝 → 更新用户余额

## 系统核心业务流程

### 1. 任务收益结算流程
1. 评论员完成任务并提交
2. 发布者审核任务并通过
3. 系统自动调用`createUserEarningRecord`方法
4. 创建新的收益记录并存入earningsRecords.json
5. 更新用户账户余额和完成任务数

### 2. 提现流程
1. 用户在收益页面发起提现申请
2. 系统验证提现金额和用户余额
3. 创建新的提现记录并存入withdrawalRecords.json
4. 冻结用户相应金额
5. 管理员审核提现申请
6. 审核通过：标记提现完成，扣除用户冻结金额
7. 审核拒绝：标记提现拒绝，返还用户冻结金额到可用余额

## 注意事项
1. 所有财务数据操作都应包含事务处理逻辑，确保数据一致性
2. 敏感操作应记录操作日志，便于追溯
3. 提现等关键操作应设置权限控制，防止未授权访问
4. 定期备份财务数据，确保数据安全