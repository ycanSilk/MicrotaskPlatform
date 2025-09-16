'use client';

import React, { useState } from 'react';

export default function CommenterEarningsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="pb-20">

      {/* 收益类型切换 */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          概览
        </button>
        <button 
          onClick={() => setActiveTab('details')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'details' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          明细
        </button>
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'withdraw' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          提现
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* 今日收益 */}
          <div className="mx-4 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
              <div className="text-center">
                <div className="text-sm mb-2">今日收益</div>
                <div className="text-3xl font-bold">¥28.50</div>
              </div>
            </div>
          </div>

          {/* 历史收益 */}
          <div className="mx-4 mt-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-orange-600 mb-1">昨日</div>
                <div className="text-lg font-bold text-orange-700">¥32.20</div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-green-600 mb-1">本周</div>
                <div className="text-lg font-bold text-green-700">¥186.40</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-blue-600 mb-1">本月</div>
                <div className="text-lg font-bold text-blue-700">¥743.80</div>
              </div>
            </div>
          </div>

          {/* 可提现金额 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">可提现余额</div>
                <div className="text-2xl font-bold text-green-600">¥456.80</div>
              </div>
              <button className="bg-green-500 text-white px-6 py-2 rounded font-medium">
                立即提现
              </button>
            </div>
          </div>

          {/* 收益统计 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">收益统计</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-600">¥2,847.60</div>
                  <div className="text-xs text-gray-500">累计收益</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="text-lg font-bold text-orange-600">156</div>
                  <div className="text-xs text-gray-500">完成任务</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">91%</div>
                  <div className="text-xs text-gray-500">通过率</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-lg font-bold text-purple-600">4.9</div>
                  <div className="text-xs text-gray-500">平均评分</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'details' && (
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">收益明细</h3>
            </div>
            <div className="divide-y">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">美食探店推广</div>
                  <div className="text-xs text-gray-500">2024-01-15 14:30</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+¥3.50</div>
                  <div className="text-xs text-gray-500">已到账</div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">护肤产品体验</div>
                  <div className="text-xs text-gray-500">2024-01-15 10:20</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+¥5.20</div>
                  <div className="text-xs text-gray-500">已到账</div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">科技产品评测</div>
                  <div className="text-xs text-gray-500">2024-01-14 16:45</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+¥4.80</div>
                  <div className="text-xs text-gray-500">已到账</div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">提现手续费</div>
                  <div className="text-xs text-gray-500">2024-01-14 09:00</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">-¥2.00</div>
                  <div className="text-xs text-gray-500">已扣除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">提现申请</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提现金额
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  placeholder="请输入提现金额"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                可提现余额：¥456.80 | 最低提现：¥10.00
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提现方式
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="method" className="mr-2" defaultChecked />
                  <span className="text-sm">微信钱包</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="method" className="mr-2" />
                  <span className="text-sm">支付宝</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="method" className="mr-2" />
                  <span className="text-sm">银行卡</span>
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="text-sm text-yellow-800">
                <div className="font-medium mb-1">提现说明：</div>
                <ul className="text-xs space-y-1">
                  <li>• 提现手续费：2元/笔</li>
                  <li>• 工作日申请，当日到账</li>
                  <li>• 周末申请，下个工作日到账</li>
                  <li>• 单日最多可申请提现3次</li>
                </ul>
              </div>
            </div>

            <button className="w-full bg-green-500 text-white py-3 rounded font-medium">
              申请提现
            </button>
          </div>

          {/* 提现记录 */}
          <div className="bg-white rounded-lg shadow-sm mt-4">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">提现记录</h3>
            </div>
            <div className="divide-y">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">微信提现</div>
                  <div className="text-xs text-gray-500">2024-01-14 09:00</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">¥98.00</div>
                  <div className="text-xs text-green-600">已到账</div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">支付宝提现</div>
                  <div className="text-xs text-gray-500">2024-01-10 15:30</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">¥150.00</div>
                  <div className="text-xs text-green-600">已到账</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 查看明细 */}
      {activeTab === 'overview' && (
        <div className="mx-4 mt-4">
          <button 
            onClick={() => setActiveTab('details')}
            className="w-full bg-white border border-gray-300 text-gray-600 py-3 rounded text-center"
          >
            查看明细
          </button>
        </div>
      )}
    </div>
  );
}