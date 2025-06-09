import React from 'react';
import PuzzleDisplay from './components/PuzzleDisplay';
import { N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED as currentPuzzle } from './puzzles/bigOProofs';
import './App.css'; // For any global app styles

// Don't forget to import KaTeX CSS if you haven't put it in main.jsx
// import 'katex/dist/katex.min.css'; 

function App() {
  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>Parson's Puzzles for Math Proofs</h1>
        </header>
        <main className="main-content">
          <PuzzleDisplay puzzle={currentPuzzle} />
        </main>
      </div>
    </div>
  );
}

export default App;