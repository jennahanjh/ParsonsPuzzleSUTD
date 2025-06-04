import React from 'react';
import KatexRenderer from './KatexRenderer';
import './ProofBlock.css'; // We'll create this for styling

const ProofBlock = ({ id, latexContent }) => {
  return (
    <div className="proof-block" data-id={id}>
      <KatexRenderer latex={latexContent} />
    </div>
  );
};

export default ProofBlock;