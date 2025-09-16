# 邀请好友功能设计 (替代代理模块)

## 一、功能概述

### 设计目标
- 简化层级关系：去除复杂的代理体系
- 降低门槛：所有用户都可邀请好友获得佣金
- 提升活跃度：通过邀请机制扩大用户基数
- 优化体验：聚焦核心派单功能

### 佣金模式
```
直接邀请奖励：
- 邀请评论员注册：¥20/人
- 邀请派单员注册：¥50/人

持续佣金收益：
- 好友评论任务收益：3% 佣金
- 好友派单消费：2% 佣金
- 仅限一级好友，无多级分销
```

## 二、H5移动端界面设计

### 邀请页面布局
```html
<div className="min-h-screen bg-gray-50">
  <!-- 顶部邀请卡片 -->
  <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-6 rounded-b-3xl">
    <div className="text-center">
      <h1 className="text-xl font-bold mb-2">邀请好友赚佣金</h1>
      <p className="text-sm opacity-90">好友每次收益，你都有提成</p>
      
      <!-- 收益统计 -->
      <div className="flex justify-center mt-4 space-x-8">
        <div className="text-center">
          <div className="text-2xl font-bold">¥{totalEarnings}</div>
          <div className="text-xs opacity-80">累计佣金</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{friendsCount}</div>
          <div className="text-xs opacity-80">邀请好友</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 快速分享区域 -->
  <div className="p-4 -mt-6">
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-medium mb-3">快速邀请</h3>
      
      <!-- 邀请码 -->
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">我的邀请码</div>
            <div className="font-mono text-lg font-bold text-primary">{inviteCode}</div>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
            复制
          </button>
        </div>
      </div>
      
      <!-- 分享按钮组 -->
      <div className="grid grid-cols-3 gap-3">
        <button className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
          <span className="text-2xl mb-1">💬</span>
          <span className="text-xs">微信好友</span>
        </button>
        <button className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-2xl mb-1">👥</span>
          <span className="text-xs">朋友圈</span>
        </button>
        <button className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-2xl mb-1">🔗</span>
          <span className="text-xs">复制链接</span>
        </button>
      </div>
    </div>
  </div>
  
  <!-- 佣金规则说明 -->
  <div className="p-4">
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-medium mb-3">佣金规则</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">1</span>
          <span>好友注册送 <span className="text-primary font-bold">¥20-50</span> 奖励</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</span>
          <span>好友每笔收益，你得 <span className="text-primary font-bold">2-3%</span> 提成</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">3</span>
          <span>佣金每日结算，满 <span className="text-primary font-bold">¥10</span> 可提现</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 我的好友页面
```html
<div className="bg-white">
  <!-- 好友列表头部 -->
  <div className="p-4 border-b border-gray-100">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">我的好友</h2>
      <span className="text-sm text-gray-500">共{friendsCount}人</span>
    </div>
    
    <!-- 筛选标签 -->
    <div className="flex space-x-2 mt-3">
      <button className="px-3 py-1 bg-primary text-white rounded-full text-xs">全部</button>
      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">评论员</button>
      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">派单员</button>
    </div>
  </div>
  
  <!-- 好友列表 -->
  <div className="divide-y divide-gray-100">
    {friends.map(friend => (
      <div key={friend.id} className="p-4 flex items-center space-x-3">
        <img src={friend.avatar} className="w-10 h-10 rounded-full" />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{friend.name}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              friend.role === 'commenter' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {friend.role === 'commenter' ? '评论员' : '派单员'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {friend.joinDate} 加入 · 为你赚取 ¥{friend.totalEarnings}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-primary">¥{friend.todayEarnings}</div>
          <div className="text-xs text-gray-500">今日佣金</div>
        </div>
      </div>
    ))}
  </div>
</div>
```

## 三、技术实现要点

### 邀请链接生成
```typescript
interface InviteLink {
  code: string;          // 邀请码
  url: string;           // 完整邀请链接
  qrCode: string;        // 二维码图片URL
  expireTime?: Date;     // 过期时间(可选)
}

const generateInviteLink = (userId: string): InviteLink => {
  const code = generateInviteCode(userId);
  const url = `${APP_DOMAIN}/register?invite=${code}`;
  const qrCode = generateQRCode(url);
  
  return { code, url, qrCode };
};
```

### 佣金计算逻辑
```typescript
interface CommissionConfig {
  inviteBonus: {
    commenter: number;    // 邀请评论员奖励
    publisher: number;    // 邀请派单员奖励
  };
  ongoingRate: {
    commenterTask: number;   // 评论员任务佣金比例
    publisherSpend: number;  // 派单员消费佣金比例
  };
}

const calculateCommission = (
  type: 'invite' | 'ongoing',
  amount: number,
  friendRole: 'commenter' | 'publisher'
) => {
  const config = getCommissionConfig();
  
  if (type === 'invite') {
    return config.inviteBonus[friendRole];
  } else {
    const rate = friendRole === 'commenter' 
      ? config.ongoingRate.commenterTask 
      : config.ongoingRate.publisherSpend;
    return amount * rate;
  }
};
```

### 邀请统计数据
```typescript
interface InviteStats {
  totalFriends: number;      // 总邀请人数
  activeFriends: number;     // 活跃好友数
  totalCommission: number;   // 累计佣金
  todayCommission: number;   // 今日佣金
  monthlyCommission: number; // 本月佣金
  pendingCommission: number; // 待结算佣金
}

const getInviteStats = async (userId: string): Promise<InviteStats> => {
  // 从数据库查询邀请统计数据
  return await db.query(`
    SELECT 
      COUNT(*) as totalFriends,
      COUNT(CASE WHEN last_active_date >= CURDATE() THEN 1 END) as activeFriends,
      SUM(commission_amount) as totalCommission,
      SUM(CASE WHEN commission_date = CURDATE() THEN commission_amount ELSE 0 END) as todayCommission
    FROM user_invites 
    WHERE inviter_id = ?
  `, [userId]);
};
```

## 四、集成到现有系统

### 在底部导航中添加邀请入口
```tsx
// 将原来的4个导航项扩展为5个，或者在"我的"页面中添加邀请功能
const BottomNavigation = () => {
  const navItems = [
    { icon: '🏠', label: '大厅', path: '/hall' },
    { icon: '📝', label: '任务', path: '/tasks' },
    { icon: '👥', label: '邀请', path: '/invite' },  // 新增
    { icon: '💰', label: '收益', path: '/earnings' },
    { icon: '👤', label: '我的', path: '/profile' }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      {/* 导航项渲染 */}
    </nav>
  );
};
```

### 在收益页面中显示邀请佣金
```tsx
const EarningsPage = () => {
  return (
    <div>
      {/* 总收益统计 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-500">任务收益</div>
          <div className="text-xl font-bold text-primary">¥{taskEarnings}</div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-500">邀请佣金</div>
          <div className="text-xl font-bold text-green-600">¥{inviteCommission}</div>
        </div>
      </div>
      
      {/* 邀请佣金明细 */}
      <div className="mt-4 bg-white rounded-lg">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium">邀请佣金明细</h3>
        </div>
        {/* 佣金记录列表 */}
      </div>
    </div>
  );
};
```

## 五、数据库设计

### 邀请关系表
```sql
CREATE TABLE user_invites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inviter_id INT NOT NULL,           -- 邀请人ID
  invitee_id INT NOT NULL,           -- 被邀请人ID
  invite_code VARCHAR(20) NOT NULL,  -- 邀请码
  commission_rate DECIMAL(5,4),      -- 佣金比例
  total_commission DECIMAL(10,2) DEFAULT 0, -- 累计佣金
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inviter (inviter_id),
  INDEX idx_invitee (invitee_id),
  INDEX idx_code (invite_code)
);
```

### 佣金记录表
```sql
CREATE TABLE commission_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inviter_id INT NOT NULL,           -- 邀请人ID
  invitee_id INT NOT NULL,           -- 被邀请人ID
  source_type ENUM('invite_bonus', 'task_commission', 'spend_commission'), -- 佣金来源
  source_amount DECIMAL(10,2),       -- 原始金额
  commission_rate DECIMAL(5,4),      -- 佣金比例
  commission_amount DECIMAL(10,2),   -- 佣金金额
  status ENUM('pending', 'settled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP NULL,
  INDEX idx_inviter_date (inviter_id, created_at)
);
```

这样的设计既简化了原有的代理体系，又保留了用户扩展的激励机制，更适合H5移动端的使用场景。