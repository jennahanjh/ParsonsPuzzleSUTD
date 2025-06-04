import React from 'react';
import ProofBlock from './ProofBlock';
import KatexRenderer from './KatexRenderer';
import './PuzzleDisplay.css';

const PuzzleDisplay = ({ puzzle }) => {
  if (!puzzle) {
    return <p>Loading puzzle...</p>;
  }

  // For now, just display all blocks. Later, this will be the palette.
  const availableBlocks = puzzle.blocks;

  return (
    <div className="puzzle-container">
      {/* Changed h2 to only use KatexRenderer with puzzle.title */}
      <h1><KatexRenderer latex={puzzle.title} /></h1>
      
      {/* <p><strong>Prove: <KatexRenderer latex={puzzle.statement} /></strong></p> */}
      
      <div className="puzzle-palette">
        <h3>Available Steps:</h3>
        {availableBlocks.map(block => (
          <ProofBlock key={block.id} id={block.id} latexContent={block.latex} />
        ))}
      </div>

      <div className="puzzle-workspace">
        <h3>Your Proof (Drag steps here later):</h3>
        {/* This area will be for dropping blocks */}
      </div>
    </div>
  );
};

export default PuzzleDisplay;