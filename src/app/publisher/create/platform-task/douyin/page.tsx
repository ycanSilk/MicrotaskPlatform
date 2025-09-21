'use client';

import { Card, Button, Input, Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';

// 系统预设任务类型
const TASK_TYPES = [
  {
    id: 'comment_top',
    title: '上评任务',
    icon: '⭐',
    price: 3.0,
    description: '发布高质量评论，真人展示',
    requirements: '评论内容真实有效，真人评论，包含表情符号',
    estimatedTime: '5分钟',
    difficulty: '中等'
  },
  {
    id: 'comment_middle',
    title: '中评任务',
    icon: '💬',
    price: 2.0,
    description: '发布高质量评论，真人展示',
    requirements: '评论内容真实有效，真人评论，包含表情符号',
    estimatedTime: '3分钟',
    difficulty: '简单'
  },
  {
    id: 'account_rental',
    title: '真人账号租赁',
    icon: '🔑',
    price: 60.0,
    description: '提供真实用户账号租赁服务，支持自定义租赁时间',
    requirements: '账号真实有效，无违规记录，按约定时间使用，手机扫码登录，租号有风险，不得使用账号进行任何形式的违规活动',
    estimatedTime: '自定义',
    difficulty: '简单'
  },
  {
    id: 'video_push_basic',
    title: '定制视频发送-纯推送模式',
    icon: '📹',
    price: 50.0,
    description: '按要求制作并发送视频内容，纯推送模式',
    requirements: '视频内容符合要求，按时发送，保证质量',
    estimatedTime: '12小时',
    difficulty: '中等'
  },
  {
    id: 'video_push_custom',
    title: '定制视频发送-定制推送模式',
    icon: '🎬',
    price: 200.0,
    description: '按要求制作并发送视频内容，定制推送模式',
    requirements: '视频内容高度定制，专业制作，精准推送',
    estimatedTime: '24小时',
    difficulty: '困难'
  }
];

// 任务卡片组件
const TaskCard = ({ task, onClick }: { task: any, onClick: () => void }) => {
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

  const handleBackToPlatforms = () => {
    router.push('/publisher/create');
  };

  const handleTaskClick = (task: any) => {
    const params = new URLSearchParams({
      taskId: task.id,
      title: task.title,
      icon: task.icon,
      price: task.price.toString(),
      description: task.description
    });
    
    // 根据任务类型导航到不同的页面
    if (task.id === 'account_rental') {
      router.push(`/publisher/create/account-rental?${params.toString()}`);
    } else if (task.id.includes('video_push')) {
      router.push(`/publisher/create/video-send?${params.toString()}`);
    } else {
      // 对于原有的评论任务，继续导航到publish页面
      router.push(`/publisher/create/publish?${params.toString()}`);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-8 -mx-4 -mt-4">
        <div className="flex items-center space-x-4 mb-2 px-4">
            <button 
            onClick={handleBackToPlatforms}
            className="bg-white hover:bg-white hover:scale-105 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm flex items-center gap-2"
            aria-label="返回"
          >
            <span className='text-blue-500'>← 返回选择任务</span>
          </button> 
        </div>
        <h1 className="text-2xl font-bold ml- px-4">发布抖音任务</h1>
        <p className="text-blue-100 px-4 mt-3">选择抖音任务类型</p>
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
                请根据您的需求选择合适的任务类型。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}