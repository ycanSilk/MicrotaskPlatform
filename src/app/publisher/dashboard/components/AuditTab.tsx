import React from 'react';
import OrderHeaderTemplate from './OrderHeaderTemplate';

interface PendingOrder {
  id: string;
  taskTitle: string;
  commenterName: string;
  submitTime: string;
  content: string;
  images: string[];
  status: string;
  orderNumber?: string;
  updatedTime?: string;
}

interface AuditTabProps {
  pendingOrders: PendingOrder[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  handleOrderReview: (orderId: string, action: 'approve' | 'reject') => void;
  openImageViewer: (imageUrl: string) => void;
  filterRecentOrders: (tasks: any[]) => any[];
  searchOrders: (tasks: any[]) => any[];
  sortAuditTasks: (tasks: any[]) => any[];
  onViewAllClick: () => void;
}

const AuditTab: React.FC<AuditTabProps> = ({
  pendingOrders,
  searchTerm,
  setSearchTerm,
  handleSearch,
  sortBy,
  setSortBy,
  handleOrderReview,
  openImageViewer,
  filterRecentOrders,
  searchOrders,
  sortAuditTasks,
  onViewAllClick
}) => {
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

  // 获取过滤和搜索后的订单
  const filteredOrders = sortAuditTasks(searchOrders(filterRecentOrders(pendingOrders)));

  return (
    <div className="mx-4 mt-6 space-y-4">
      {/* 使用标准模板组件 */}
      <OrderHeaderTemplate
        title="待审核的订单"
        totalCount={pendingOrders.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewAllUrl="/publisher/orders"
        onViewAllClick={onViewAllClick}
      />
      
      {/* 子订单列表 */}
      {filteredOrders.map((order, index) => (
        <div key={`pending-${order.id}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          {/* 订单号和订单状态 - 调整为同一行显示 */}
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-gray-500 flex items-center">
              订单号: {order.orderNumber || order.id}
              <button 
                className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-xs"
                onClick={() => handleCopyOrderNumber(order.orderNumber || order.id)}
              >
                复制
              </button>
            </div>
            <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-600">
              待审核
            </span>
          </div>
          
          {/* 时间信息 - 显示订单创建时间和最新更新时间 */}
          <div className="text-xs text-black mb-2 grid grid-cols-2 gap-2">
            <div className="text-left">
              发布时间：
              {order.submitTime && !isNaN(new Date(order.submitTime).getTime()) 
                ? new Date(order.submitTime).toLocaleString('zh-CN') 
                : '时间无效'}
            </div>
            <div className="text-left">
              更新时间：
              {order.updatedTime && !isNaN(new Date(order.updatedTime).getTime()) 
                ? new Date(order.updatedTime).toLocaleString('zh-CN') 
                : order.submitTime && !isNaN(new Date(order.submitTime).getTime())
                  ? new Date(order.submitTime).toLocaleString('zh-CN')
                  : '时间无效'}
            </div>
          </div>
          
          {/* 任务需求 - 限制为单行显示 */}
          <div className="text-sm font-medium text-black mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            任务需求：{order.taskTitle}
          </div>
          
          {/* 任务类型展示 */}
          <div className="text-xs text-black mb-1">
            任务类型: 评论任务
          </div>
          
          {/* 领取用户信息展示 */}
          <div className="text-xs text-black mb-1">
            领取用户: {order.commenterName}
          </div>

          {/* 提交内容 */}
          <div className="mb-3">
            <h5 className="text-xs font-medium text-gray-700 mb-1">提交内容:</h5>
            <div className="bg-white p-3 rounded text-sm text-black border border-gray-200">
              {order.content}
            </div>
          </div>

          {/* 图片附件 */}
          <div className="mb-3">
            <h5 className="text-xs font-medium text-gray-700 mb-1">上传截图:</h5>
            {order.images && order.images.length > 0 ? (
              <div className="flex space-x-2 flex-wrap">
                {order.images.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden shadow-sm"
                    onClick={() => openImageViewer(image)}
                  >
                    <img 
                      src={image} 
                      alt={`上传截图 ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // 防止无限循环
                        target.src = '/images/20250916161008.png';
                        target.alt = `图片加载失败 ${index + 1}`;
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-500 border border-gray-200">
                暂无上传截图
              </div>
            )}
          </div>

          {/* 审核按钮 */}
          <div className="flex space-x-3 mt-3">
            <button
              onClick={() => handleOrderReview(order.id, 'approve')}
              className={`flex-1 py-2 rounded font-medium transition-colors text-sm ${order.status === 'completed' || order.status === 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
              disabled={order.status === 'completed' || order.status === 'approved'}
            >
              ✅ 通过审核
            </button>
            <button
              onClick={() => handleOrderReview(order.id, 'reject')}
              className={`flex-1 py-2 rounded font-medium transition-colors text-sm ${order.status === 'completed' || order.status === 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
              disabled={order.status === 'completed' || order.status === 'approved'}
            >
              ❌ 驳回订单
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditTab;