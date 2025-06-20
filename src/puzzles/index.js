// Big O Notation Proofs
import { 
  N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED,
  LOG_N_IS_O_N,
  N_LOG_N_IS_O_N_SQUARED,
  TWO_TO_N_IS_NOT_O_N_CUBED
} from './bigOProofs';

// Induction Proofs
import {
  SUM_OF_FIRST_N_INTEGERS,
  SUM_OF_POWERS_OF_TWO,
  DIVISIBILITY_BY_THREE
} from './inductionProofs';

// Set Theory Proofs
import {
  DISTRIBUTIVE_LAW_SETS,
  DE_MORGAN_LAW
} from './setTheoryProofs';

// Recursion Proofs
import {
  FIBONACCI_RECURSION,
  TOWERS_OF_HANOI
} from './recursionProofs';

// Re-export everything
export { 
  N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED,
  LOG_N_IS_O_N,
  N_LOG_N_IS_O_N_SQUARED,
  TWO_TO_N_IS_NOT_O_N_CUBED
} from './bigOProofs';

export {
  SUM_OF_FIRST_N_INTEGERS,
  SUM_OF_POWERS_OF_TWO,
  DIVISIBILITY_BY_THREE
} from './inductionProofs';

export {
  DISTRIBUTIVE_LAW_SETS,
  DE_MORGAN_LAW
} from './setTheoryProofs';

export {
  FIBONACCI_RECURSION,
  TOWERS_OF_HANOI
} from './recursionProofs';

// All puzzles collection for easy access
export const ALL_PUZZLES = [
  N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED,
  LOG_N_IS_O_N,
  N_LOG_N_IS_O_N_SQUARED,
  TWO_TO_N_IS_NOT_O_N_CUBED,
  SUM_OF_FIRST_N_INTEGERS,
  SUM_OF_POWERS_OF_TWO,
  DIVISIBILITY_BY_THREE,
  DISTRIBUTIVE_LAW_SETS,
  DE_MORGAN_LAW,
  FIBONACCI_RECURSION,
  TOWERS_OF_HANOI
];

export const PUZZLES_BY_CATEGORY = {
  'Big O Notation': [
    N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED,
    LOG_N_IS_O_N,
    N_LOG_N_IS_O_N_SQUARED,
    TWO_TO_N_IS_NOT_O_N_CUBED
  ],
  'Mathematical Induction': [
    SUM_OF_FIRST_N_INTEGERS,
    SUM_OF_POWERS_OF_TWO,
    DIVISIBILITY_BY_THREE
  ],
  'Set Theory': [
    DISTRIBUTIVE_LAW_SETS,
    DE_MORGAN_LAW
  ],
  'Recursion': [
    FIBONACCI_RECURSION,
    TOWERS_OF_HANOI
  ]
};