'use client';

import { useAppState } from '@/hooks/useAppState';
import { StartView, ContinentSelectView, SortingView, ResultsView } from '@/components/views';

/**
 * Home Page Component
 * 
 * Main application entry point that orchestrates the flag sorting experience.
 * Uses the useAppState hook for centralized state management and renders
 * different views based on the current application state.
 * 
 * Features:
 * - Clean view-based architecture with separate components
 * - Centralized state management via custom hook
 * - Smooth transitions between application states
 * - Modular and maintainable code structure
 */
export default function Home() {
  const {
    // View state
    view,
    hasSavedProgress,
    
    // Continent selection
    selectedContinents,
    
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
    setView,
  } = useAppState();

  // Render appropriate view based on current state
  switch (view) {
    case 'start':
      return (
        <StartView
          hasSavedProgress={hasSavedProgress}
          onStart={handleStart}
          onResume={handleResume}
        />
      );

    case 'continent-select':
      return (
        <ContinentSelectView
          selectedContinents={selectedContinents}
          onContinentToggle={handleContinentToggle}
          onSelectAll={handleSelectAllContinents}
          onSelectNone={handleSelectNoContinents}
          onContinue={handleContinentSelection}
          onBack={() => setView('start')}
        />
      );

    case 'sorting':
      return (
        <SortingView
          currentComparison={currentComparison}
          favorites={favorites}
          progress={progress}
          isProcessingChoice={isProcessingChoice}
          onChoice={handleChoice}
          onSkip={skipComparison}
          onViewResults={handleViewResults}
          onReset={handleReset}
        />
      );

    case 'results':
      return (
        <ResultsView
          favorites={favorites}
          isComplete={isComplete}
          onContinueSorting={() => setView('sorting')}
          onShare={handleShare}
          onReset={handleReset}
        />
      );

    default:
      return null;
  }
}
