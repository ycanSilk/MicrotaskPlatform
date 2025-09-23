'use client';
import React, { useState, useRef } from 'react';
import type { EarningRecord, WithdrawalRecord, CommenterAccount, Stats } from '../page';
import { useRouter } from 'next/navigation';

interface EarningsDetailsProps {
  currentUserAccount: CommenterAccount | null;
  earnings: EarningRecord[];
  stats: Stats;
}

type EarningsViewMode = 'all' | 'task' | 'commission';
type ImportFormat = 'csv' | 'excel';

const EarningsDetails: React.FC<EarningsDetailsProps> = ({
  currentUserAccount,
  earnings,
  stats
}) => {
  const [viewMode, setViewMode] = useState<EarningsViewMode>('all');
  const [importFormat, setImportFormat] = useState<ImportFormat>('csv');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 直接使用传入的数据，不再提供静态数据作为后备
  const earningsToDisplay = earnings;
  // 由于props中没有传入withdrawals，这里设置为空数组
  const withdrawalsToDisplay: WithdrawalRecord[] = [];

  // 根据查看模式过滤收益记录
  const filteredEarnings = earningsToDisplay.filter(earning => {
    if (viewMode === 'all') return true;
    if (viewMode === 'task') return earning.type !== 'commission';
    if (viewMode === 'commission') {
      return earning.type === 'commission' || 
             (earning.commissionInfo && earning.commissionInfo.hasCommission);
    }
    return true;
  });

  // 获取任务类型标签信息
  const getTaskTypeInfo = (type?: string) => {
    switch (type) {
      case 'comment':
        return { label: '评论任务', color: 'bg-blue-100 text-blue-800' };
      case 'video':
        return { label: '视频推荐', color: 'bg-green-100 text-green-800' };
      case 'account_rental':
        return { label: '租号任务', color: 'bg-purple-100 text-purple-800' };
      case 'commission':
        return { label: '佣金收入', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: '普通任务', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 跳转到收益详情页
  const handleViewEarningDetails = (earningId: string) => {
    router.push(`/commenter/earnings/details/${earningId}`);
  };

  // 处理导入格式选择
  const handleFormatChange = (format: ImportFormat) => {
    setImportFormat(format);
    setImportError(null);
    setImportSuccess(false);
  };

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importEarningsFile(file);
      // 重置文件输入，以便可以重新选择同一个文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 处理导入操作
  const importEarningsFile = async (file: File) => {
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      // 模拟文件处理过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 检查文件类型
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (importFormat === 'csv' && fileExtension !== 'csv') {
        throw new Error('请上传CSV格式的文件');
      }
      if (importFormat === 'excel' && !['xlsx', 'xls'].includes(fileExtension || '')) {
        throw new Error('请上传Excel格式的文件');
      }

      // 这里应该有实际的文件解析和数据处理逻辑
      // 为了演示，我们简单模拟成功
      console.log('导入文件:', file.name);
      console.log('导入格式:', importFormat);
      
      // 模拟导入成功
      setImportSuccess(true);
      
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '导入失败，请重试');
    } finally {
      setIsImporting(false);
    }
  };

  // 触发文件选择对话框
  const triggerFileSelect = () => {
    setImportError(null);
    setImportSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 计算各类收益的总和
  const calculateTotalEarnings = (type: EarningsViewMode) => {
    if (type === 'all') {
      return earningsToDisplay.reduce((sum, earning) => sum + earning.amount, 0);
    } else if (type === 'task') {
      return earningsToDisplay
        .filter(e => e.type !== 'commission')
        .reduce((sum, earning) => sum + earning.amount, 0);
    } else if (type === 'commission') {
      return earningsToDisplay
        .filter(e => e.type === 'commission' || (e.commissionInfo && e.commissionInfo.hasCommission))
        .reduce((sum, earning) => sum + earning.amount, 0);
    }
    return 0;
  };

  return (
    <div className="mx-4 mt-6">
      {/* 收益类型切换 */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="p-4 border-b">
          <h3 className="font-bold text-gray-800">收益明细</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex gap-2">
              <button
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
                onClick={() => setViewMode('all')}
              >
                全部收益
              </button>
              <button
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${viewMode === 'task' ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'}`}
                onClick={() => setViewMode('task')}
              >
                任务收益
              </button>
              <button
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${viewMode === 'commission' ? 'bg-yellow-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-yellow-50'}`}
                onClick={() => setViewMode('commission')}
              >
                佣金收益
              </button>
            </div>
            
            {/* 导入功能区域 */}
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 mr-2">
                <button
                  className={`px-3 py-1.5 text-sm rounded border ${importFormat === 'csv' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700'}`}
                  onClick={() => handleFormatChange('csv')}
                  disabled={isImporting}
                >
                  CSV
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded border ${importFormat === 'excel' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700'}`}
                  onClick={() => handleFormatChange('excel')}
                  disabled={isImporting}
                >
                  Excel
                </button>
              </div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                onClick={triggerFileSelect}
                disabled={isImporting}
              >
                {isImporting ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    导入中...
                  </span>
                ) : (
                  '导入明细'
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept={importFormat === 'csv' ? '.csv' : '.xlsx,.xls'}
              />
            </div>
          </div>
          
          {/* 导入结果提示 */}
          {(importError || importSuccess) && (
            <div className={`mb-4 p-3 rounded-md ${importError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {importError || '导入成功'}
            </div>
          )}
        </div>
        
        {/* 收益总览 */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {viewMode === 'all' ? '总收益' : viewMode === 'task' ? '任务总收益' : '佣金总收益'}
            </div>
            <div className="text-lg font-bold text-green-600">
              ¥{calculateTotalEarnings(viewMode).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 收益记录列表 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="divide-y">
          {filteredEarnings.length > 0 ? (
            filteredEarnings.map((earning) => {
              const taskTypeInfo = getTaskTypeInfo(earning.type);
              const formattedDate = formatDateTime(earning.createdAt);
              const hasCommission = earning.commissionInfo && earning.commissionInfo.hasCommission;
              
              return (
                <div 
                  key={earning.id} 
                  className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewEarningDetails(earning.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 flex items-center justify-between mb-1">
                      <span>{earning.taskName}</span>
                      {hasCommission && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                          含佣金
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">{formattedDate}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${taskTypeInfo.color}`}>
                        {taskTypeInfo.label}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-green-600">+¥{earning.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{earning.status === 'completed' ? '已到账' : '处理中'}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              {viewMode === 'all' ? '暂无收益记录' : 
               viewMode === 'task' ? '暂无任务收益记录' : '暂无佣金收益记录'}
            </div>
          )}
          
          {/* 显示提现手续费记录 - 仅在全部收益视图中显示 */}
          {viewMode === 'all' && withdrawalsToDisplay.filter(w => w.status === 'approved' && w.fee > 0).length > 0 && (
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-gray-600 mb-2">提现手续费</h4>
              {withdrawalsToDisplay
                .filter(w => w.status === 'approved' && w.fee > 0)
                .map((withdrawal) => {
                  const date = formatDateTime(withdrawal.requestedAt);
                  
                  return (
                    <div key={`fee-${withdrawal.id}`} className="p-2 flex justify-between items-center text-sm">
                      <div className="text-gray-600">提现手续费 ({date})</div>
                      <div className="text-red-500">-¥{withdrawal.fee.toFixed(2)}</div>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsDetails;