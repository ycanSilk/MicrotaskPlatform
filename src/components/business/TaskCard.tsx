'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { TaskCardProps } from '@/types';

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onGrab,
  onView,
  showGrabButton = true,
  className
}) => {
  const difficultyColors = {
    1: 'text-green-600 bg-green-50',
    2: 'text-yellow-600 bg-yellow-50', 
    3: 'text-red-600 bg-red-50'
  };

  const difficultyLabels = {
    1: '简单',
    2: '中等',
    3: '困难'
  };

  const handleGrab = () => {
    if (onGrab) {
      onGrab(task.id);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(task.id);
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm',
      task.isHot && 'border-red-200 bg-red-50/30',
      className
    )}>
      {/* 任务标题和热门标记 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-1">
            {task.title}
          </h3>
          {task.isHot && (
            <span className="inline-block px-2 py-1 text-xs text-red-600 bg-red-100 rounded-full">
              🔥 热门
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-3">
          <span className={cn(
            'px-2 py-1 text-xs rounded-full',
            difficultyColors[task.difficulty]
          )}>
            {difficultyLabels[task.difficulty]}
          </span>
        </div>
      </div>

      {/* 任务描述 */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* 任务信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-lg font-bold text-primary">
              ¥{task.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              /条
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            剩余: <span className="text-gray-700 font-medium">{task.remaining}</span>
          </div>
        </div>

        {task.countdown && task.countdown > 0 && (
          <div className="text-xs text-red-500">
            倒计时: {Math.floor(task.countdown / 3600)}h{Math.floor((task.countdown % 3600) / 60)}m
          </div>
        )}
      </div>

      {/* 任务要求 */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {task.requirements.map((req, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded-full"
            >
              {req.type === 'comment' && '评论'}
              {req.type === 'like' && '点赞'}
              {req.type === 'follow' && '关注'}
              {req.type === 'share' && '分享'}
              {req.count && ` ${req.count}次`}
            </span>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {task.category} • {new Date(task.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
          >
            查看详情
          </Button>
          
          {showGrabButton && task.remaining > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGrab}
              disabled={task.status !== 'active'}
            >
              立即抢单
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};