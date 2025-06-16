function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const blocks= [
  { id: 'block1-1', latex: '\\text{To show } f(n) = \\Theta(g(n)) \\text{, we need to show } f(n) = O(g(n)) \\text{ and } f(n) = \\Omega(g(n)).' },
  { id: 'block1-2', latex: 'f(n) = O(g(n)) \\text{ if there exist positive constants } c_1 \\text{ and } n_0 \\text{ such that } 0 \\le f(n) \\le c_1g(n) \\text{ for all } n \\ge n_0.' },
  { id: 'block1-3', latex: 'f(n) = \\Omega(g(n)) \\text{ if there exist positive constants } c_2 \\text{ and } n_0 \\text{ such that } 0 \\le c_2g(n) \\le f(n) \\text{ for all } n \\ge n_0.' },
  { id: 'block1-4', latex: '\\text{Consider } f(n) = n^2 + n^3 \\text{ and } g(n) = n^3.' },
  { id: 'block1-5', latex: '\\text{For O-notation: } n^2 + n^3 \\le n^3 + n^3 \\text{ (for } n \\ge 1 \\text{)}' }, // Added \text{} around "for" and "1"
  { id: 'block1-6', latex: 'n^2 + n^3 \\le 2n^3' }, // Purely math, should be fine
  { id: 'block1-7', latex: '\\text{So, } c_1 = 2, n_0 = 1 \\text{ satisfies } n^2 + n^3 \\le c_1n^3.' },
  { id: 'block1-8', latex: '\\text{For } \\Omega \\text{-notation: We need } c_2n^3 \\le n^2 + n^3.' }, // Added \text{} around Omega and -notation
  { id: 'block1-9', latex: '\\text{Since } n^2 \\ge 0 \\text{, then } n^3 \\le n^2 + n^3 \\text{ for } n \\ge 1 \\text{.}' }, // Added \text{}
  { id: 'block1-10', latex: '\\text{So, } c_2 = 1, n_0 = 1 \\text{ satisfies } c_2n^3 \\le n^2 + n^3.' },
  { id: 'block1-11', latex: '\\text{Therefore, } n^2 + n^3 = \\Theta(n^3).' },
]

shuffle(blocks); // Randomize the order

export const N_SQUARED_PLUS_N_CUBED_THETA_N_CUBED = {
  id: 'proof1',
  title: '\\text{Prove } n^2 + n^3 = \\Theta(n^3)',
  statement: 'n^2 + n^3 = \\Theta(n^3)', // This one is mostly math, so it might be fine, but let's be consistent if issues arise.
  blocks, // Now shuffled
  //blocks: [
    //{ id: 'block1-1', latex: '\\text{To show } f(n) = \\Theta(g(n)) \\text{, we need to show } f(n) = O(g(n)) \\text{ and } f(n) = \\Omega(g(n)).' },
    //{ id: 'block1-2', latex: 'f(n) = O(g(n)) \\text{ if there exist positive constants } c_1 \\text{ and } n_0 \\text{ such that } 0 \\le f(n) \\le c_1g(n) \\text{ for all } n \\ge n_0.' },
    //{ id: 'block1-3', latex: 'f(n) = \\Omega(g(n)) \\text{ if there exist positive constants } c_2 \\text{ and } n_0 \\text{ such that } 0 \\le c_2g(n) \\le f(n) \\text{ for all } n \\ge n_0.' },
    //{ id: 'block1-4', latex: '\\text{Consider } f(n) = n^2 + n^3 \\text{ and } g(n) = n^3.' },
    //{ id: 'block1-5', latex: '\\text{For O-notation: } n^2 + n^3 \\le n^3 + n^3 \\text{ (for } n \\ge 1 \\text{)}' }, // Added \text{} around "for" and "1"
    //{ id: 'block1-6', latex: 'n^2 + n^3 \\le 2n^3' }, // Purely math, should be fine
    //{ id: 'block1-7', latex: '\\text{So, } c_1 = 2, n_0 = 1 \\text{ satisfies } n^2 + n^3 \\le c_1n^3.' },
    //{ id: 'block1-8', latex: '\\text{For } \\Omega \\text{-notation: We need } c_2n^3 \\le n^2 + n^3.' }, // Added \text{} around Omega and -notation
    //{ id: 'block1-9', latex: '\\text{Since } n^2 \\ge 0 \\text{, then } n^3 \\le n^2 + n^3 \\text{ for } n \\ge 1 \\text{.}' }, // Added \text{}
    //{ id: 'block1-10', latex: '\\text{So, } c_2 = 1, n_0 = 1 \\text{ satisfies } c_2n^3 \\le n^2 + n^3.' },
    //{ id: 'block1-11', latex: '\\text{Therefore, } n^2 + n^3 = \\Theta(n^3).' },
  //],
  solutionOrder: ['block1-1', 'block1-2', 'block1-3', 'block1-4', 'block1-5', 'block1-6', 'block1-7', 'block1-8', 'block1-9', 'block1-10', 'block1-11']

};



