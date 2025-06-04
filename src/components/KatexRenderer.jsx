import React, { useEffect, useRef } from 'react';
import katex from 'katex';

const KatexRenderer = ({ latex }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false, // Set to true if you want to see errors
          displayMode: false, // false for inline, true for display math
        });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        containerRef.current.textContent = latex; // Fallback to raw latex
      }
    }
  }, [latex]);

  return <span ref={containerRef} />;
};

export default KatexRenderer;