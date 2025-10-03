import { BottomNavigation } from '../layout/BottomNavigation';
import { NavigationItem } from '@/types';

/**
 * 发布者底部导航栏组件
 * 封装了发布者页面的底部导航栏，包含订单、发布、统计、财务和我的五个导航项
 */
export const PublisherBottomNavigation: React.FC = () => {
  // 发布者导航项配置
  const publisherNavigationItems: NavigationItem[] = [
    {
      icon: '📋',
      label: '订单',
      path: '/publisher/dashboard'
    },
    {
      icon: '➕',
      label: '发布',
      path: '/publisher/create'
    },
    {
      icon: '📊',
      label: '账号租赁',
      path: '/publisher/account-rental'
    },
    {
      icon: '📊',
      label: '统计',
      path: '/publisher/stats'
    },
    {
      icon: '💰',
      label: '财务',
      path: '/publisher/finance'
    },
    {
      icon: '👤',
      label: '我的',
      path: '/publisher/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <BottomNavigation items={publisherNavigationItems} />
    </div>
  );
};