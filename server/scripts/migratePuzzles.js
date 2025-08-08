import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Puzzle from '../models/Puzzle.js';

// Import existing puzzle data
import { 
  N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED,
  LOG_N_IS_O_N,
  N_LOG_N_IS_O_N_SQUARED,
  TWO_TO_N_IS_NOT_O_N_CUBED
} from '../../src/puzzles/bigOProofs.js';

import {
  SUM_OF_FIRST_N_INTEGERS,
  SUM_OF_POWERS_OF_TWO,
  DIVISIBILITY_BY_THREE
} from '../../src/puzzles/inductionProofs.js';

import {
  DISTRIBUTIVE_LAW_SETS,
  DE_MORGAN_LAW
} from '../../src/puzzles/setTheoryProofs.js';

import {
  FIBONACCI_RECURSION,
  TOWERS_OF_HANOI
} from '../../src/puzzles/recursionProofs.js';

dotenv.config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parsonspuzzle';

// Define puzzle categories and their data
const puzzleCategories = {
  bigO: [
    N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED,
    LOG_N_IS_O_N,
    N_LOG_N_IS_O_N_SQUARED,
    TWO_TO_N_IS_NOT_O_N_CUBED
  ],
  induction: [
    SUM_OF_FIRST_N_INTEGERS,
    SUM_OF_POWERS_OF_TWO,
    DIVISIBILITY_BY_THREE
  ],
  setTheory: [
    DISTRIBUTIVE_LAW_SETS,
    DE_MORGAN_LAW
  ],
  recursion: [
    FIBONACCI_RECURSION,
    TOWERS_OF_HANOI
  ]
};

// Function to determine difficulty based on puzzle characteristics
function determineDifficulty(puzzle) {
  const blockCount = puzzle.blocks.length;
  if (blockCount <= 5) return 'easy';
  if (blockCount <= 10) return 'medium';
  return 'hard';
}

// Function to generate tags based on puzzle content
function generateTags(puzzle, category) {
  const tags = [category];
  
  // Add tags based on title and content
  const content = `${puzzle.title} ${puzzle.statement}`.toLowerCase();
  
  if (content.includes('big o') || content.includes('theta') || content.includes('omega')) {
    tags.push('complexity', 'asymptotic');
  }
  if (content.includes('induction')) {
    tags.push('induction', 'proof');
  }
  if (content.includes('set')) {
    tags.push('set-theory', 'logic');
  }
  if (content.includes('recursion') || content.includes('recursive')) {
    tags.push('recursion', 'algorithm');
  }
  if (content.includes('log')) {
    tags.push('logarithm');
  }
  if (content.includes('fibonacci')) {
    tags.push('fibonacci', 'sequence');
  }
  if (content.includes('hanoi')) {
    tags.push('towers-of-hanoi', 'game');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

async function migratePuzzles() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    
    // Clear existing puzzles (optional - uncomment if you want to start fresh)
    // console.log('Clearing existing puzzles...');
    // await Puzzle.deleteMany({});
    
    const allPuzzles = [];
    
    // Process each category
    for (const [category, puzzles] of Object.entries(puzzleCategories)) {
      console.log(`Processing ${category} puzzles...`);
      
      for (const puzzle of puzzles) {
        const puzzleData = {
          ...puzzle,
          category,
          difficulty: determineDifficulty(puzzle),
          tags: generateTags(puzzle, category),
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
        
        allPuzzles.push(puzzleData);
      }
    }
    
    console.log(`Inserting ${allPuzzles.length} puzzles into database...`);
    
    // Insert all puzzles
    const insertedPuzzles = [];
    for (const puzzleData of allPuzzles) {
      try {
        // Check if puzzle already exists
        const existingPuzzle = await Puzzle.findOne({ id: puzzleData.id });
        
        if (existingPuzzle) {
          console.log(`Puzzle ${puzzleData.id} already exists, updating...`);
          const updatedPuzzle = await Puzzle.findOneAndUpdate(
            { id: puzzleData.id },
            puzzleData,
            { new: true, upsert: true }
          );
          insertedPuzzles.push(updatedPuzzle);
        } else {
          console.log(`Creating new puzzle: ${puzzleData.id}`);
          const newPuzzle = new Puzzle(puzzleData);
          const savedPuzzle = await newPuzzle.save();
          insertedPuzzles.push(savedPuzzle);
        }
      } catch (error) {
        console.error(`Error processing puzzle ${puzzleData.id}:`, error.message);
      }
    }
    
    console.log(`Successfully processed ${insertedPuzzles.length} puzzles!`);
    
    // Display summary
    const summary = await Puzzle.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          difficulties: { $push: '$difficulty' }
        }
      }
    ]);
    
    console.log('\nMigration Summary:');
    console.log('===================');
    summary.forEach(cat => {
      const difficultyCount = cat.difficulties.reduce((acc, diff) => {
        acc[diff] = (acc[diff] || 0) + 1;
        return acc;
      }, {});
      
      console.log(`${cat._id}: ${cat.count} puzzles`);
      console.log(`  - Easy: ${difficultyCount.easy || 0}`);
      console.log(`  - Medium: ${difficultyCount.medium || 0}`);
      console.log(`  - Hard: ${difficultyCount.hard || 0}`);
    });
    
    const totalCount = await Puzzle.countDocuments({ isActive: true });
    console.log(`\nTotal active puzzles: ${totalCount}`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePuzzles().then(() => {
    console.log('Migration completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

export default migratePuzzles;
