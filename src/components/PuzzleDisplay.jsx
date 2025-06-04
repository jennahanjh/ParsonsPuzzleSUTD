import React, { useState, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
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

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return; // Only handle moves between different containers here for now
              // Reordering within the same container is handled by SortableContext by default if items are moved over each other
    }
    
    // Moving between containers
    if (activeContainer === 'palette' && overContainer === 'workspace') {
      setAvailableBlocks((prev) => prev.filter((item) => item.id !== activeId));
      setProofBlocks((prev) => {
        const activeItemIndex = prev.findIndex(item => item.id === activeId); // Check if it's already there (should not happen if logic is correct)
        if (activeItemIndex !== -1) return prev; // Should not happen
        
        const overItemIndex = prev.findIndex(item => item.id === overId);
        const itemToMove = availableBlocks.find(item => item.id === activeId);
        if (!itemToMove) return prev;

        if (overItemIndex !== -1) {
          return [...prev.slice(0, overItemIndex), itemToMove, ...prev.slice(overItemIndex)];
        }
        return [...prev, itemToMove]; // Add to end if not over a specific item in workspace
      });
    } else if (activeContainer === 'workspace' && overContainer === 'palette') {
      setProofBlocks((prev) => prev.filter((item) => item.id !== activeId));
      setAvailableBlocks((prev) => {
        const activeItemIndex = prev.findIndex(item => item.id === activeId);
        if (activeItemIndex !== -1) return prev;

        const overItemIndex = prev.findIndex(item => item.id === overId);
        const itemToMove = proofBlocks.find(item => item.id === activeId);
        if(!itemToMove) return prev;
        
        if (overItemIndex !== -1) {
          return [...prev.slice(0, overItemIndex), itemToMove, ...prev.slice(overItemIndex)];
        }
        return [...prev, itemToMove]; // Add to end if not over a specific item in palette
      });
    }
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id; // This can be the ID of a droppable container or a sortable item

    const activeContainer = findContainer(activeId);
    // over.data.current?.sortable?.containerId can also give the container ID
    const overContainer = over.data.current?.sortable?.containerId || findContainer(overId);


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
      // The state update for moving between lists should ideally happen in onDragOver for immediate feedback,
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
      onDragOver={handleDragOver} // onDragOver is often preferred for inter-list movement
      onDragEnd={handleDragEnd}
    >
      <div className="puzzle-container">
        <h2><KatexRenderer latex={puzzle.title} /></h2>
        <p><strong>Prove: <KatexRenderer latex={puzzle.statement} /></strong></p>
        
        <div className="dnd-columns-container">
          <div className="puzzle-palette-container"> {/* Container for SortableContext */}
            <h3>Available Steps:</h3>
            <SortableContext items={availableBlocks.map(b => b.id)} strategy={verticalListSortingStrategy} id="palette">
              <div className="puzzle-palette droppable-area"> {/* Actual visual droppable area */}
                {availableBlocks.map(block => (
                  <ProofBlock key={block.id} id={block.id} latexContent={block.latex} />
                ))}
                {availableBlocks.length === 0 && (
                  <div className="empty-message">Palette is empty</div>
                )}
              </div>
            </SortableContext>
          </div>

          <div className="puzzle-workspace-container"> {/* Container for SortableContext */}
            <h3>Your Proof:</h3>
            <SortableContext items={proofBlocks.map(b => b.id)} strategy={verticalListSortingStrategy} id="workspace">
              <div className="puzzle-workspace droppable-area"> {/* Actual visual droppable area */}
                {proofBlocks.map(block => (
                  <ProofBlock key={block.id} id={block.id} latexContent={block.latex} />
                ))}
                {proofBlocks.length === 0 && (
                  <div className="empty-message">Drag steps here</div>
                )}
              </div>
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