'use client';

import { RankedCountry } from '@/hooks/useFlagSorting';

interface FlagCardProps {
  country: RankedCountry;
  onClick?: () => void;
  className?: string;
  showRank?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function FlagCard({ 
  country, 
  onClick, 
  className = '', 
  showRank = false, 
  size = 'medium' 
}: FlagCardProps) {
  const sizeClasses = {
    small: 'p-3 min-h-[120px]',
    medium: 'p-6 min-h-[200px]',
    large: 'p-8 min-h-[240px]'
  };

  const flagSizes = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-white dark:bg-gray-800 
        border-2 border-gray-200 dark:border-gray-600 
        rounded-2xl shadow-lg 
        flex flex-col items-center justify-center 
        transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:border-blue-400 dark:hover:border-blue-500' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {showRank && country.rank && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
          {country.rank}
        </div>
      )}
      
      <div className={`${flagSizes[size]} mb-3 select-none`}>
        {country.flag}
      </div>
      
      <h3 className={`${textSizes[size]} font-semibold text-center text-gray-800 dark:text-gray-200 leading-tight`}>
        {country.name}
      </h3>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">
        {country.code}
      </p>
    </div>
  );
}
