'use client';

import { useState, useCallback, useEffect } from 'react';
import { Country } from '@/data/countries';

export interface RankedCountry extends Country {
  rank?: number;
}

interface SortingState {
  favorites: RankedCountry[];
  unrankedCountries: RankedCountry[];
  currentComparison: [RankedCountry, RankedCountry] | null;
  isComplete: boolean;
}

const STORAGE_KEY = 'flag-favourite-progress';

export function useFlagSorting(initialCountries: Country[]) {
  const [countries] = useState<RankedCountry[]>(
    initialCountries.map(country => ({ ...country }))
  );
  
  // Load initial state from localStorage or use defaults
  const loadInitialState = (): SortingState => {
    if (typeof window === 'undefined') {
      return {
        favorites: [],
        unrankedCountries: initialCountries.map(country => ({ ...country })),
        currentComparison: null,
        isComplete: false
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved) as SortingState;
        // Validate that the saved state has the same countries as our current list
        const savedCountryCodes = new Set([
          ...parsedState.favorites.map(c => c.code),
          ...parsedState.unrankedCountries.map(c => c.code),
          ...(parsedState.currentComparison?.map(c => c.code) || [])
        ]);
        const currentCountryCodes = new Set(initialCountries.map(c => c.code));
        
        // If country lists match, restore saved state
        if (savedCountryCodes.size === currentCountryCodes.size && 
            [...savedCountryCodes].every(code => currentCountryCodes.has(code))) {
          return parsedState;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved progress:', error);
    }

    // Default state if no valid saved state
    return {
      favorites: [],
      unrankedCountries: initialCountries.map(country => ({ ...country })),
      currentComparison: null,
      isComplete: false
    };
  };

  const [state, setState] = useState<SortingState>(loadInitialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save progress:', error);
      }
    }
  }, [state]);

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
    const newState: SortingState = {
      favorites: [],
      unrankedCountries: shuffled,
      currentComparison: shuffled.length >= 2 ? [shuffled[0], shuffled[1]] : null,
      isComplete: false
    };
    setState(newState);
  }, [countries]);

  const makeChoice = useCallback((chosenCountry: RankedCountry) => {
    setState(prevState => {
      if (!prevState.currentComparison) return prevState;

      const [country1, country2] = prevState.currentComparison;
      const winner = chosenCountry;
      const loser = winner === country1 ? country2 : country1;

      // Add winner to favorites
      const newFavorites = [...prevState.favorites, { ...winner, rank: prevState.favorites.length + 1 }];

      // Remove both countries from unranked
      const remainingUnranked = prevState.unrankedCountries.filter(
        c => c.code !== country1.code && c.code !== country2.code
      );

      // Add loser back to the end of unranked list for another chance
      if (remainingUnranked.length > 0) {
        remainingUnranked.push(loser);
      }

      // Determine next comparison and completion state
      let nextComparison: [RankedCountry, RankedCountry] | null = null;
      let isComplete = false;

      if (remainingUnranked.length >= 2) {
        nextComparison = [remainingUnranked[0], remainingUnranked[1]];
      } else if (remainingUnranked.length === 1) {
        // Last country automatically goes to favorites
        newFavorites.push({ ...remainingUnranked[0], rank: newFavorites.length + 1 });
        remainingUnranked.length = 0; // Clear the array
        isComplete = true;
      } else {
        isComplete = true;
      }

      return {
        favorites: newFavorites,
        unrankedCountries: remainingUnranked,
        currentComparison: nextComparison,
        isComplete
      };
    });
  }, []);

  const reset = useCallback(() => {
    const newState: SortingState = {
      favorites: [],
      unrankedCountries: countries.map(country => ({ ...country })),
      currentComparison: null,
      isComplete: false
    };
    setState(newState);
    
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear saved progress:', error);
      }
    }
  }, [countries]);

  const skipComparison = useCallback(() => {
    setState(prevState => {
      if (!prevState.currentComparison) return prevState;

      const [country1, country2] = prevState.currentComparison;
      
      // Remove current comparison from unranked
      const remainingUnranked = prevState.unrankedCountries.filter(
        c => c.code !== country1.code && c.code !== country2.code
      );

      // Add both countries back to the end for later comparison
      remainingUnranked.push(country1, country2);

      // Set next comparison
      let nextComparison: [RankedCountry, RankedCountry] | null = null;
      let isComplete = false;

      if (remainingUnranked.length >= 2) {
        nextComparison = [remainingUnranked[0], remainingUnranked[1]];
      } else {
        isComplete = true;
      }

      return {
        ...prevState,
        unrankedCountries: remainingUnranked,
        currentComparison: nextComparison,
        isComplete
      };
    });
  }, []);

  return {
    favorites: state.favorites,
    currentComparison: state.currentComparison,
    unrankedCountries: state.unrankedCountries,
    isComplete: state.isComplete,
    startSorting,
    makeChoice,
    reset,
    skipComparison,
    progress: {
      total: countries.length,
      ranked: state.favorites.length,
      remaining: state.unrankedCountries.length
    }
  };
}
