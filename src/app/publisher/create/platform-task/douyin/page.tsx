'use client';

import { Card, Button, Input, Badge, AlertModal } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 系统预设任务类型
const TASK_TYPES = [
  {
    id: 'comment_top',
    title: '上评任务',
    icon: '⭐',
    price: 3.0,
    description: '真人账号发布高质量评论',
    requirements: '评论内容真实有效，真人评论，包含表情符号',
    estimatedTime: '5分钟',
    difficulty: '中等'
  },
  {
    id: 'comment_middle',
    title: '中评任务',
    icon: '💬',
    price: 2.0,
    description: '真人账号发布高质量评论',
    requirements: '评论内容真实有效，真人评论，包含表情符号',
    estimatedTime: '3分钟',
    difficulty: '简单'
  },
  {
    id: 'task_combination_top_middle',
    title: '上中评任务',
    icon: '🌟',
    price: 8.0,
    description: '组合任务 - 1条上评 + 中评（数量可自定义选择，且支持@功能）',
    requirements: '评论内容真实有效，真人评论，上评完成后需提交链接作为结算条件',
    estimatedTime: '10分钟',
    difficulty: '中等'
  },
  {
    id: 'task_combination_middle_bottom',
    title: '中下评任务',
    icon: '🌓',
    price: 7.0,
    description: '组合任务 - 1条中评 + 2条下评（其中1条带@功能）',
    requirements: '评论内容真实有效，真人评论，按照顺序完成任务',
    estimatedTime: '8分钟',
    difficulty: '中等'
  },
  {
    id: 'task_combination_all',
    title: '全包任务',
    icon: '🎯',
    price: '自定义',
    description: '一站式任务服务，包含上、中、下评组合方案',
    requirements: '根据具体方案提供全方位的评论服务',
    estimatedTime: '自定义',
    difficulty: '中等'
  },
  {
    id: 'account_rental',
    title: '真人账号租赁',
    icon: '🔑',
    price: '60',
    description: '提供真实用户账号租赁服务，支持自定义租赁时间',
    requirements: '账号真实有效，无违规记录，按约定时间使用，手机扫码登录，租号有风险，不得使用账号进行任何形式的违规活动',
    estimatedTime: '自定义',
    difficulty: '简单',
    roleType: '出租'
  },
  {
    id: 'video_publish',
    title: '视频发布',
    icon: '🎬',
    price: '自定义',
    description: '按要求制作并发布视频内容',
    requirements: '视频内容符合要求，按时发布，保证质量',
    estimatedTime: '自定义',
    difficulty: '中等'
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
          <div className="text-2xl font-bold text-orange-500">
            {task.price === '自定义' ? '自定义' : `¥${task.price}`}
          </div>
          <div className="text-gray-500 text-sm">
            {task.price === '自定义' ? '支持任意金额' : '单价'}
          </div>
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
          <span>
            {task.id === 'video_publish' || task.id === 'account_rental' || task.id === 'account_request' ? 
              '费用由双方自行设定，平台抽取20%服务费' : 
              '系统定价，公平公正'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {task.roleType && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              {task.roleType}
            </Badge>
          )}
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            立即发布
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CreateTask() {
  const router = useRouter();
  
  // 提示框状态
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: ''
  });
  
  // 显示暂未开发提示
  const showNotDevelopedAlert = () => {
    setAlertConfig({
      title: '暂未开发',
      message: '该功能暂未开发',
      icon: '🔧'
    });
    setShowAlertModal(true);
  };

  const handleBackToPlatforms = () => {
    router.push('/publisher/create');
  };

  const handleTaskClick = (task: any) => {
    // 处理任务选择
    if (task.id === 'video_publish') {
      // 视频发布任务 - 显示暂未开发提示
      showNotDevelopedAlert();
    } else if (task.id === 'account_rental') {
      // 真人账号租赁任务 - 显示暂未开发提示
      showNotDevelopedAlert();
    } else if (task.id === 'account_request') {
      // 账号求租任务 - 跳转到账号租赁页面
      router.push('/publisher/create/video-task');
    } else if (task.id === 'comment_top') {
      // 上评任务 - 跳转到上评任务发布页面
      const params = new URLSearchParams({
        taskId: task.id,
        title: task.title,
        icon: task.icon,
        price: task.price.toString(),
        description: task.description
      });
      router.push(`/publisher/create/publish-top-comment?${params.toString()}`);
    } else if (task.id === 'task_combination_top_middle') {
      // 上中评任务 - 跳转到上中评任务发布页面
      const params = new URLSearchParams({
        taskId: task.id,
        title: task.title,
        icon: task.icon,
        price: task.price.toString(),
        description: task.description
      });
      router.push(`/publisher/create/task-combination-top-middle?${params.toString()}`);
    } else if (task.id === 'task_combination_middle_bottom') {
      // 中下评任务 - 跳转到中下评任务发布页面
      const params = new URLSearchParams({
        taskId: task.id,
        title: task.title,
        icon: task.icon,
        price: task.price.toString(),
        description: task.description
      });
      router.push(`/publisher/create/task-combination-middle-bottom?${params.toString()}`);
    } else if (task.id === 'task_combination_all') {
      // 全包任务 - 跳转到全包任务发布页面
      const params = new URLSearchParams({
        taskId: task.id,
        title: task.title,
        icon: task.icon,
        price: task.price.toString(),
        description: task.description
      });
      router.push(`/publisher/create/task-combination-all?${params.toString()}`);
    } else {
      // 其他任务类型（包括中评任务）
      const params = new URLSearchParams({
        taskId: task.id,
        title: task.title,
        icon: task.icon,
        price: task.price.toString(),
        description: task.description
      });
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
      <div className="px-4 space-y-4">
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
        
        <div className="bg-purple-50 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💰</span>
            <div>
              <h3 className="font-medium text-purple-900 mb-1">费用规则</h3>
              <p className="text-purple-700 text-sm leading-relaxed">
                视频发布模块和账号租赁/求租费用由双方自行设定，平台从成交额中抽取20%作为服务费。
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h3 className="font-medium text-green-900 mb-1">角色说明</h3>
              <p className="text-green-700 text-sm leading-relaxed">
                账号租赁功能支持"出租"与"求租"两种角色，双方可在公共池中相互查看相关信息并进行匹配。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}