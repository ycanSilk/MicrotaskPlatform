'use client';

import { useRouter } from 'next/navigation';

// 定义任务类型接口
interface TaskType {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

// 任务类型配置
const TASK_TYPES: TaskType[] = [
  {
    id: 'manual_comment',
    title: '人工评论',
    icon: '💬',
    description: '在社交媒体平台发布手动评论任务，支持抖音、小红书、快手等平台',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'account_rental',
    title: '账号租用',
    icon: '🔑',
    description: '租用真实活跃账号进行品牌推广和内容传播',
    color: 'from-green-500 to-teal-400'
  }
];

// 任务类型卡片组件
const TaskTypeCard = ({ taskType, onClick }: { taskType: TaskType, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer active:scale-95"
    >
      {/* 任务类型头部 */}
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 bg-gradient-to-r ${taskType.color} rounded-2xl flex items-center justify-center text-3xl`}>
          {taskType.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-xl">{taskType.title}</h3>
        </div>
      </div>

      {/* 任务类型描述 */}
      <div className="mb-4">
        <p className="text-gray-700">{taskType.description}</p>
      </div>

      {/* 进入按钮 */}
      <div className="flex items-center justify-end">
        <div className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2">
          <span>继续</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}

export default function CreateTask() {
  const router = useRouter();

  const handleTaskTypeClick = (taskType: TaskType) => {
    if (taskType.id === 'manual_comment') {
      // Manual Comment 跳转到 platformtype 页面
      router.push('/publisher/create/platformtype' as any);
    } else if (taskType.id === 'account_rental') {
      // Account Rental 跳转到 account-rental 页面
      router.push('/publisher/create/account-rental' as any);
    }
  };



  return (
    <div className="space-y-6 pb-20">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 ">
        <h1 className="text-2xl font-bold mb-2 px-4">发布任务</h1>
        <p className="text-blue-100 px-4">选择您想要发布的任务类型</p>
      </div>

      {/* 任务类型卡片列表 */}
      <div className="px-4 space-y-4">
        {TASK_TYPES.map((taskType) => (
          <TaskTypeCard 
            key={taskType.id} 
            taskType={taskType} 
            onClick={() => handleTaskTypeClick(taskType)}
          />
        ))}
      </div>

      {/* 提示信息 */}
      <div className="px-4">
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">任务类型说明</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                请选择您需要发布的任务类型。选择"人工评论"将进入平台选择页面，选择"账号租用"将进入账号租用页面。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}