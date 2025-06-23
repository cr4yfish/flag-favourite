'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries, getCountriesByContinent, Continent } from '@/data/countries';
import { useFlagSorting, RankedCountry } from '@/hooks/useFlagSorting';
import FlagCard from '@/components/FlagCard';
import ProgressBar from '@/components/ProgressBar';
import ContinentSelector from '@/components/ContinentSelector';

export default function Home() {
  const [view, setView] = useState<'start' | 'continent-select' | 'sorting' | 'results'>('start');
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [selectedContinents, setSelectedContinents] = useState<Continent[]>([]);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isProcessingChoice, setIsProcessingChoice] = useState(false);
  
  const {
    favorites,
    currentComparison,
    isComplete,
    startSorting,
    makeChoice,
    reset,
    skipComparison,
    progress
  } = useFlagSorting(filteredCountries);

  // Check for saved progress on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('flag-favourite-progress');
        if (saved) {
          const parsedState = JSON.parse(saved);
          // Check if there's meaningful progress (some favorites or active comparison)
          setHasSavedProgress(
            parsedState.favorites?.length > 0 || 
            parsedState.currentComparison !== null ||
            parsedState.isComplete
          );
        }
      } catch (error) {
        console.warn('Failed to check saved progress:', error);
      }
    }
  }, []);
  const handleStart = () => {
    setView('continent-select');
  };

  const handleContinentSelection = () => {
    if (selectedContinents.length === 0) {
      // If no continents selected, use all countries
      setFilteredCountries(countries);
    } else {
      // Filter countries by selected continents
      const filtered = selectedContinents.flatMap(continent => 
        getCountriesByContinent(continent)
      );
      setFilteredCountries(filtered);
    }
    startSorting();
    setView('sorting');
  };

  const handleContinentToggle = (continent: Continent) => {
    setSelectedContinents(prev => 
      prev.includes(continent) 
        ? prev.filter(c => c !== continent)
        : [...prev, continent]
    );
  };

  const handleSelectAllContinents = () => {
    setSelectedContinents(['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']);
  };

  const handleSelectNoContinents = () => {
    setSelectedContinents([]);
  };
  const handleResume = () => {
    // If there's saved progress, just switch to the appropriate view
    if (isComplete) {
      setView('results');
    } else if (currentComparison || favorites.length > 0) {
      setView('sorting');
    } else {
      handleStart();
    }
  };
  const handleChoice = (country: RankedCountry) => {
    if (isProcessingChoice) return; // Prevent rapid clicking
    
    setIsProcessingChoice(true);
    makeChoice(country);
    
    // Reset the processing flag after a short delay
    setTimeout(() => {
      setIsProcessingChoice(false);
    }, 300);
    
    if (isComplete) {
      setView('results');
    }
  };
  const handleReset = () => {
    reset();
    setView('start');
    setHasSavedProgress(false);
    setSelectedContinents([]);
    setFilteredCountries(countries);
  };

  const handleViewResults = () => {
    setView('results');
  };

  if (view === 'start') {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-5xl font-bold text-gray-800 dark:text-white mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              🏆 Flag Favorites
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Sort through world flags to discover your favorites!
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div 
                className="text-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  How it works:
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  {['Choose between two flag cards', 'Build your personal ranking', 'Discover your top favorite flags'].map((item, index) => (
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
              
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <FlagCard country={countries[0]} size="small" />
                  <FlagCard country={countries[1]} size="small" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >            <motion.div 
              className="text-gray-600 dark:text-gray-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 1.1 }}
            >
              <span className="font-semibold">{countries.length}</span> countries ready to sort
            </motion.div>
            
            {hasSavedProgress && (
              <motion.div 
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
              >
                <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-2">
                  💾 You have saved progress! You can continue where you left off.
                </p>
                <div className="flex gap-2 justify-center">
                  <motion.button
                    onClick={handleResume}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resume Progress
                  </motion.button>
                  <motion.button
                    onClick={handleStart}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Fresh
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {!hasSavedProgress && (
              <motion.button
                onClick={handleStart}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg"
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

  if (view === 'continent-select') {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-5xl font-bold text-gray-800 dark:text-white mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              🌍 Choose Your Regions
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Select continents to focus your sorting experience
            </motion.p>
          </motion.div>

          <ContinentSelector
            selectedContinents={selectedContinents}
            onContinentToggle={handleContinentToggle}
            onSelectAll={handleSelectAllContinents}
            onSelectNone={handleSelectNoContinents}
          />

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={handleContinentSelection}
              disabled={selectedContinents.length === 0}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 1.2 }}
              whileHover={selectedContinents.length > 0 ? { scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}}
              whileTap={selectedContinents.length > 0 ? { scale: 0.95 } : {}}
            >
              {selectedContinents.length === 0 ? 'Select at least one continent' : 'Start Sorting Selected Regions 🚀'}
            </motion.button>

            <motion.button
              onClick={() => setView('start')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Start
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (view === 'sorting') {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
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
          </motion.div>          {/* Comparison Cards */}
          <AnimatePresence mode="wait">
            {currentComparison && (
              <motion.div 
                key={`${currentComparison[0].code}-${currentComparison[1].code}`}
                className="grid md:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                >
                  <FlagCard
                    country={currentComparison[1]}
                    onClick={() => handleChoice(currentComparison[1])}
                    size="large"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { text: "Skip This Comparison", onClick: skipComparison, disabled: !currentComparison, color: "bg-gray-500 hover:bg-gray-600" },
              { text: `View Current Results (${favorites.length})`, onClick: handleViewResults, disabled: favorites.length === 0, color: "bg-green-500 hover:bg-green-600" },
              { text: "Reset", onClick: handleReset, disabled: false, color: "bg-red-500 hover:bg-red-600" }
            ].map((button, index) => (
              <motion.button
                key={button.text}
                onClick={button.onClick}
                className={`${button.color} text-white font-semibold py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={button.disabled}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={!button.disabled ? { scale: 1.05 } : {}}
                whileTap={!button.disabled ? { scale: 0.95 } : {}}
              >
                {button.text}
              </motion.button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="text-center mt-8 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">              {[
                { value: progress.ranked, label: "Ranked", color: "text-blue-500" },
                { value: progress.remaining, label: "Remaining", color: "text-yellow-500" },
                { value: progress.total, label: "Total", color: "text-green-500" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <div 
                    className={`text-2xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (view === 'results') {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
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
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {favorites.length > 0 
                ? `You&apos;ve ranked ${favorites.length} countries so far!`
                : 'No rankings yet. Start sorting to see your favorites!'
              }
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { text: favorites.length > 0 ? 'Continue Sorting' : 'Start Sorting', onClick: () => setView('sorting'), color: "bg-blue-500 hover:bg-blue-600" },
              { text: "Start Over", onClick: handleReset, color: "bg-red-500 hover:bg-red-600" }
            ].map((button, index) => (
              <motion.button
                key={button.text}
                onClick={button.onClick}
                className={`${button.color} text-white font-semibold py-2 px-6 rounded-full transition-colors`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {button.text}
              </motion.button>
            ))}
          </motion.div>

          {/* Results Grid */}
          {favorites.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <AnimatePresence>
                {favorites
                  .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                  .map((country, index) => (
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
          )}

          {/* Top 3 Podium */}
          {favorites.length >= 3 && (
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
              >
                🥇 Top 3 Favorites
              </motion.h2>
              
              <div className="flex justify-center items-end gap-4 max-w-4xl mx-auto">
                {/* 2nd Place */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, type: "spring", stiffness: 150 }}
                >
                  <motion.div 
                    className="bg-gradient-to-t from-gray-300 to-gray-400 p-4 rounded-t-lg mb-4 h-24 flex items-end"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-full text-white font-bold text-lg">2nd</div>
                  </motion.div>
                  <FlagCard country={favorites[1]} size="medium" />
                </motion.div>

                {/* 1st Place */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 120 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, type: "spring", stiffness: 150 }}
                >
                  <motion.div 
                    className="bg-gradient-to-t from-yellow-400 to-yellow-500 p-4 rounded-t-lg mb-4 h-32 flex items-end"
                    whileHover={{ scale: 1.05 }}
                    animate={{ boxShadow: ["0 0 0 rgba(255,215,0,0.5)", "0 0 20px rgba(255,215,0,0.8)", "0 0 0 rgba(255,215,0,0.5)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-full text-white font-bold text-xl">1st</div>
                  </motion.div>
                  <FlagCard country={favorites[0]} size="large" />
                </motion.div>

                {/* 3rd Place */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, type: "spring", stiffness: 150 }}
                >
                  <motion.div 
                    className="bg-gradient-to-t from-amber-600 to-amber-700 p-4 rounded-t-lg mb-4 h-20 flex items-end"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-full text-white font-bold">3rd</div>
                  </motion.div>
                  <FlagCard country={favorites[2]} size="medium" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <motion.div 
              className="text-center mt-16 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, type: "spring", stiffness: 200 }}
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                🎉
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                Congratulations!
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300"
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

  return null;
}
