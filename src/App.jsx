import React from 'react';
import { PuzzleDisplay, UnifiedControlPanel, LoadingState } from './components';
import { useAppState } from './hooks/useAppState';
import './App.css';
import './styles/legacy-api.css';

function App() {
  const {
    currentPuzzle,
    useLocalData,
    puzzles,
    isUsingApi,
    isLoading,
    healthLoading,
    puzzlesError,
    isLastPuzzle,
    handlePuzzleChange,
    handleNextPuzzle,
    toggleDataSource
  } = useAppState();

  // Handle loading state
  if (isLoading) {
    return (
      <LoadingState 
        title="Loading puzzles..."
        message="Connecting to database..."
      />
    );
  }

  // Handle case where no puzzle is selected yet
  if (!currentPuzzle) {
    return (
      <LoadingState 
        title="No puzzles available"
        message="Please check your connection or try refreshing the page."
      />
    );
  }

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>Parson's Puzzles for Math Proofs</h1>
          <p>Practice formal mathematical proofs through interactive drag-and-drop puzzles</p>
        </header>

        <UnifiedControlPanel
          isUsingApi={isUsingApi}
          puzzles={puzzles}
          currentPuzzle={currentPuzzle}
          useLocalData={useLocalData}
          onToggleDataSource={toggleDataSource}
          onPuzzleChange={handlePuzzleChange}
          healthLoading={healthLoading}
          puzzlesError={puzzlesError}
        />

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
