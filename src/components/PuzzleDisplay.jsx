import React, { useState, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  DragOverlay, // For a smoother drag preview if desired
  // rectIntersection, // Alternative collision detection
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy, // Strategy for how items are sorted
} from '@dnd-kit/sortable';

import ProofBlock from './ProofBlock';
import KatexRenderer from './KatexRenderer';
import './PuzzleDisplay.css'; // Ensure this is imported

const PuzzleDisplay = ({ puzzle }) => {
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [proofBlocks, setProofBlocks] = useState([]);
  const [activeId, setActiveId] = useState(null); // To store the ID of the dragging item

  useEffect(() => {
    if (puzzle && puzzle.blocks) {
      setAvailableBlocks(puzzle.blocks);
      setProofBlocks([]);
    }
  }, [puzzle]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id) => {
    if (availableBlocks.find(item => item.id === id)) {
      return 'palette';
    }
    if (proofBlocks.find(item => item.id === id)) {
      return 'workspace';
    }
    return null;
  };
  
  const getBlockById = (id) => {
    return availableBlocks.find(b => b.id === id) || proofBlocks.find(b => b.id === id);
  }

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id; // This can be the ID of a droppable container or a sortable item

    const activeContainer = findContainer(activeId);
    // over.data.current?.sortable?.containerId can also give the container ID
    const overContainer = findContainer(overId) || over.id;


    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // Reordering within the same list
      if (activeContainer === 'palette') {
        if (activeId !== overId) { // overId here is the item ID it's dropped on
          setAvailableBlocks((items) => {
            const oldIndex = items.findIndex(item => item.id === activeId);
            const newIndex = items.findIndex(item => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      } else if (activeContainer === 'workspace') {
         if (activeId !== overId) {
          setProofBlocks((items) => {
            const oldIndex = items.findIndex(item => item.id === activeId);
            const newIndex = items.findIndex(item => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      }
    } else {
      // Moving from one list to another (this logic is more complex with dnd-kit)
      // The state update for moving between lists should ideally happen in onDragOver for immediate feedback, // ky: on
      // and onDragEnd finalizes it or handles cases where onDragOver didn't fully cover it.
      // For now, we'll rely on a simplified onDragEnd transfer if onDragOver didn't complete it.
      let itemToMove;
      if (activeContainer === 'palette') {
        itemToMove = availableBlocks.find(item => item.id === activeId);
        if (!itemToMove) return;
        setAvailableBlocks(prev => prev.filter(item => item.id !== activeId));
        setProofBlocks(prev => {
            // If overId is a container, add to end. If overId is an item, insert before/after.
            const overIndex = prev.findIndex(item => item.id === overId);
            if (overIndex !== -1) {
                return [...prev.slice(0, overIndex), itemToMove, ...prev.slice(overIndex)];
            }
            return [...prev, itemToMove]; // Add to end if dropped on container itself
        });
      } else { // Moving from workspace to palette
        itemToMove = proofBlocks.find(item => item.id === activeId);
        if (!itemToMove) return;
        setProofBlocks(prev => prev.filter(item => item.id !== activeId));
        setAvailableBlocks(prev => {
            const overIndex = prev.findIndex(item => item.id === overId);
            if (overIndex !== -1) {
                return [...prev.slice(0, overIndex), itemToMove, ...prev.slice(overIndex)];
            }
            return [...prev, itemToMove];
        });
      }
    }
    console.log({
      activeId,
      overId,
      activeContainer,
      overContainer,
      from: activeContainer,
      to: overContainer,
    });
  };

  // Define reusable droppable wrappers
  const PaletteDroppable = ({ children }) => {
    const { setNodeRef } = useDroppable({ id: 'palette' });
    return (
      <div ref={setNodeRef} className="puzzle-palette droppable-area">
        {children}
      </div>
    );
  };

  const WorkspaceDroppable = ({ children }) => {
    const { setNodeRef } = useDroppable({ id: 'workspace' });
    return (
      <div ref={setNodeRef} className="puzzle-workspace droppable-area">
        {children}
      </div>
    );
  };
    
  const activeBlock = activeId ? getBlockById(activeId) : null;

  if (!puzzle) {
    return <p>Loading puzzle...</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners} // Or rectIntersection
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="puzzle-container">
        <h2><KatexRenderer latex={puzzle.title} /></h2>
        <p><strong>Prove: <KatexRenderer latex={puzzle.statement} /></strong></p>
        
        <div className="dnd-columns-container">
          <div className="puzzle-palette-container"> {/* Container for SortableContext */}
            <h3>Available Steps:</h3>
            <SortableContext items={availableBlocks.map(b => b.id)} strategy={verticalListSortingStrategy} id="palette">
              <PaletteDroppable>
                {availableBlocks.map(block => (
                  <ProofBlock key={block.id} id={block.id} latexContent={block.latex} />
                ))}
                {availableBlocks.length === 0 && (
                  <div className="empty-message">Palette is empty</div>
                )}
              </PaletteDroppable>
            </SortableContext>
          </div>

          <div className="puzzle-workspace-container"> {/* Container for SortableContext */}
            <h3>Your Proof:</h3>
            <SortableContext items={proofBlocks.map(b => b.id)} strategy={verticalListSortingStrategy} id="workspace">
              <WorkspaceDroppable>
                {proofBlocks.map(block => (
                  <ProofBlock key={block.id} id={block.id} latexContent={block.latex} />
                ))}
                {proofBlocks.length === 0 && (
                  <div className="empty-message">Drag steps here</div>
                )}
              </WorkspaceDroppable>
            </SortableContext>
          </div>
        </div>
      </div>
      {/* DragOverlay provides a smoother visual drag experience */}
      <DragOverlay dropAnimation={null}>
        {activeId && activeBlock ? (
          <ProofBlock id={activeBlock.id} latexContent={activeBlock.latex} isOverlay={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default PuzzleDisplay;