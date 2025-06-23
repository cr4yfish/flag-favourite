'use client';

import { motion } from 'framer-motion';
import { Continent } from '@/data/countries';
import ContinentSelector from '@/components/ContinentSelector';

interface ContinentSelectViewProps {
  selectedContinents: Continent[];
  onContinentToggle: (continent: Continent) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onContinue: () => void;
  onBack: () => void;
}

/**
 * ContinentSelectView Component
 * 
 * Handles continent/region selection for filtering the flag sorting experience.
 * Users can select one or more continents to focus their sorting on specific regions.
 * 
 * Features:
 * - Interactive continent selector with visual feedback
 * - Select all/none quick actions
 * - Validation to ensure at least one continent is selected
 * - Smooth animations and transitions
 * - Back navigation to start screen
 */
export default function ContinentSelectView({
  selectedContinents,
  onContinentToggle,
  onSelectAll,
  onSelectNone,
  onContinue,
}: ContinentSelectViewProps) {
  const hasSelection = selectedContinents.length > 0;
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8 overflow-x-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
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
            🌍 Choose Your Regions
          </motion.h1>
          {/* <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Select continents to focus your sorting experience
          </motion.p> */}
        </motion.div>

        {/* Continent Selector */}
        <ContinentSelector
          selectedContinents={selectedContinents}
          onContinentToggle={onContinentToggle}
          onSelectAll={onSelectAll}
          onSelectNone={onSelectNone}
        />

        {/* Action Buttons */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >          {/* Continue Button */}
          <motion.button
            onClick={onContinue}
            disabled={!hasSelection}
            className={`
              bg-gradient-to-r font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transition-all w-full sm:w-auto max-w-md mx-auto
              ${hasSelection 
                ? 'from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white' 
                : 'from-gray-400 to-gray-500 text-white cursor-not-allowed'
              }
            `}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            whileHover={hasSelection ? { scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}}
            whileTap={hasSelection ? { scale: 0.95 } : {}}
          >
            <span className="block sm:hidden">
              {hasSelection ? 'Start Sorting 🚀' : 'Select continent(s)'}
            </span>
            <span className="hidden sm:block">
              {hasSelection 
                ? 'Start Sorting Selected Regions 🚀' 
                : 'Select at least one continent'
              }
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
