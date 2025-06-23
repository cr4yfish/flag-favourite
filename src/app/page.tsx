'use client';

import { useState } from 'react';
import { countries } from '@/data/countries';
import { useFlagSorting, RankedCountry } from '@/hooks/useFlagSorting';
import FlagCard from '@/components/FlagCard';
import ProgressBar from '@/components/ProgressBar';

export default function Home() {
  const [view, setView] = useState<'start' | 'sorting' | 'results'>('start');
  const {
    favorites,
    currentComparison,
    isComplete,
    startSorting,
    makeChoice,
    reset,
    skipComparison,
    progress
  } = useFlagSorting(countries);

  const handleStart = () => {
    startSorting();
    setView('sorting');
  };

  const handleChoice = (country: RankedCountry) => {
    makeChoice(country);
    if (isComplete) {
      setView('results');
    }
  };

  const handleReset = () => {
    reset();
    setView('start');
  };

  const handleViewResults = () => {
    setView('results');
  };

  if (view === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              🏆 Flag Favorites
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Sort through world flags to discover your favorites!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  How it works:
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">1.</span>
                    Choose between two flag cards
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">2.</span>
                    Build your personal ranking
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">3.</span>
                    Discover your top favorite flags
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <FlagCard country={countries[0]} size="small" />
                  <FlagCard country={countries[1]} size="small" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{countries.length}</span> countries ready to sort
            </div>
            
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Start Sorting 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'sorting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Choose Your Favorite
            </h1>
            <ProgressBar 
              current={progress.ranked} 
              total={progress.total} 
              label="Countries Ranked"
            />
          </div>

          {/* Comparison Cards */}
          {currentComparison && (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="transform hover:scale-102 transition-transform">
                <FlagCard
                  country={currentComparison[0]}
                  onClick={() => handleChoice(currentComparison[0])}
                  size="large"
                />
              </div>
              
              <div className="transform hover:scale-102 transition-transform">
                <FlagCard
                  country={currentComparison[1]}
                  onClick={() => handleChoice(currentComparison[1])}
                  size="large"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={skipComparison}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
              disabled={!currentComparison}
            >
              Skip This Comparison
            </button>
            
            <button
              onClick={handleViewResults}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
              disabled={favorites.length === 0}
            >
              View Current Results ({favorites.length})
            </button>
            
            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Stats */}
          <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div>
                <div className="text-2xl font-bold text-blue-500">{progress.ranked}</div>
                <div className="text-sm">Ranked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{progress.remaining}</div>
                <div className="text-sm">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{progress.total}</div>
                <div className="text-sm">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              🏆 Your Flag Rankings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {favorites.length > 0 
                ? `You've ranked ${favorites.length} countries so far!`
                : 'No rankings yet. Start sorting to see your favorites!'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setView('sorting')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
            >
              {favorites.length > 0 ? 'Continue Sorting' : 'Start Sorting'}
            </button>
            
            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
            >
              Start Over
            </button>
          </div>

          {/* Results Grid */}
          {favorites.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites
                .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                .map((country) => (
                  <div key={country.code} className="relative">
                    <FlagCard
                      country={country}
                      showRank={true}
                      size="medium"
                      className="h-full"
                    />
                  </div>
                ))}
            </div>
          )}

          {/* Top 3 Podium */}
          {favorites.length >= 3 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                🥇 Top 3 Favorites
              </h2>
              
              <div className="flex justify-center items-end gap-4 max-w-4xl mx-auto">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="bg-gradient-to-t from-gray-300 to-gray-400 p-4 rounded-t-lg mb-4 h-24 flex items-end">
                    <div className="w-full text-white font-bold text-lg">2nd</div>
                  </div>
                  <FlagCard country={favorites[1]} size="medium" />
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="bg-gradient-to-t from-yellow-400 to-yellow-500 p-4 rounded-t-lg mb-4 h-32 flex items-end">
                    <div className="w-full text-white font-bold text-xl">1st</div>
                  </div>
                  <FlagCard country={favorites[0]} size="large" />
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="bg-gradient-to-t from-amber-600 to-amber-700 p-4 rounded-t-lg mb-4 h-20 flex items-end">
                    <div className="w-full text-white font-bold">3rd</div>
                  </div>
                  <FlagCard country={favorites[2]} size="medium" />
                </div>
              </div>
            </div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <div className="text-center mt-16 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Congratulations!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You&apos;ve successfully ranked all {favorites.length} countries!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
