// Service for managing puzzle data and saving to JSON files
class PuzzleManagerService {
  constructor() {
    this.apiEnabled = false; // For now, we'll work with local storage and file downloads
  }

  /**
   * Save a new puzzle to the appropriate category file
   * Since we can't write directly to files in the browser, this will:
   * 1. Store in localStorage for immediate use
   * 2. Provide download functionality for the updated JSON file
   */
  async savePuzzle(puzzle) {
    try {
      // Validate puzzle data
      this.validatePuzzle(puzzle);

      // Determine the target file based on category
      const categoryMap = {
        'big-o': 'big-o-proofs.json',
        'induction': 'induction-proofs.json',
        'recursion': 'recursion-proofs.json',
        'set-theory': 'set-theory-proofs.json'
      };

      const filename = categoryMap[puzzle.category];
      if (!filename) {
        throw new Error(`Unknown category: ${puzzle.category}`);
      }

      // Get existing puzzles from localStorage or create new structure
      const storageKey = `puzzles_${puzzle.category}`;
      const existingData = this.getStoredPuzzles(puzzle.category);
      
      // Add the new puzzle
      existingData.puzzles.push(puzzle);

      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(existingData));

      // Generate download for the updated file
      this.downloadUpdatedFile(existingData, filename);

      // Return success with instructions
      return {
        success: true,
        message: 'Puzzle created successfully! Download the updated JSON file and replace it in your project.',
        puzzle: puzzle,
        filename: filename
      };

    } catch (error) {
      console.error('Error saving puzzle:', error);
      throw new Error(`Failed to save puzzle: ${error.message}`);
    }
  }

  /**
   * Get stored puzzles for a category from localStorage
   */
  getStoredPuzzles(category) {
    const storageKey = `puzzles_${category}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      return JSON.parse(stored);
    }

    // Return default structure based on category
    const categoryInfo = {
      'big-o': {
        category: 'Big O Notation',
        description: 'Proofs involving Big O, Omega, and Theta notation'
      },
      'induction': {
        category: 'Mathematical Induction',
        description: 'Proofs using mathematical induction'
      },
      'recursion': {
        category: 'Recursion',
        description: 'Proofs involving recursive relations and algorithms'
      },
      'set-theory': {
        category: 'Set Theory',
        description: 'Proofs involving set operations and properties'
      }
    };

    return {
      ...categoryInfo[category],
      puzzles: []
    };
  }

  /**
   * Validate puzzle data structure
   */
  validatePuzzle(puzzle) {
    const required = ['id', 'title', 'displayTitle', 'statement', 'difficulty', 'tags', 'blocks', 'solutionOrder'];
    
    for (const field of required) {
      if (!puzzle[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(puzzle.tags) || puzzle.tags.length === 0) {
      throw new Error('Puzzle must have at least one tag');
    }

    if (!Array.isArray(puzzle.blocks) || puzzle.blocks.length < 2) {
      throw new Error('Puzzle must have at least 2 blocks');
    }

    if (!Array.isArray(puzzle.solutionOrder) || puzzle.solutionOrder.length !== puzzle.blocks.length) {
      throw new Error('Solution order must match the number of blocks');
    }

    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(puzzle.difficulty)) {
      throw new Error(`Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`);
    }

    // Validate blocks structure
    for (const block of puzzle.blocks) {
      if (!block.id || !block.latex) {
        throw new Error('Each block must have an id and latex content');
      }
    }

    // Validate solution order references actual block IDs
    const blockIds = puzzle.blocks.map(b => b.id);
    for (const blockId of puzzle.solutionOrder) {
      if (!blockIds.includes(blockId)) {
        throw new Error(`Solution order references non-existent block ID: ${blockId}`);
      }
    }

    return true;
  }

  /**
   * Generate and trigger download of updated JSON file
   */
  downloadUpdatedFile(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  }

  /**
   * Get all puzzles created by educators (from localStorage)
   */
  getEducatorPuzzles() {
    const categories = ['big-o', 'induction', 'recursion', 'set-theory'];
    const allPuzzles = [];
    
    for (const category of categories) {
      const categoryData = this.getStoredPuzzles(category);
      allPuzzles.push(...categoryData.puzzles.map(puzzle => ({
        ...puzzle,
        categoryName: categoryData.category,
        filename: `${category}-proofs.json`
      })));
    }
    
    return allPuzzles;
  }

  /**
   * Clear all educator-created puzzles (useful for testing)
   */
  clearEducatorPuzzles() {
    const categories = ['big-o', 'induction', 'recursion', 'set-theory'];
    for (const category of categories) {
      localStorage.removeItem(`puzzles_${category}`);
    }
  }

  /**
   * Export all puzzles as a single JSON file
   */
  exportAllPuzzles() {
    const categories = ['big-o', 'induction', 'recursion', 'set-theory'];
    const exportData = {};
    
    for (const category of categories) {
      const categoryData = this.getStoredPuzzles(category);
      exportData[category] = categoryData;
    }
    
    this.downloadUpdatedFile(exportData, 'educator-puzzles-export.json');
    
    return {
      success: true,
      message: 'All puzzles exported successfully!'
    };
  }

  /**
   * Get statistics about educator-created puzzles
   */
  getStatistics() {
    const puzzles = this.getEducatorPuzzles();
    const categories = new Set(puzzles.map(p => p.categoryName));
    const difficultyCount = puzzles.reduce((acc, puzzle) => {
      acc[puzzle.difficulty] = (acc[puzzle.difficulty] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPuzzles: puzzles.length,
      categories: categories.size,
      byDifficulty: difficultyCount,
      byCategory: puzzles.reduce((acc, puzzle) => {
        acc[puzzle.categoryName] = (acc[puzzle.categoryName] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

// Create and export singleton instance
export const puzzleManagerService = new PuzzleManagerService();
export default puzzleManagerService;
