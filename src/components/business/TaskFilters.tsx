'use client';

import { useState } from 'react';
import { TaskFilters as ITaskFilters } from '@/types';
import { TASK_CATEGORIES, DIFFICULTY_LEVELS, PRICE_RANGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: ITaskFilters;
  onFiltersChange: (filters: ITaskFilters) => void;
}

export const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 快捷筛选标签
  const quickFilters = [
    { key: 'all', label: '全部', active: !filters.category },
    { key: 'recommend', label: '推荐', active: false },
    { key: 'high-price', label: '高价', active: filters.priceRange?.[0] === 5 },
    { key: 'easy', label: '简单', active: filters.difficulty === 1 },
  ];

  const handleQuickFilter = (key: string) => {
    switch (key) {
      case 'all':
        onFiltersChange({ ...filters, category: undefined, difficulty: undefined, priceRange: undefined });
        break;
      case 'high-price':
        onFiltersChange({ ...filters, priceRange: [5, 999] });
        break;
      case 'easy':
        onFiltersChange({ ...filters, difficulty: 1 });
        break;
      default:
        break;
    }
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ 
      ...filters, 
      category: category === filters.category ? undefined : category 
    });
  };

  const handleDifficultyChange = (difficulty: number) => {
    onFiltersChange({ 
      ...filters, 
      difficulty: difficulty === filters.difficulty ? undefined : difficulty 
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    const newRange: [number, number] = [min, max];
    const currentRange = filters.priceRange;
    
    // 如果当前选中的范围相同，则取消选择
    if (currentRange && currentRange[0] === min && currentRange[1] === max) {
      onFiltersChange({ ...filters, priceRange: undefined });
    } else {
      onFiltersChange({ ...filters, priceRange: newRange });
    }
  };

  return (
    <div className="px-4 py-3 space-y-3">
      {/* 快捷筛选 */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {quickFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleQuickFilter(filter.key)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              filter.active || (filter.key === 'all' && !filters.category && !filters.difficulty && !filters.priceRange)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {filter.label}
          </button>
        ))}
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            'flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            showAdvanced
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          筛选 {showAdvanced ? '↑' : '↓'}
        </button>
      </div>

      {/* 高级筛选 */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          {/* 任务分类 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">任务分类</h4>
            <div className="flex flex-wrap gap-2">
              {TASK_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    filters.category === category.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* 难度等级 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">难度等级</h4>
            <div className="flex space-x-2">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleDifficultyChange(level.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    filters.difficulty === level.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {level.stars} {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* 价格范围 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">价格范围</h4>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={`${range.min}-${range.max}`}
                  onClick={() => handlePriceRangeChange(range.min, range.max)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};