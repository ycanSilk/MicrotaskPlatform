import React from 'react';
import { useRouter } from 'next/navigation';

interface Stats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalSpent: number;
  totalInProgressSubOrders: number;
  totalCompletedSubOrders: number;
  totalPendingReviewSubOrders: number;
  totalPendingSubOrders: number;
  averageOrderValue: number;
}

interface DispatchedTask {
  id: string;
  title: string;
  status: string;
  statusText: string;
  participants: number;
  maxParticipants: number;
  time: string;
  completed: number;
  inProgress: number;
  pending: number;
  pendingReview?: number;
  price: number;
  orderNumber: string;
  taskType: string;
  taskRequirements: string;
  updatedTime?: string;
}

interface OverviewTabProps {
  stats: Stats;
  dispatchedTasks: DispatchedTask[];
  statsTimeRange: string;
  setStatsTimeRange: (range: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  dispatchedTasks,
  statsTimeRange,
  setStatsTimeRange
}) => {
  const router = useRouter();

  // 复制订单号功能
  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber).then(() => {
      // 创建临时提示元素
      const tooltip = document.createElement('div');
      tooltip.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      tooltip.innerText = '订单号已复制';
      document.body.appendChild(tooltip);
      // 2秒后移除提示
      setTimeout(() => {
        document.body.removeChild(tooltip);
      }, 2000);
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  return (
    <>
      {/* 数据概览 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">我的数据</h3>
            {/* 时间范围切换 */}
            <div className="flex bg-gray-100 rounded-lg p-2">
              <button
                onClick={() => setStatsTimeRange('today')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${statsTimeRange === 'today' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-white'}`}
              >
                今天
              </button>
              <button
                onClick={() => setStatsTimeRange('yesterday')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${statsTimeRange === 'yesterday' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-white'}`}
              >
                昨天
              </button>
              <button
                onClick={() => setStatsTimeRange('dayBeforeYesterday')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${statsTimeRange === 'dayBeforeYesterday' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-white'}`}
              >
                前天
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{stats.totalTasks}</div>
              <div className="text-xs text-green-700">总任务数</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.activeTasks}</div>
              <div className="text-xs text-blue-700">进行中</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-600">¥{stats.totalSpent.toFixed(2)}</div>
              <div className="text-xs text-orange-700">总投入</div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">¥{stats.averageOrderValue.toFixed(2)}</div>
              <div className="text-xs text-purple-700">平均客单价</div>
            </div>
          </div>
        </div>
      </div>

      {/* 新增的子订单统计数据 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">子订单统计</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalInProgressSubOrders}</div>
              <div className="text-xs text-blue-700">进行中</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{stats.totalCompletedSubOrders}</div>
              <div className="text-xs text-green-700">已完成</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-600">{stats.totalPendingReviewSubOrders}</div>
              <div className="text-xs text-orange-700">待审核</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.totalPendingSubOrders || 0}</div>
              <div className="text-xs text-yellow-700">待领取</div>
            </div>
          </div>
        </div>
      </div>

      {/* 派发的任务列表 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">派发的任务</h3>
              <button 
                onClick={() => router.push('/publisher/tasks/history')}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                查看全部历史订单 →
              </button>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto p-4">
            {dispatchedTasks.slice(0, 10).map((task, index) => (
              <div key={`dispatched-${task.id}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {/* 订单号和订单状态 - 调整为同一行显示 */}
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-gray-500 flex items-center">
                    订单号: {task.orderNumber || 'N/A'}
                    <button 
                      className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-xs"
                      onClick={() => handleCopyOrderNumber(task.orderNumber || 'N/A')}
                    >
                      复制
                    </button>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${task.status === 'main_progress' ? 'bg-green-100 text-green-600' : task.status === 'main_completed' ? 'bg-green-100 text-green-600' : 'bg-green-100 text-green-600'}`}>
                    {task.statusText}
                  </span>
                </div>
                
                {/* 时间信息 - 显示订单创建时间和最新更新时间 */}
                <div className="text-xs text-gray-600 mb-1 flex flex-wrap gap-x-4 gap-y-1">
                  <div>
                    发布时间：
                    {new Date(task.time).toLocaleString('zh-CN')}
                  </div>
                  <div>
                    更新时间：
                    {new Date(task.updatedTime || task.time).toLocaleString('zh-CN')}
                  </div>
                </div>
                
                {/* 任务需求 - 限制为单行显示 */}
                <div className="text-sm font-medium text-black mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  任务需求：{task.taskRequirements}
                </div>
                
                {/* 新增任务类型信息展示 */}
                <div className="text-xs text-gray-500 mb-1">
                  任务类型: {(() => {
                    const taskTypeMap: Record<string, string> = {
                      'comment_middle': '评论任务',
                      'account_rental': '租号任务',
                      'video_send': '视频推送任务'
                    };
                    return taskTypeMap[task.taskType] || task.taskType;
                  })()}
                </div>
                
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-gray-600">
                    完成: {task.completed} | 进行中: {task.inProgress} | 待领取: {task.pending} | 待审核: {task.pendingReview || 0} | 总计: {task.maxParticipants} 条
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm">
                    <span className="text-gray-600">订单单价:</span>
                    <span className="font-medium text-black"> ¥{typeof task.price === 'number' ? task.price.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">总金额:</span>
                    <span className="font-medium text-black"> 
                      ¥{typeof task.price === 'number' && typeof task.maxParticipants === 'number' ? (task.price * task.maxParticipants).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
                {/* 在进度条上添加百分比数值显示 */}
                <div className="relative bg-green-300 h-5 rounded w-full">
                  
                  <div 
                    className="bg-green-500 h-5 rounded" 
                    style={{width: `${task.maxParticipants > 0 ? (task.participants / task.maxParticipants) * 100 : 0}%`}}
                  ></div>
                  <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-white">
                    完成进度：{task.maxParticipants > 0 ? Math.round((task.participants / task.maxParticipants) * 100) : 0}%
                  </div>
                </div>
                
                {/* 查看详情按钮 */}
                <div className="mt-3">
                  <button
                    onClick={() => router.push(`/publisher/orders/${task.id}`)}
                    className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors text-sm"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;