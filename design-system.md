# 抖音评论派单系统 - H5移动端UI设计系统

## 一、设计理念

### H5移动端优先原则
- 基准屏幕：375px (iPhone SE/12 mini)
- rem单位系统：1rem = 16px (基准)
- 触摸友好：最小点击区域 44px (2.75rem)
- 单手操作：重要功能在下半屏

## 二、色彩体系

### 主色调 - 浅蓝色系
```css
:root {
  --primary: #4A90E2;           /* 主色 */
  --primary-light: #E8F4FD;     /* 浅蓝背景 */
  --primary-dark: #2E5C8A;      /* 深蓝强调 */
  --secondary: #F1F5F9;         /* 次要背景 */
  --accent: #3B82F6;            /* 强调蓝 */
}
```

### 功能色系
```css
:root {
  --success: #10B981;           /* 成功绿 */
  --warning: #F59E0B;           /* 警告橙 */
  --error: #EF4444;             /* 错误红 */
  --info: #3B82F6;              /* 信息蓝 */
}
```

### 中性色系
```css
:root {
  --gray-900: #111827;          /* 主要文字 */
  --gray-700: #374151;          /* 次要文字 */
  --gray-500: #6B7280;          /* 辅助文字 */
  --gray-300: #D1D5DB;          /* 边框 */
  --gray-100: #F3F4F6;          /* 浅色背景 */
  --gray-50: #F9FAFB;           /* 页面背景 */
  --white: #FFFFFF;             /* 纯白 */
}
```

### 角色标识色 (简化为三个角色)
```css
:root {
  --role-admin: #8B5CF6;        /* 管理员-紫色 */
  --role-publisher: #4A90E2;    /* 派单员-主蓝 */
  --role-commenter: #10B981;    /* 评论员-绿色 */
}
```

## 三、字体系统

### H5字体族
```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 
               'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 
               Consolas, 'Courier New', monospace;
}
```

### rem字号体系 (基准16px)
```css
:root {
  /* 标题字号 */
  --text-3xl: 1.875rem;         /* 30px - 主标题 */
  --text-2xl: 1.5rem;           /* 24px - 次标题 */
  --text-xl: 1.25rem;           /* 20px - 小标题 */
  --text-lg: 1.125rem;          /* 18px - 大正文 */
  
  /* 正文字号 */
  --text-base: 1rem;            /* 16px - 基础正文 */
  --text-sm: 0.875rem;          /* 14px - 小正文 */
  --text-xs: 0.75rem;           /* 12px - 辅助文字 */
  --text-2xs: 0.625rem;         /* 10px - 最小文字 */
  
  /* 行高 */
  --leading-tight: 1.25;        /* 紧凑行高 */
  --leading-normal: 1.5;        /* 正常行高 */
  --leading-relaxed: 1.75;      /* 宽松行高 */
}
```

### 移动端字号适配
```css
/* 确保在小屏幕上文字清晰可读 */
@media (max-width: 360px) {
  :root {
    --text-base: 1.0625rem;      /* 17px */
    --text-sm: 0.9375rem;        /* 15px */
  }
}
```

## 四、间距系统 (rem单位)

### 基础间距
```css
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;         /* 4px */
  --spacing-2: 0.5rem;          /* 8px */
  --spacing-3: 0.75rem;         /* 12px */
  --spacing-4: 1rem;            /* 16px */
  --spacing-5: 1.25rem;         /* 20px */
  --spacing-6: 1.5rem;          /* 24px */
  --spacing-8: 2rem;            /* 32px */
  --spacing-10: 2.5rem;         /* 40px */
  --spacing-12: 3rem;           /* 48px */
  --spacing-16: 4rem;           /* 64px */
}
```

### H5组件间距
```css
:root {
  /* 容器间距 */
  --container-padding: var(--spacing-4);    /* 16px */
  --section-gap: var(--spacing-6);          /* 24px */
  
  /* 卡片间距 */
  --card-padding: var(--spacing-4);         /* 16px */
  --card-gap: var(--spacing-3);             /* 12px */
  
  /* 按钮间距 */
  --btn-padding-sm: var(--spacing-2) var(--spacing-4);    /* 8px 16px */
  --btn-padding-md: var(--spacing-3) var(--spacing-6);    /* 12px 24px */
  --btn-padding-lg: var(--spacing-4) var(--spacing-8);    /* 16px 32px */
  
  /* 表单间距 */
  --form-gap: var(--spacing-4);             /* 16px */
  --input-padding: var(--spacing-3);        /* 12px */
}
```

## 五、圆角系统

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;          /* 4px - 小元素 */
  --radius-md: 0.5rem;           /* 8px - 按钮、输入框 */
  --radius-lg: 0.75rem;          /* 12px - 卡片 */
  --radius-xl: 1rem;             /* 16px - 大卡片 */
  --radius-2xl: 1.5rem;          /* 24px - 弹窗 */
  --radius-full: 9999px;         /* 完全圆角 */
}
```

## 六、阴影系统

```css
:root {
  /* H5阴影 - 较轻，避免性能问题 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* 彩色阴影 */
  --shadow-primary: 0 4px 14px 0 rgba(74, 144, 226, 0.15);
  --shadow-success: 0 4px 14px 0 rgba(16, 185, 129, 0.15);
  --shadow-error: 0 4px 14px 0 rgba(239, 68, 68, 0.15);
  
  /* 内阴影 */
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
```

## 七、H5组件规范

### 按钮组件
```css
/* 按钮基础样式 */
.btn {
  min-height: 2.75rem;           /* 44px 触摸友好 */
  padding: var(--btn-padding-md);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

/* 按钮变体 */
.btn-primary {
  background: var(--primary);
  color: var(--white);
  box-shadow: var(--shadow-primary);
}

.btn-secondary {
  background: var(--white);
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-ghost {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}
```

### 卡片组件
```css
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--card-padding);
  border: 1px solid var(--gray-100);
}

.card-elevated {
  box-shadow: var(--shadow-md);
}
```

### 状态标识
```css
.status-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 500;
}

.status-active {
  background: var(--primary);
  color: var(--white);
}

.status-success {
  background: var(--success);
  color: var(--white);
}

.status-warning {
  background: var(--warning);
  color: var(--white);
}

.status-error {
  background: var(--error);
  color: var(--white);
}
```

## 八、H5适配规范

### 视口设置
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### rem基准设置
```javascript
// 动态设置rem基准
function setRem() {
  const baseSize = 16; // 基准像素
  const scale = document.documentElement.clientWidth / 375; // 基于iPhone设计稿
  document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px';
}

window.addEventListener('resize', setRem);
setRem();
```

### 安全区域适配
```css
/* 适配刘海屏和底部安全区域 */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```