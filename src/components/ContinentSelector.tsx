'use client';

import { motion } from 'framer-motion';
import { getContinentStats, Continent } from '@/data/countries';

interface ContinentSelectorProps {
  selectedContinents: Continent[];
  onContinentToggle: (continent: Continent) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

const continentEmojis: Record<Continent, string> = {
  'Africa': '🌍',
  'Asia': '🌏',
  'Europe': '🇪🇺',
  'North America': '🌎',
  'South America': '🌎',
  'Oceania': '🏝️'
};

export default function ContinentSelector({ 
  selectedContinents, 
  onContinentToggle, 
  onSelectAll,
}: ContinentSelectorProps) {
  const continentStats = getContinentStats();
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.h2 
        className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Choose Continents to Sort
      </motion.h2>
      
      <motion.p 
        className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Select which continents you&apos;d like to include in your flag sorting. 
        You can choose one or more continents to focus on specific regions.
      </motion.p>      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {continentStats.map((stat, index) => {
          const isSelected = selectedContinents.includes(stat.continent);
          
          return (
            <motion.button
              key={stat.continent}
              onClick={() => onContinentToggle(stat.continent)}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                {continentEmojis[stat.continent]}
              </div>
              <div className="font-semibold text-sm sm:text-lg mb-1">
                {stat.continent}
              </div>
              <div className="text-xs sm:text-sm opacity-75">
                {stat.count} countries
              </div>
              {isSelected && (
                <motion.div 
                  className="mt-1 sm:mt-2 text-blue-500 text-xs sm:text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  ✓ Selected
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>      <motion.div 
        className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          onClick={onSelectAll}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="block sm:hidden">
            Select All ({continentStats.reduce((sum, c) => sum + c.count, 0)})
          </span>
          <span className="hidden sm:block">
            Select All ({continentStats.reduce((sum, c) => sum + c.count, 0)} countries)
          </span>
        </motion.button>
      </motion.div>

      {/* {selectedContinents.length > 0 && (
        <motion.div 
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center text-blue-700 dark:text-blue-300">
            <span className="font-semibold">
              {selectedContinents.reduce((sum, continent) => 
                sum + (continentStats.find(c => c.continent === continent)?.count || 0), 0
              )} countries selected
            </span>
            <div className="text-sm mt-1">
              from {selectedContinents.join(', ')}
            </div>
          </div>
        </motion.div>
      )} */}
    </motion.div>
  );
}
