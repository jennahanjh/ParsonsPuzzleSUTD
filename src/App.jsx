import React, { useState } from 'react';
import PuzzleDisplay from './components/PuzzleDisplay';
import { ALL_PUZZLES } from './puzzles/index';
import './App.css';

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(ALL_PUZZLES[0]);

  const handlePuzzleChange = (event) => {
    const puzzleId = event.target.value;
    const puzzle = ALL_PUZZLES.find(p => p.id === puzzleId);
    setCurrentPuzzle(puzzle);
  };

  const handleNextPuzzle = () => {
    const currentIndex = ALL_PUZZLES.findIndex(p => p.id === currentPuzzle.id);
    const nextIndex = (currentIndex + 1) % ALL_PUZZLES.length; // Wrap around to first puzzle if at end
    setCurrentPuzzle(ALL_PUZZLES[nextIndex]);
  };

  const currentPuzzleIndex = ALL_PUZZLES.findIndex(p => p.id === currentPuzzle.id);
  const isLastPuzzle = currentPuzzleIndex === ALL_PUZZLES.length - 1;

  // Helper function to clean up LaTeX for display in select options
  const cleanTitle = (title) => {
    return title
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>Parson's Puzzles for Math Proofs</h1>
          <p>Practice formal mathematical proofs through interactive drag-and-drop puzzles</p>
        </header>

        <nav className="puzzle-nav">
          <div className="puzzle-selector">
            <label htmlFor="puzzle">Select Puzzle: </label>
            <select 
              id="puzzle"
              value={currentPuzzle.id} 
              onChange={handlePuzzleChange}
            >
              {ALL_PUZZLES.map(puzzle => (
                <option key={puzzle.id} value={puzzle.id}>
                  {puzzle.displayTitle || cleanTitle(puzzle.title)}
                </option>
              ))}
            </select>
          </div>
        </nav>

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
        </footer>
      </div>
    </div>
  );
}

export default App;