import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: React.ReactNode;
  footer?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  onClick?: () => void;
}

export function DashboardCard({
  title,
  value,
  footer,
  icon,
  trend,
  color = 'blue',
  onClick,
}: DashboardCardProps) {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  };

  return (
    <Card onClick={onClick} className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {value}
            </p>
            {Boolean(trend) && (
              <div className="flex items-center gap-1 text-sm">
                {trend > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">+{trend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">{trend}%</span>
                  </>
                )}
              </div>
            )}
          </div>
          {icon && <div className={`p-3 rounded-lg ${colorMap[color]}`}>{icon}</div>}
        </div>
        {footer && <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">{footer}</p>}
      </CardContent>
    </Card>
  );
}
