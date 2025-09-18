'use client';

import { Card, Button, Input, Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';

// 系统预设任务类型 - 只保留评论任务的两个选项
const TASK_TYPES = [
  {
    id: 'comment_top',
    title: '上评任务',
    icon: '⭐',
    price: 3.0,
    description: '发布高质量评论，置顶展示',
    requirements: '评论内容需要真实有效，不少于15字，包含表情符号',
    estimatedTime: '5分钟',
    difficulty: '中等'
  },
  {
    id: 'comment_middle',
    title: '中评任务',
    icon: '💬',
    price: 2.0,
    description: '发布普通评论',
    requirements: '评论内容需要真实有效，不少于10字',
    estimatedTime: '3分钟',
    difficulty: '简单'
  }
];

// 任务卡片组件
const TaskCard = ({ task, onClick }: { task: any, onClick: () => void }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return 'bg-green-100 text-green-800';
      case '中等': return 'bg-yellow-100 text-yellow-800';
      case '困难': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer active:scale-95"
    >
      {/* 任务头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
            {task.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </span>
              <span className="text-gray-500 text-sm">约{task.estimatedTime}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-500">¥{task.price}</div>
          <div className="text-gray-500 text-sm">单价</div>
        </div>
      </div>

      {/* 任务描述 */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">{task.description}</p>
        <p className="text-gray-500 text-sm">{task.requirements}</p>
      </div>

      {/* 发布按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <span>💡</span>
          <span>系统定价，公平公正</span>
        </div>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          立即发布
        </div>
      </div>
    </div>
  );
};

export default function CreateTask() {
  const router = useRouter();

  const handleTaskClick = (task: any) => {
    const params = new URLSearchParams({
      taskId: task.id,
      title: task.title,
      icon: task.icon,
      price: task.price.toString(),
      description: task.description
    });
    router.push(`/publisher/create/publish?${params.toString()}`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-8 -mx-4 -mt-4">
        <h1 className="text-2xl font-bold mb-2">发布评论任务</h1>
        <p className="text-blue-100">选择评论任务类型</p>
      </div>

      {/* 任务卡片列表 */}
      <div className="px-4 space-y-4">
        {TASK_TYPES.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => handleTaskClick(task)}
          />
        ))}
      </div>

      {/* 提示信息 */}
      <div className="px-4">
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">任务说明</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                上评任务单价为¥3.0，中评任务单价为¥2.0。请根据您的需求选择合适的任务类型。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}