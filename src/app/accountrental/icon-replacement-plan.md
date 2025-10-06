# 图标替换计划

## 概述
本计划旨在将MicrotaskPlatform项目中accountrental目录下所有页面使用的非@ant-design/icons图标替换为@ant-design/icons库中的图标。

## 需要替换的文件列表
- `src/app/accountrental/account-rental-market/page.tsx`
- `src/app/accountrental/account-rental-publish/platformtype/page.tsx`
- `src/app/accountrental/account-rental-publish/page.tsx`
- `src/app/accountrental/components/Header.tsx`
- `src/app/accountrental/components/AccountCard.tsx`
- `src/app/accountrental/my-account-rental/balance/page.tsx` (部分已使用@ant-design/icons，但可能需要更新)
- `src/app/accountrental/my-account-rental/bills/page.tsx` (部分已使用@ant-design/icons，但可能需要更新)
- `src/app/accountrental/my-account-rental/published/page.tsx`
- `src/app/accountrental/my-account-rental/rented/page.tsx`
- `src/app/accountrental/my-account-rental/page.tsx`

## 图标替换映射

### 平台图标替换
| 平台 | 原emoji图标 | 替换为@ant-design/icons |
|------|------------|------------------------|
| 抖音 | 🎵 | AudioOutlined |
| 小红书 | 📕 | BookOutlined |
| 快手 | 🔧 | ToolOutlined |

### 其他emoji图标替换
| 原emoji图标 | 替换为@ant-design/icons | 使用位置 |
|------------|------------------------|---------|
| 💡 | BulbOutlined | account-rental-publish/page.tsx |
| 👤 | UserOutlined | my-account-rental/page.tsx |
| → | RightOutlined | account-rental-publish/page.tsx |

### 自定义SVG图标替换
| 图标描述 | 替换为@ant-design/icons | 使用位置 |
|---------|------------------------|---------|
| 清除搜索按钮 (X) | CloseOutlined | components/Header.tsx |
| 管理后台按钮 (圆圈加实心点) | SettingOutlined | components/Header.tsx |

## 实施步骤
1. 创建一个通用的平台图标映射函数
2. 逐一更新每个文件，替换非@ant-design/icons的图标
3. 确保所有图标导入都从@ant-design/icons库中获取
4. 测试确保所有替换后的图标显示正确