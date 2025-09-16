'use client';

import { useState, useCallback } from 'react';
import { Task, TaskFilters as ITaskFilters } from '@/types';
import { TaskCard } from '@/components/business/TaskCard';
import { Loading } from '@/components/ui';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useToast } from '@/components/ui/Toast';

// 模拟数据
const mockTasks: Task[] = [
  {
    id: '1',
    title: '🍔 美食探店推广',
    description: '需要在抖音视频下进行真实评论，分享用餐体验',
    videoUrl: 'https://douyin.com/video/123',
    price: 3.5,
    total: 20,
    remaining: 12,
    requirements: [
      { type: 'comment', count: 1 },
      { type: 'like', count: 1 },
      { type: 'follow', count: 1 }
    ],
    category: 'food',
    difficulty: 2,
    status: 'active',
    publisherId: 'pub1',
    deadline: '2024-01-25T23:59:59.000Z',
    isHot: true,
    countdown: 5,
    createdAt: '2024-01-20T10:00:00.000Z',
    updatedAt: '2024-01-20T10:00:00.000Z',
  },
  {
    id: '2',
    title: '💄 护肤心得分享',
    description: '分享使用护肤品的真实感受，要求内容真实自然',
    videoUrl: 'https://douyin.com/video/456',
    price: 2.8,
    total: 15,
    remaining: 8,
    requirements: [
      { type: 'comment', count: 1, template: '这款产品用起来真的不错，推荐给大家' }
    ],
    category: 'beauty',
    difficulty: 1,
    status: 'active',
    publisherId: 'pub2',
    deadline: '2024-01-24T23:59:59.000Z',
    createdAt: '2024-01-20T11:00:00.000Z',
    updatedAt: '2024-01-20T11:00:00.000Z',
  },
  {
    id: '3',
    title: '🏝️ 旅游攻略种草',
    description: '分享旅游景点体验，需要配图和详细评论',
    videoUrl: 'https://douyin.com/video/789',
    price: 4.2,
    total: 10,
    remaining: 0,
    requirements: [
      { type: 'comment', count: 1 },
      { type: 'like', count: 1 }
    ],
    category: 'travel',
    difficulty: 3,
    status: 'active',
    publisherId: 'pub3',
    deadline: '2024-01-26T23:59:59.000Z',
    createdAt: '2024-01-20T09:00:00.000Z',
    updatedAt: '2024-01-20T09:00:00.000Z',
  },
];

interface TaskListProps {
  filters: ITaskFilters;
}

export const TaskList = ({ filters }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { addToast } = useToast();

  // 加载更多任务
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      // 这里应该调用真实API
      // const newTasks = await fetchTasks(filters, page);
      // setTasks(prev => [...prev, ...newTasks]);
      setLoading(false);
      // setHasMore(newTasks.length > 0);
    }, 1000);
  }, [loading, hasMore, filters]);

  // 无限滚动
  const { containerRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
  });

  // 抢单处理
  const handleGrab = useCallback(async (taskId: string) => {
    try {
      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

      // 这里应该调用抢单API
      // await grabTask(taskId);
      
      // 更新任务状态
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, remaining: Math.max(0, task.remaining - 1) }
          : task
      ));

      addToast({
        type: 'success',
        message: '抢单成功！请及时完成任务',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: '抢单失败，请重试',
      });
    }
  }, [addToast]);

  // 查看详情
  const handleView = useCallback((taskId: string) => {
    // 跳转到任务详情页
    // router.push(`/commenter/tasks/${taskId}`);
    console.log('查看任务详情:', taskId);
  }, []);

  // 过滤和排序任务
  const filteredTasks = tasks.filter(task => {
    if (filters.category && task.category !== filters.category) return false;
    if (filters.difficulty && task.difficulty !== filters.difficulty) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (task.price < min || task.price > max) return false;
    }
    if (filters.status && task.status !== filters.status) return false;
    return true;
  }).sort((a, b) => {
    if (!filters.sortBy) return 0;
    
    let aValue: any = a[filters.sortBy as keyof Task];
    let bValue: any = b[filters.sortBy as keyof Task];
    
    if (filters.sortBy === 'createTime') {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    }
    
    if (filters.sortOrder === 'desc') {
      return bValue - aValue;
    } else {
      return aValue - bValue;
    }
  });

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto scroll-smooth px-4 py-4"
    >
      {/* 推荐任务标题 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">🔥 推荐任务</h2>
        <span className="text-sm text-gray-500">{filteredTasks.length}个任务</span>
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onGrab={handleGrab}
            onView={handleView}
            showGrabButton={true}
          />
        ))}
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="py-8">
          <Loading text="加载更多任务..." />
        </div>
      )}
      
      {/* 没有更多数据 */}
      {!hasMore && filteredTasks.length > 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">
          没有更多任务了
        </div>
      )}
      
      {/* 空状态 */}
      {filteredTasks.length === 0 && !loading && (
        <div className="py-20 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <div className="text-gray-500 mb-2">暂无符合条件的任务</div>
          <div className="text-sm text-gray-400">试试调整筛选条件</div>
        </div>
      )}
    </div>
  );
};