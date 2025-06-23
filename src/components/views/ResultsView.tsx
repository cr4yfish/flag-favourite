'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RankedCountry } from '@/hooks/useFlagSorting';
import FlagCard from '@/components/FlagCard';

interface ResultsViewProps {
  favorites: RankedCountry[];
  isComplete: boolean;
  onContinueSorting: () => void;
  onShare: () => void;
  onReset: () => void;
}

/**
 * ResultsView Component
 * 
 * Displays the user's ranked flag preferences in a comprehensive results page.
 * Shows both a grid view of all rankings and a special top 3 podium display.
 * 
 * Features:
 * - Grid layout of all ranked flags with rank indicators
 * - Special top 3 podium with animated trophy positions
 * - Action buttons for continuing, sharing, and resetting
 * - Completion celebration when all flags are ranked
 * - Responsive design with smooth animations
 * - Progressive reveal animations for better UX
 */
export default function ResultsView({
  favorites,
  isComplete,
  onContinueSorting,
  onShare,
  onReset
}: ResultsViewProps) {
  const actionButtons = [
    {
      text: favorites.length > 0 ? 'Continue Sorting' : 'Start Sorting',
      onClick: onContinueSorting,
      color: "bg-blue-500 hover:bg-blue-600",
      disabled: false
    },
    {
      text: "Share Results",
      onClick: onShare,
      color: "bg-green-500 hover:bg-green-600",
      disabled: favorites.length === 0
    },
    {
      text: "Start Over",
      onClick: onReset,
      color: "bg-red-500 hover:bg-red-600",
      disabled: false
    }
  ];

  const sortedFavorites = favorites.sort((a, b) => (a.rank || 0) - (b.rank || 0));
  const topThree = sortedFavorites.slice(0, 3);
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8 overflow-x-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
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
            🏆 Your Flag Rankings
          </motion.h1>            <motion.p 
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
            {favorites.length > 0 
              ? `You've ranked ${favorites.length} countries so far!`
              : 'No rankings yet. Start sorting to see your favorites!'
            }
          </motion.p>
        </motion.div>        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {actionButtons.map((button, index) => (
            <motion.button
              key={button.text}
              onClick={button.onClick}
              disabled={button.disabled}
              className={`${button.color} text-white font-semibold py-2 px-4 sm:px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto max-w-xs`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={!button.disabled ? { scale: 1.05 } : {}}
              whileTap={!button.disabled ? { scale: 0.95 } : {}}
            >
              {button.text}
            </motion.button>
          ))}
        </motion.div>        {/* Results Grid */}
        {favorites.length > 0 && (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AnimatePresence>
              {sortedFavorites.map((country, index) => (
                <motion.div 
                  key={country.code} 
                  className="relative"
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.8 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  layout
                >
                  <FlagCard
                    country={country}
                    showRank={true}
                    size="medium"
                    className="h-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <motion.div 
            className="mt-12 sm:mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.h2 
              className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6 sm:mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
            >
              🥇 Top 3 Favorites
            </motion.h2>
            
            <div className="flex justify-center items-end gap-2 sm:gap-4 max-w-sm sm:max-w-4xl mx-auto overflow-x-auto pb-4">
              {/* 2nd Place */}
              <motion.div 
                className="text-center flex-shrink-0"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 150 }}
              >
                <motion.div 
                  className="bg-gradient-to-t from-gray-300 to-gray-400 p-2 sm:p-4 rounded-t-lg mb-2 sm:mb-4 h-16 sm:h-24 flex items-end min-w-[80px] sm:min-w-[120px]"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full text-white font-bold text-sm sm:text-lg">2nd</div>
                </motion.div>
                <div className="w-20 sm:w-auto">
                  <FlagCard country={topThree[1]} size="small" />
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div 
                className="text-center flex-shrink-0"
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, type: "spring", stiffness: 150 }}
              >
                <motion.div 
                  className="bg-gradient-to-t from-yellow-400 to-yellow-500 p-2 sm:p-4 rounded-t-lg mb-2 sm:mb-4 h-20 sm:h-32 flex items-end min-w-[100px] sm:min-w-[140px]"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 0 rgba(255,215,0,0.5)", 
                      "0 0 20px rgba(255,215,0,0.8)", 
                      "0 0 0 rgba(255,215,0,0.5)"
                    ] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-full text-white font-bold text-base sm:text-xl">1st</div>
                </motion.div>
                <div className="w-24 sm:w-auto">
                  <FlagCard country={topThree[0]} size="medium" />
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div 
                className="text-center flex-shrink-0"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9, type: "spring", stiffness: 150 }}
              >
                <motion.div 
                  className="bg-gradient-to-t from-amber-600 to-amber-700 p-2 sm:p-4 rounded-t-lg mb-2 sm:mb-4 h-12 sm:h-20 flex items-end min-w-[70px] sm:min-w-[100px]"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full text-white font-bold text-xs sm:text-base">3rd</div>
                </motion.div>
                <div className="w-16 sm:w-auto">
                  <FlagCard country={topThree[2]} size="small" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}        {/* Completion Message */}
        {isComplete && (
          <motion.div 
            className="text-center mt-12 sm:mt-16 p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="text-4xl sm:text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              🎉
            </motion.div>
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              Congratulations!
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
            >
              You&apos;ve successfully ranked all {favorites.length} countries!
            </motion.p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
