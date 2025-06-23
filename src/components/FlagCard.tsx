'use client';

import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
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
}: FlagCardProps) {  const sizeClasses = {
    small: 'p-2 sm:p-3 min-h-[100px] sm:min-h-[120px]',
    medium: 'p-3 sm:p-6 min-h-[140px] sm:min-h-[200px]',
    large: 'p-4 sm:p-8 min-h-[180px] sm:min-h-[240px]'
  };
  const flagSizes = {
    small: { width: 32, height: 24 },      // 32x24 for small
    medium: { width: 48, height: 36 },     // 48x36 for medium  
    large: { width: 64, height: 48 }       // 64x48 for large
  };

  const textSizes = {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-lg',
    large: 'text-base sm:text-xl'
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={onClick ? { 
        scale: 1.05, 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        borderColor: "#60a5fa"
      } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.3
      }}      className={`
        ${sizeClasses[size]}
        bg-white dark:bg-gray-800 
        border-2 border-gray-200 dark:border-gray-600 
        rounded-xl sm:rounded-2xl shadow-lg 
        flex flex-col items-center justify-center 
        relative w-full
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >      {showRank && country.rank && (
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-blue-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold z-10"
        >
          {country.rank}
        </motion.div>
      )}        <motion.div 
          className="mb-2 sm:mb-3 select-none flex items-center justify-center"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        >
          <Flag 
            code={country.code} 
            style={{
              width: flagSizes[size].width,
              height: flagSizes[size].height,
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            fallback={
              <div 
                style={{
                  width: flagSizes[size].width,
                  height: flagSizes[size].height,
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#6b7280'
                }}
              >
                {country.code}
              </div>
            }
          />
        </motion.div>
      
      <motion.h3 
        className={`${textSizes[size]} font-semibold text-center text-gray-800 dark:text-gray-200 leading-tight px-1`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {country.name}
      </motion.h3>
      
      <motion.p 
        className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {country.code}
      </motion.p>
    </motion.div>
  );
}
