'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RankedCountry } from '@/hooks/useFlagSorting';
import FlagCard from '@/components/FlagCard';
import ProgressBar from '@/components/ProgressBar';

interface SortingViewProps {
  currentComparison: [RankedCountry, RankedCountry] | null;
  favorites: RankedCountry[];
  progress: {
    ranked: number;
    remaining: number;
    total: number;
  };
  isProcessingChoice: boolean;
  onChoice: (country: RankedCountry) => void;
  onSkip: () => void;
  onViewResults: () => void;
  onReset: () => void;
}

/**
 * SortingView Component
 * 
 * Handles the main sorting/comparison interface where users choose between flag pairs.
 * Shows progress, current comparison, and provides action buttons for navigation.
 * 
 * Features:
 * - Animated flag card comparisons with smooth transitions
 * - Progress tracking with visual feedback
 * - Action buttons for skipping, viewing results, and resetting
 * - Statistics display showing ranked/remaining/total counts
 * - Responsive design with proper spacing and animations
 * - Debounced choice handling to prevent rapid clicking
 */
export default function SortingView({
  currentComparison,
  favorites,
  progress,
  isProcessingChoice,
  onChoice,
  onSkip,
  onViewResults,
  onReset
}: SortingViewProps) {
  const actionButtons = [
    {
      text: "Skip This Comparison",
      onClick: onSkip,
      disabled: !currentComparison,
      color: "bg-gray-500 hover:bg-gray-600"
    },
    {
      text: `View Current Results (${favorites.length})`,
      onClick: onViewResults,
      disabled: favorites.length === 0,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      text: "Reset",
      onClick: onReset,
      disabled: false,
      color: "bg-red-500 hover:bg-red-600"
    }
  ];

  const stats = [
    { value: progress.ranked, label: "Ranked", color: "text-blue-500" },
    { value: progress.remaining, label: "Remaining", color: "text-yellow-500" },
    { value: progress.total, label: "Total", color: "text-green-500" }
  ];

  const handleChoice = (country: RankedCountry) => {
    if (!isProcessingChoice) {
      onChoice(country);
    }
  };
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8 overflow-x-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          >
            Choose Your Favorite
          </motion.h1>
          <ProgressBar 
            current={progress.ranked} 
            total={progress.total} 
            label="Countries Ranked"
          />
        </motion.div>        {/* Comparison Cards */}
        <AnimatePresence mode="wait">
          {currentComparison && (
            <motion.div 
              key={`${currentComparison[0].code}-${currentComparison[1].code}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <FlagCard
                  country={currentComparison[0]}
                  onClick={() => handleChoice(currentComparison[0])}
                  size="large"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <FlagCard
                  country={currentComparison[1]}
                  onClick={() => handleChoice(currentComparison[1])}
                  size="large"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {actionButtons.map((button, index) => (
            <motion.button
              key={button.text}
              onClick={button.onClick}
              className={`${button.color} text-white font-semibold py-2 px-4 sm:px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto max-w-xs`}
              disabled={button.disabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={!button.disabled ? { scale: 1.05 } : {}}
              whileTap={!button.disabled ? { scale: 0.95 } : {}}
            >
              <span className="block sm:hidden">
                {button.text === "Skip This Comparison" ? "Skip" : 
                 button.text.includes("View Current Results") ? `Results (${favorites.length})` :
                 button.text}
              </span>
              <span className="hidden sm:block">
                {button.text}
              </span>
            </motion.button>
          ))}
        </motion.div>        {/* Stats */}
        <motion.div 
          className="text-center mt-8 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, type: "spring", stiffness: 200 }}
              >
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
