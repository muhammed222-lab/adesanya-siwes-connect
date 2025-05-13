
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  change?: {
    value: number;
    positive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'bg-aapoly-purple', 
  change 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center">
      <div className={`${color} text-white p-3 rounded-lg mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <div className="flex items-center mt-1">
            <span className={change.positive ? 'text-green-500' : 'text-red-500'}>
              {change.positive ? '+' : '-'}{Math.abs(change.value)}%
            </span>
            <span className="text-gray-500 text-xs ml-1">since last week</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
