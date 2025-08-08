import React, { useState, useEffect } from 'react';
import { AlertTriangle, Globe, HardDrive } from 'lucide-react';
import PuzzleDisplay from './components/PuzzleDisplay';
import { usePuzzles, useApiHealth } from './hooks/usePuzzles';
import { ALL_PUZZLES } from './puzzles/index';
import './App.css';
import './styles/api.css';

function App() {
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

  // Handle loading state
  if ((puzzlesLoading || healthLoading) && !useLocalData) {
    return (
      <div className="App">
        <div className="container">
          <div className="loading-state">
            <h2>Loading puzzles...</h2>
            <p>Connecting to database...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where no puzzle is selected yet
  if (!currentPuzzle) {
    return (
      <div className="App">
        <div className="container">
          <div className="loading-state">
            <h2>No puzzles available</h2>
            <p>Please check your connection or try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePuzzleChange = (event) => {
    const puzzleId = event.target.value;
    const puzzle = puzzles.find(p => p.id === puzzleId);
    setCurrentPuzzle(puzzle);
  };

  const handleNextPuzzle = () => {
    const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id);
    const nextIndex = (currentIndex + 1) % puzzles.length; // Wrap around to first puzzle if at end
    setCurrentPuzzle(puzzles[nextIndex]);
  };

  const currentPuzzleIndex = puzzles.findIndex(p => p.id === currentPuzzle.id);
  const isLastPuzzle = currentPuzzleIndex === puzzles.length - 1;

  // Helper function to clean up LaTeX for display in select options
  const cleanTitle = (title) => {
    return title
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const toggleDataSource = () => {
    setUseLocalData(!useLocalData);
    // Reset to first puzzle when switching data sources
    if (puzzles.length > 0) {
      setCurrentPuzzle(puzzles[0]);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>Parson's Puzzles for Math Proofs</h1>
          <p>Practice formal mathematical proofs through interactive drag-and-drop puzzles</p>
        </header>

        {/* Unified control panel */}
        <div className="unified-control-panel">
          <div className="control-panel-status">
            {/* Data source indicator */}
            <span className={`status-badge ${isUsingApi ? 'api' : 'local'}`}>
              {isUsingApi ? (
                <>
                  <Globe size={14} />
                  Database
                </>
              ) : (
                <>
                  <HardDrive size={14} />
                  Local
                </>
              )}
              ({puzzles.length} puzzles)
            </span>
          </div>
          
          <div className="control-panel-center">
            {/* Toggle button */}
            {!healthLoading && (
              <button 
                className="toggle-data-source compact" 
                onClick={toggleDataSource}
                title={`Switch to ${useLocalData ? 'database' : 'local'} data`}
              >
                {useLocalData ? 'Use Database' : 'Use Local Data'}
              </button>
            )}
            
            {/* Puzzle selector */}
            <div className="puzzle-selector compact">
              <label htmlFor="puzzle">Select Puzzle: </label>
              <select 
                id="puzzle"
                value={currentPuzzle.id} 
                onChange={handlePuzzleChange}
              >
                {puzzles.map(puzzle => (
                  <option key={puzzle.id} value={puzzle.id}>
                    {puzzle.displayTitle || cleanTitle(puzzle.title)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="control-panel-actions">
            {/* Error tooltip trigger */}
            {puzzlesError && !useLocalData && (
              <div className="error-tooltip-wrapper">
                <span className="error-indicator" title="Connection Issues">
                  <AlertTriangle size={16} />
                </span>
                <div className="error-tooltip">
                  <div className="error-tooltip-arrow"></div>
                  <div className="error-tooltip-content">
                    <strong>Connection Issue</strong><br />
                    {puzzlesError}<br />
                    Using local data instead.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <main className="main-content">
          <PuzzleDisplay 
            key={currentPuzzle.id} 
            puzzle={currentPuzzle} 
            onNextPuzzle={handleNextPuzzle}
            isLastPuzzle={isLastPuzzle}
          />
        </main>

        <footer className="app-footer">
          <p>SUTD 50.004 Algorithms - Interactive Learning Tool</p>
          <p className="tech-info">
            {isUsingApi ? 'Connected to MongoDB Atlas' : 'Using local puzzle data'}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
