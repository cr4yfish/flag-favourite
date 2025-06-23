'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { countries } from '@/data/countries';
import { decodeRankings } from '@/utils/shareRankings';
import { RankedCountry } from '@/hooks/useFlagSorting';
import FlagCard from '@/components/FlagCard';

export default function SharedRankingsPage() {
  const params = useParams();
  const router = useRouter();
  const [rankings, setRankings] = useState<RankedCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = params?.hash as string;
    
    if (!hash) {
      setError('No ranking data found');
      setLoading(false);
      return;
    }

    try {
      const decodedRankings = decodeRankings(hash);
      
      if (!decodedRankings) {
        setError('Invalid ranking data');
        setLoading(false);
        return;
      }

      // Map the decoded rankings to full country objects
      const fullRankings: RankedCountry[] = decodedRankings.map(({ code, rank }) => {
        const country = countries.find(c => c.code === code);
        if (!country) {
          throw new Error(`Country with code ${code} not found`);
        }
        return { ...country, rank };
      });

      setRankings(fullRankings);
    } catch (err) {
      console.error('Error decoding rankings:', err);
      setError('Failed to load ranking data');
    }
    
    setLoading(false);
  }, [params?.hash]);

  const handleCreateYourOwn = () => {
    router.push('/');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <motion.button
            onClick={handleCreateYourOwn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your Own Ranking
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
            🏆 Shared Flag Rankings
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Someone shared their flag favorites with you! ({rankings.length} countries ranked)
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleCreateYourOwn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your Own Ranking
          </motion.button>
          <motion.button
            onClick={handleCopyLink}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Copy Link
          </motion.button>
        </motion.div>

        {/* Rankings Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {rankings
            .sort((a, b) => (a.rank || 0) - (b.rank || 0))
            .map((country, index) => (
              <motion.div 
                key={country.code} 
                className="relative"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.8 + index * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <FlagCard
                  country={country}
                  showRank={true}
                  size="medium"
                  className="h-full"
                />
              </motion.div>
            ))}
        </motion.div>

        {/* Top 3 Podium */}
        {rankings.length >= 3 && (
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
                <FlagCard country={rankings[1]} size="medium" />
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
                <FlagCard country={rankings[0]} size="large" />
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
                <FlagCard country={rankings[2]} size="medium" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Want to create your own flag ranking?
          </p>
          <motion.button
            onClick={handleCreateYourOwn}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Ranking Flags 🚀
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
