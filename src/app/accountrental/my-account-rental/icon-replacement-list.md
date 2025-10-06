# Ant Design 图标替换清单

## 概述
本文件列出了`balance/page.tsx`和`bills/page.tsx`页面中使用的所有Ant Design图标，以及在@ant-design/icons图标库内部的替换建议。

## balance/page.tsx 图标列表

| 图标名称 | 使用位置 | 替换建议 |
|---------|---------|---------|
| WalletOutlined | 交易类型图标、余额卡片 | AccountBookOutlined 或 WalletFilled |
| CreditCardOutlined | 交易类型图标、充值按钮 | CreditCardOutlined 或 CreditCardFilled |
| ArrowUpOutlined | 交易类型图标（收入） | ArrowUpOutlined 或 TrendingUpOutlined |
| ArrowDownOutlined | 交易类型图标（支出）、提现按钮 | ArrowDownOutlined 或 TrendingDownOutlined |
| SafetyOutlined | 安全提示区域 | ShieldOutlined 或 LockOutlined |
| BellOutlined | 顶部导航栏通知 | BellOutlined 或 BellFilled |
| InfoCircleOutlined | 交易类型图标、信息提示 | InfoCircleOutlined 或 InfoCircleFilled |
| DownOutlined | 下拉菜单 | DownOutlined 或 CaretDownOutlined |
| CalendarOutlined | 日期选择、时间周期筛选 | CalendarOutlined 或 CalendarFilled |
| ClockCircleOutlined | 时间相关显示 | ClockCircleOutlined 或 HourglassOutlined |
| SearchOutlined | 搜索框 | SearchOutlined 或 SearchFilled |
| FilterOutlined | 筛选按钮 | FilterOutlined 或 FilterFilled |
| MoreOutlined | 更多操作按钮 | MoreOutlined 或 MoreFilled |
| UndoOutlined | 交易类型图标（退款） | RollbackOutlined 或 SwapOutlined |

## bills/page.tsx 图标列表

| 图标名称 | 使用位置 | 替换建议 |
|---------|---------|---------|
| FileTextOutlined | 页面标题图标 | FileOutlined 或 FileTextFilled |
| CalendarOutlined | 日期显示区域 | CalendarOutlined 或 CalendarFilled |
| SearchOutlined | 搜索区域 | SearchOutlined 或 SearchFilled |
| FilterOutlined | 筛选按钮、顶部导航栏 | FilterOutlined 或 FilterFilled |
| DownOutlined | 排序下拉菜单 | DownOutlined 或 CaretDownOutlined |
| CreditCardOutlined | 账单类型图标 | CreditCardOutlined 或 CreditCardFilled |
| WalletOutlined | 账单类型图标 | AccountBookOutlined 或 WalletFilled |
| MoreOutlined | 顶部导航栏更多操作 | MoreOutlined 或 MoreFilled |
| CheckCircleOutlined | 账单状态图标（已支付） | CheckCircleOutlined 或 CheckCircleFilled |
| ExclamationCircleOutlined | 待支付提示区域、账单状态图标 | ExclamationCircleOutlined 或 ExclamationCircleFilled |
| InfoCircleOutlined | 账单类型图标 | InfoCircleOutlined 或 InfoCircleFilled |
| RightOutlined | 操作按钮区域 | RightOutlined 或 ArrowRightOutlined |
| DownloadOutlined | 操作按钮区域（下载） | DownloadOutlined 或 DownloadFilled |
| ShareAltOutlined | 操作按钮区域（分享） | ShareAltOutlined 或 ShareAltFilled |

## 替换建议
1. 对于功能相同的图标，可以考虑使用填充版(filled)图标来增强视觉效果
2. 对于有更合适语义的图标，可以替换为更符合当前场景的Ant Design图标
3. 替换时注意保持图标的一致性和用户体验
4. 替换后需要测试确保所有功能正常