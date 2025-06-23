'use client';

import { useState, useEffect } from 'react';
import { countries, getCountriesByContinent, Continent, Country } from '@/data/countries';
import { useFlagSorting, RankedCountry } from '@/hooks/useFlagSorting';
import { generateShareUrl, generateShareDescription } from '@/utils/shareRankings';

export type AppView = 'start' | 'continent-select' | 'sorting' | 'results';

/**
 * useAppState Hook
 * 
 * Central state management for the Flag Favorites application.
 * Handles view navigation, continent selection, progress tracking, and sharing functionality.
 * 
 * Features:
 * - View state management with smooth transitions
 * - Continent filtering with validation
 * - Saved progress detection and restoration
 * - Choice processing with debouncing
 * - Sharing functionality with fallbacks
 * - Comprehensive reset functionality
 * 
 * @returns {Object} App state and handlers
 */
export function useAppState() {
  // View and UI state
  const [view, setView] = useState<AppView>('start');
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [isProcessingChoice, setIsProcessingChoice] = useState(false);
  
  // Continent filtering state
  const [selectedContinents, setSelectedContinents] = useState<Continent[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);

  // Initialize flag sorting with filtered countries
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

  /**
   * Check for existing saved progress on component mount
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('flag-favourite-progress');
        if (saved) {
          const parsedState = JSON.parse(saved);
          // Check if there's meaningful progress
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

  /**
   * Navigate to continent selection view
   */
  const handleStart = () => {
    setView('continent-select');
  };

  /**
   * Resume from saved progress, determining appropriate view
   */
  const handleResume = () => {
    if (isComplete) {
      setView('results');
    } else if (currentComparison || favorites.length > 0) {
      setView('sorting');
    } else {
      handleStart();
    }
  };

  /**
   * Handle continent selection toggle
   */
  const handleContinentToggle = (continent: Continent) => {
    setSelectedContinents(prev => 
      prev.includes(continent) 
        ? prev.filter(c => c !== continent)
        : [...prev, continent]
    );
  };

  /**
   * Select all available continents
   */
  const handleSelectAllContinents = () => {
    setSelectedContinents([
      'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'
    ]);
  };

  /**
   * Clear continent selection
   */
  const handleSelectNoContinents = () => {
    setSelectedContinents([]);
  };

  /**
   * Apply continent filter and start sorting
   */
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

  /**
   * Handle flag choice with debouncing to prevent rapid clicks
   */
  const handleChoice = (country: RankedCountry) => {
    if (isProcessingChoice) return;
    
    setIsProcessingChoice(true);
    makeChoice(country);
    
    // Reset processing flag after delay
    setTimeout(() => {
      setIsProcessingChoice(false);
    }, 300);
    
    // Navigate to results if sorting is complete
    if (isComplete) {
      setView('results');
    }
  };

  /**
   * Navigate to results view
   */
  const handleViewResults = () => {
    setView('results');
  };

  /**
   * Handle sharing functionality with fallbacks
   */
  const handleShare = async () => {
    if (favorites.length === 0) return;

    const shareUrl = generateShareUrl(favorites);
    const shareDescription = generateShareDescription(favorites);

    if (navigator.share) {
      // Use native sharing if available (mobile devices)
      try {
        await navigator.share({
          title: 'My Flag Favorites Ranking',
          text: shareDescription,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or sharing failed, fall back to clipboard
        if (err instanceof Error && err.name !== 'AbortError') {
          await copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fall back to clipboard copy
      await copyToClipboard(shareUrl);
    }
  };

  /**
   * Copy text to clipboard with fallback for older browsers
   */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share link copied to clipboard!');
    }
  };

  /**
   * Reset all application state
   */
  const handleReset = () => {
    reset();
    setView('start');
    setHasSavedProgress(false);
    setSelectedContinents([]);
    setFilteredCountries(countries);
    setIsProcessingChoice(false);
  };

  return {
    // View state
    view,
    setView,
    hasSavedProgress,
    
    // Continent selection
    selectedContinents,
    filteredCountries,
    
    // Sorting state
    favorites,
    currentComparison,
    isComplete,
    progress,
    isProcessingChoice,
    
    // Navigation handlers
    handleStart,
    handleResume,
    
    // Continent handlers
    handleContinentToggle,
    handleSelectAllContinents,
    handleSelectNoContinents,
    handleContinentSelection,
    
    // Sorting handlers
    handleChoice,
    skipComparison,
    handleViewResults,
    
    // Action handlers
    handleShare,
    handleReset,
  };
}
