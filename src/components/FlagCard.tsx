'use client';

import { motion } from 'framer-motion';
import { RankedCountry } from '@/hooks/useFlagSorting';
import { getReliableFlagEmoji } from '@/utils/flagEmoji';

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
      }}
      className={`
        ${sizeClasses[size]}
        bg-white dark:bg-gray-800 
        border-2 border-gray-200 dark:border-gray-600 
        rounded-2xl shadow-lg 
        flex flex-col items-center justify-center 
        relative
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {showRank && country.rank && (
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10"
        >
          {country.rank}
        </motion.div>
      )}
        <motion.div 
        className={`${flagSizes[size]} mb-3 select-none font-emoji`}
        style={{ 
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", sans-serif',
          fontFeatureSettings: '"liga" off, "kern" off',
          textRendering: 'optimizeSpeed'
        }}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      >
        {getReliableFlagEmoji(country.code)}
      </motion.div>
      
      <motion.h3 
        className={`${textSizes[size]} font-semibold text-center text-gray-800 dark:text-gray-200 leading-tight`}
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
