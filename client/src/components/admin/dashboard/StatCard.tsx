import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, change, className }: StatCardProps) => {
  return (
    <div className={cn("bg-white p-5 rounded-lg shadow-sm", className)}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium mt-1",
              change.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {change.isPositive ? "▲" : "▼"} {change.value}
            </p>
          )}
        </div>
        <div className="p-2.5 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;