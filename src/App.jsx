import React, { useState } from 'react';
import PuzzleDisplay from './components/PuzzleDisplay';
import { N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED } from './puzzles/bigOProofs';
import './App.css';

// Additional puzzles - you can add these to separate files later
const LOG_N_IS_O_N = {
  id: 'proof2',
  title: '\\text{Prove } \\log n = O(n)',
  statement: '\\log n = O(n)',
  blocks: [
    { id: 'block2-1', latex: '\\text{To show } f(n) = O(g(n)) \\text{, we need to find positive constants } c \\text{ and } n_0 \\text{ such that } 0 \\le f(n) \\le cg(n) \\text{ for all } n \\ge n_0.' },
    { id: 'block2-2', latex: '\\text{Consider } f(n) = \\log n \\text{ and } g(n) = n.' },
    { id: 'block2-3', latex: '\\text{We know that } \\log n < n \\text{ for all } n \\ge 1.' },
    { id: 'block2-4', latex: '\\text{This can be proven by observing that the exponential function grows faster than any polynomial.}' },
    { id: 'block2-5', latex: '\\text{Therefore, } \\log n \\le 1 \\cdot n \\text{ for all } n \\ge 1.' },
    { id: 'block2-6', latex: '\\text{So, } c = 1 \\text{ and } n_0 = 1 \\text{ satisfy the definition.}' },
    { id: 'block2-7', latex: '\\text{Therefore, } \\log n = O(n).' },
  ],
  solutionOrder: ['block2-1', 'block2-2', 'block2-3', 'block2-4', 'block2-5', 'block2-6', 'block2-7']
};

const SUM_OF_FIRST_N_INTEGERS = {
  id: 'induction1',
  title: '\\text{Prove by induction: } \\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}',
  statement: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}',
  blocks: [
    { id: 'ind1-1', latex: '\\text{Proof by induction on } n \\ge 1.' },
    { id: 'ind1-2', latex: '\\textbf{Base case: } n = 1' },
    { id: 'ind1-3', latex: '\\text{LHS: } \\sum_{i=1}^{1} i = 1' },
    { id: 'ind1-4', latex: '\\text{RHS: } \\frac{1(1+1)}{2} = \\frac{2}{2} = 1' },
    { id: 'ind1-5', latex: '\\text{LHS = RHS, so the base case holds.}' },
    { id: 'ind1-6', latex: '\\textbf{Inductive step: } \\text{Assume the statement holds for } n = k \\text{, i.e., } \\sum_{i=1}^{k} i = \\frac{k(k+1)}{2}' },
    { id: 'ind1-7', latex: '\\text{We need to prove it holds for } n = k+1 \\text{, i.e., } \\sum_{i=1}^{k+1} i = \\frac{(k+1)(k+2)}{2}' },
    { id: 'ind1-8', latex: '\\text{LHS: } \\sum_{i=1}^{k+1} i = \\sum_{i=1}^{k} i + (k+1)' },
    { id: 'ind1-9', latex: '\\text{By the inductive hypothesis: } = \\frac{k(k+1)}{2} + (k+1)' },
    { id: 'ind1-10', latex: '= \\frac{k(k+1)}{2} + \\frac{2(k+1)}{2} = \\frac{k(k+1) + 2(k+1)}{2}' },
    { id: 'ind1-11', latex: '= \\frac{(k+1)(k+2)}{2} = \\text{RHS}' },
    { id: 'ind1-12', latex: '\\text{Therefore, by mathematical induction, the statement holds for all } n \\ge 1.' },
  ],
  solutionOrder: ['ind1-1', 'ind1-2', 'ind1-3', 'ind1-4', 'ind1-5', 'ind1-6', 'ind1-7', 'ind1-8', 'ind1-9', 'ind1-10', 'ind1-11', 'ind1-12']
};

const DISTRIBUTIVE_LAW_SETS = {
  id: 'set1',
  title: '\\text{Prove: } A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)',
  statement: 'A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)',
  blocks: [
    { id: 'set1-1', latex: '\\text{To prove set equality, we show that each side is a subset of the other.}' },
    { id: 'set1-2', latex: '\\textbf{Part 1: } A \\cap (B \\cup C) \\subseteq (A \\cap B) \\cup (A \\cap C)' },
    { id: 'set1-3', latex: '\\text{Let } x \\in A \\cap (B \\cup C).' },
    { id: 'set1-4', latex: '\\text{Then } x \\in A \\text{ and } x \\in (B \\cup C).' },
    { id: 'set1-5', latex: '\\text{Since } x \\in (B \\cup C) \\text{, either } x \\in B \\text{ or } x \\in C \\text{ (or both).}' },
    { id: 'set1-6', latex: '\\text{Case 1: If } x \\in B \\text{, then since } x \\in A \\text{, we have } x \\in A \\cap B.' },
    { id: 'set1-7', latex: '\\text{Case 2: If } x \\in C \\text{, then since } x \\in A \\text{, we have } x \\in A \\cap C.' },
    { id: 'set1-8', latex: '\\text{In either case, } x \\in (A \\cap B) \\cup (A \\cap C).' },
    { id: 'set1-9', latex: '\\textbf{Part 2: } (A \\cap B) \\cup (A \\cap C) \\subseteq A \\cap (B \\cup C)' },
    { id: 'set1-10', latex: '\\text{Let } x \\in (A \\cap B) \\cup (A \\cap C).' },
    { id: 'set1-11', latex: '\\text{Then either } x \\in A \\cap B \\text{ or } x \\in A \\cap C \\text{ (or both).}' },
    { id: 'set1-12', latex: '\\text{Case 1: If } x \\in A \\cap B \\text{, then } x \\in A \\text{ and } x \\in B \\text{, so } x \\in A \\text{ and } x \\in B \\cup C.' },
    { id: 'set1-13', latex: '\\text{Case 2: If } x \\in A \\cap C \\text{, then } x \\in A \\text{ and } x \\in C \\text{, so } x \\in A \\text{ and } x \\in B \\cup C.' },
    { id: 'set1-14', latex: '\\text{In either case, } x \\in A \\cap (B \\cup C).' },
    { id: 'set1-15', latex: '\\text{Therefore, } A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C).' },
  ],
  solutionOrder: ['set1-1', 'set1-2', 'set1-3', 'set1-4', 'set1-5', 'set1-6', 'set1-7', 'set1-8', 'set1-9', 'set1-10', 'set1-11', 'set1-12', 'set1-13', 'set1-14', 'set1-15']
};

// All available puzzles
const ALL_PUZZLES = [
  N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED,
  LOG_N_IS_O_N,
  SUM_OF_FIRST_N_INTEGERS,
  DISTRIBUTIVE_LAW_SETS
];

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(ALL_PUZZLES[0]);

  const handlePuzzleChange = (event) => {
    const puzzleId = event.target.value;
    const puzzle = ALL_PUZZLES.find(p => p.id === puzzleId);
    setCurrentPuzzle(puzzle);
  };

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
                  {cleanTitle(puzzle.title)}
                </option>
              ))}
            </select>
          </div>
        </nav>

        <main className="main-content">
          <PuzzleDisplay puzzle={currentPuzzle} />
        </main>

        <footer className="app-footer">
          <p>SUTD 50.004 Algorithms - Interactive Learning Tool</p>
        </footer>
      </div>
    </div>
  );
}

export default App;