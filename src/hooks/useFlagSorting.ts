'use client';

import { useState, useCallback } from 'react';
import { Country } from '@/data/countries';

export interface RankedCountry extends Country {
  rank?: number;
}

export function useFlagSorting(initialCountries: Country[]) {
  const [countries] = useState<RankedCountry[]>(
    initialCountries.map(country => ({ ...country }))
  );
  const [favorites, setFavorites] = useState<RankedCountry[]>([]);
  const [currentComparison, setCurrentComparison] = useState<[RankedCountry, RankedCountry] | null>(null);
  const [unrankedCountries, setUnrankedCountries] = useState<RankedCountry[]>(
    initialCountries.map(country => ({ ...country }))
  );
  const [isComplete, setIsComplete] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startSorting = useCallback(() => {
    const shuffled = shuffleArray(countries);
    setUnrankedCountries(shuffled);
    setFavorites([]);
    setIsComplete(false);
    
    if (shuffled.length >= 2) {
      setCurrentComparison([shuffled[0], shuffled[1]]);
    }
  }, [countries]);

  const makeChoice = useCallback((chosenCountry: RankedCountry) => {
    if (!currentComparison) return;

    const [country1, country2] = currentComparison;
    const winner = chosenCountry;
    const loser = winner === country1 ? country2 : country1;

    // Add winner to favorites
    const newFavorites = [...favorites, { ...winner, rank: favorites.length + 1 }];
    setFavorites(newFavorites);

    // Remove both countries from unranked
    const remainingUnranked = unrankedCountries.filter(
      c => c.code !== country1.code && c.code !== country2.code
    );

    // Add loser back to the end of unranked list for another chance
    if (remainingUnranked.length > 0) {
      remainingUnranked.push(loser);
    }

    setUnrankedCountries(remainingUnranked);

    // Set next comparison
    if (remainingUnranked.length >= 2) {
      setCurrentComparison([remainingUnranked[0], remainingUnranked[1]]);
    } else if (remainingUnranked.length === 1) {
      // Last country automatically goes to favorites
      setFavorites([...newFavorites, { ...remainingUnranked[0], rank: newFavorites.length + 1 }]);
      setCurrentComparison(null);
      setIsComplete(true);
      setUnrankedCountries([]);
    } else {
      setCurrentComparison(null);
      setIsComplete(true);
    }
  }, [currentComparison, favorites, unrankedCountries]);

  const reset = useCallback(() => {
    setFavorites([]);
    setUnrankedCountries(countries.map(country => ({ ...country })));
    setCurrentComparison(null);
    setIsComplete(false);
  }, [countries]);

  const skipComparison = useCallback(() => {
    if (!currentComparison) return;

    const [country1, country2] = currentComparison;
    
    // Remove current comparison from unranked
    const remainingUnranked = unrankedCountries.filter(
      c => c.code !== country1.code && c.code !== country2.code
    );

    // Add both countries back to the end for later comparison
    remainingUnranked.push(country1, country2);
    setUnrankedCountries(remainingUnranked);

    // Set next comparison
    if (remainingUnranked.length >= 2) {
      setCurrentComparison([remainingUnranked[0], remainingUnranked[1]]);
    } else {
      setCurrentComparison(null);
      setIsComplete(true);
    }
  }, [currentComparison, unrankedCountries]);

  return {
    favorites,
    currentComparison,
    unrankedCountries,
    isComplete,
    startSorting,
    makeChoice,
    reset,
    skipComparison,
    progress: {
      total: countries.length,
      ranked: favorites.length,
      remaining: unrankedCountries.length
    }
  };
}
