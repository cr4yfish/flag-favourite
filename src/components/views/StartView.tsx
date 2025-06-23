'use client';

import { motion } from 'framer-motion';
import { countries } from '@/data/countries';
import FlagCard from '@/components/FlagCard';

interface StartViewProps {
  hasSavedProgress: boolean;
  onStart: () => void;
  onResume: () => void;
}

/**
 * StartView Component
 * 
 * Displays the welcome screen with app introduction, features overview,
 * and options to start fresh or resume saved progress.
 * 
 * Features:
 * - Animated introduction with step-by-step instructions
 * - Flag preview cards showing example flags
 * - Conditional resume/start buttons based on saved progress
 * - Responsive design with gradient background
 */
export default function StartView({ hasSavedProgress, onStart, onResume }: StartViewProps) {
  const instructionSteps = [
    'Choose between two flag cards',
    'Build your personal ranking', 
    'Discover your top favorite flags'
  ];
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center px-2 sm:px-0">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          >
            🏆 Flag Favorites
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sort through world flags to discover your favorites!
          </motion.p>
        </motion.div>        {/* How It Works Section */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <motion.div 
              className="text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                How it works:
              </h2>
              <ul className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {instructionSteps.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <span className="text-blue-500 mr-2">{index + 1}.</span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
              {/* Flag Preview */}
            <motion.div 
              className="flex justify-center mt-6 md:mt-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-[280px] sm:max-w-none">
                <FlagCard country={countries[0]} size="small" />
                <FlagCard country={countries[1]} size="small" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >          {/* Country Count */}
          <motion.div 
            className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 1.1 }}
          >
            <span className="font-semibold">{countries.length}</span> countries ready to sort
          </motion.div>
          
          {/* Saved Progress Section */}
          {hasSavedProgress && (
            <motion.div 
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
            >
              <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-2">
                💾 You have saved progress! You can continue where you left off.
              </p>              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <motion.button
                  onClick={onResume}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Resume Progress
                </motion.button>
                <motion.button
                  onClick={onStart}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Fresh
                </motion.button>
              </div>
            </motion.div>
          )}
            {/* Start Button */}
          {!hasSavedProgress && (
            <motion.button
              onClick={onStart}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg w-full sm:w-auto max-w-sm mx-auto"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 1.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Sorting 🚀
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
