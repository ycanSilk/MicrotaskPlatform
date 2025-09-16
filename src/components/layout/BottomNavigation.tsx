'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/types';

interface BottomNavigationProps {
  items: NavigationItem[];
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {items.map((item, index) => {
          const isActive = pathname === item.path || item.active;
          
          return (
            <Link
              key={index}
              href={item.path as any}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1',
                'touch-target transition-colors duration-200',
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <span className="text-xl mb-1">
                {item.icon}
              </span>
              <span className={cn(
                'text-xs font-medium truncate',
                isActive && 'text-primary'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};