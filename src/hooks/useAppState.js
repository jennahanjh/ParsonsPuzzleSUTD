import { useState, useEffect } from 'react';
import { usePuzzles, useApiHealth } from './usePuzzles';
import { ALL_PUZZLES } from '../puzzles/index';

export const useAppState = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [useLocalData, setUseLocalData] = useState(false);
  
  // API data and health check
  const { puzzles: apiPuzzles, loading: puzzlesLoading, error: puzzlesError } = usePuzzles();
  const { isHealthy: apiHealthy, loading: healthLoading } = useApiHealth();
  
  // Determine which puzzle data to use
  const puzzles = useLocalData || !apiHealthy || puzzlesError ? ALL_PUZZLES : apiPuzzles;
  const isUsingApi = !useLocalData && apiHealthy && !puzzlesError && apiPuzzles.length > 0;

  // Set initial puzzle when data loads
  useEffect(() => {
    if (puzzles.length > 0 && !currentPuzzle) {
      setCurrentPuzzle(puzzles[0]);
    }
  }, [puzzles, currentPuzzle]);

  const handlePuzzleChange = (event) => {
    const puzzleId = event.target.value;
    const puzzle = puzzles.find(p => p.id === puzzleId);
    setCurrentPuzzle(puzzle);
  };

  const handleNextPuzzle = () => {
    const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id);
    const nextIndex = (currentIndex + 1) % puzzles.length;
    setCurrentPuzzle(puzzles[nextIndex]);
  };

  const toggleDataSource = () => {
    setUseLocalData(!useLocalData);
    // Reset to first puzzle when switching data sources
    if (puzzles.length > 0) {
      setCurrentPuzzle(puzzles[0]);
    }
  };

  // Derived state
  const currentPuzzleIndex = puzzles.findIndex(p => p.id === currentPuzzle?.id);
  const isLastPuzzle = currentPuzzleIndex === puzzles.length - 1;
  const isLoading = (puzzlesLoading || healthLoading) && !useLocalData;

  return {
    // State
    currentPuzzle,
    useLocalData,
    puzzles,
    isUsingApi,
    
    // Loading states
    isLoading,
    healthLoading,
    puzzlesError,
    
    // Derived state
    isLastPuzzle,
    
    // Handlers
    handlePuzzleChange,
    handleNextPuzzle,
    toggleDataSource
  };
};
