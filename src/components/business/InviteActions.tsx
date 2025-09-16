'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { copyToClipboard, generateInviteCode } from '@/lib/utils';

export const InviteActions = () => {
  const [inviteCode] = useState('TASK2024ABC');
  const [inviteUrl] = useState(`https://douyin-task.com/register?invite=${inviteCode}`);
  const { addToast } = useToast();

  const handleCopyCode = async () => {
    const success = await copyToClipboard(inviteCode);
    if (success) {
      addToast({
        type: 'success',
        message: '邀请码已复制到剪贴板',
      });
    } else {
      addToast({
        type: 'error',
        message: '复制失败，请手动复制',
      });
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(inviteUrl);
    if (success) {
      addToast({
        type: 'success',
        message: '邀请链接已复制到剪贴板',
      });
    } else {
      addToast({
        type: 'error',
        message: '复制失败，请手动复制',
      });
    }
  };

  const handleShareToWechat = () => {
    // 这里实现微信分享逻辑
    addToast({
      type: 'info',
      message: '正在跳转到微信分享...',
    });
  };

  const handleShareToMoments = () => {
    // 这里实现朋友圈分享逻辑
    addToast({
      type: 'info',
      message: '正在跳转到朋友圈分享...',
    });
  };

  const handleGenerateQR = () => {
    // 这里实现二维码生成逻辑
    addToast({
      type: 'info',
      message: '正在生成专属二维码...',
    });
  };

  return (
    <div className="px-4">
      <Card>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">快速邀请</h3>
          
          {/* 邀请码 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1">我的邀请码</div>
                <div className="font-mono text-lg font-bold text-primary-500">
                  {inviteCode}
                </div>
              </div>
              <Button 
                size="sm"
                onClick={handleCopyCode}
              >
                复制
              </Button>
            </div>
          </div>
          
          {/* 邀请链接 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <div className="text-xs text-gray-500 mb-1">邀请链接</div>
                <div className="text-sm text-gray-700 line-clamp-1">
                  {inviteUrl}
                </div>
              </div>
              <Button 
                size="sm"
                variant="secondary"
                onClick={handleCopyLink}
              >
                复制链接
              </Button>
            </div>
          </div>
          
          {/* 分享按钮组 */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleShareToWechat}
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors touch-feedback"
            >
              <span className="text-2xl mb-2">💬</span>
              <span className="text-xs font-medium text-gray-700">微信好友</span>
            </button>
            
            <button
              onClick={handleShareToMoments}
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors touch-feedback"
            >
              <span className="text-2xl mb-2">👥</span>
              <span className="text-xs font-medium text-gray-700">朋友圈</span>
            </button>
            
            <button
              onClick={handleGenerateQR}
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors touch-feedback"
            >
              <span className="text-2xl mb-2">📱</span>
              <span className="text-xs font-medium text-gray-700">二维码</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};