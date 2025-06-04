import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KatexRenderer from './KatexRenderer';
import './ProofBlock.css';

const ProofBlock = ({ id, latexContent, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Add a bit more shadow or lift when dragging, and ensure it's above others
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: isDragging || isOverlay ? 100 : 'auto', // Ensure dragging item is on top
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.8 : 1,
  };

  // If it's an overlay (drag overlay), we might want slightly different styling or structure
  // For now, we'll use the same rendering for simplicity.
  // The 'isOverlay' prop can be passed if using <DragOverlay> for a custom drag preview.

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="proof-block" // Keep your existing .proof-block styles
      data-id={id}
    >
      <KatexRenderer latex={latexContent} />
    </div>
  );
};

export default ProofBlock;