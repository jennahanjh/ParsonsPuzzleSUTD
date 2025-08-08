import React, { useState, useEffect } from 'react';
import './DictionaryModal.css';

const DictionaryModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);

  // Load terms on mount
  useEffect(() => {
    // Since we can't directly import the JSON file, we'll create a terms array
    // You could also fetch this from your backend or create a terms.js file
    const glossaryTerms = [
      { term: "Big O", definition: "Notation to describe the time or space complexity of an algorithm." },
      { term: "Algorithm", definition: "A step-by-step procedure for solving a problem." },
      { term: "Recursion", definition: "A function that calls itself." },
      { term: "Function", definition: "A reusable block of code that performs a specific task." },
      { term: "Variable", definition: "A named storage for a value." },
      { term: "Loop", definition: "A construct that repeats a block of code." },
      { term: "Array", definition: "An ordered collection of elements." },
      { term: "Object", definition: "A collection of key-value pairs." },
      { term: "Class", definition: "A blueprint for creating objects." },
      { term: "Inheritance", definition: "A mechanism to create a new class from an existing one." },
      { term: "Data Structure", definition: "A way of organizing and storing data." },
      { term: "Stack", definition: "A LIFO (Last In, First Out) data structure." },
      { term: "Queue", definition: "A FIFO (First In, First Out) data structure." },
      { term: "Binary Tree", definition: "A tree data structure with at most two children per node." },
      { term: "Hash Table", definition: "A structure that maps keys to values for efficient lookup." },
      { term: "Linked List", definition: "A linear data structure with elements linked using pointers." },
      { term: "Synchronous", definition: "Code execution that waits for tasks to complete before continuing." },
      { term: "Asynchronous", definition: "Programming that allows other operations to continue before completion." },
      { term: "Promise", definition: "An object representing the eventual result of an async operation." },
      { term: "Callback", definition: "A function passed into another function to be executed later." },
      { term: "API", definition: "A set of functions and protocols for building software." },
      { term: "REST API", definition: "An architectural style for designing networked applications." },
      { term: "HTTP", definition: "Protocol for transferring web resources." },
      { term: "HTTPS", definition: "Secure version of HTTP." },
      { term: "Git", definition: "A version control system." },
      { term: "Repository", definition: "A storage for code managed by version control." },
      { term: "Branch", definition: "A parallel version of a repository." },
      { term: "Commit", definition: "A snapshot of changes in a Git repository." },
      { term: "Merge", definition: "Combining changes from different branches." },
      { term: "Pull Request", definition: "A request to merge changes into a branch." },
      { term: "Conflict", definition: "An issue that arises when changes collide during merge." },
      // Math-specific terms
      { term: "Theta Notation", definition: "Θ(n) - Tight bound for asymptotic analysis, both upper and lower bound." },
      { term: "Omega Notation", definition: "Ω(n) - Lower bound for asymptotic analysis." },
      { term: "Mathematical Induction", definition: "A proof technique that proves a statement for all natural numbers." },
      { term: "Base Case", definition: "The initial step in mathematical induction, usually n=0 or n=1." },
      { term: "Inductive Step", definition: "Proving that if P(k) is true, then P(k+1) is also true." },
      { term: "Set Theory", definition: "A branch of mathematics dealing with collections of objects." },
      { term: "Union", definition: "A ∪ B - The set containing all elements in A or B or both." },
      { term: "Intersection", definition: "A ∩ B - The set containing all elements in both A and B." },
      { term: "Subset", definition: "A ⊆ B - All elements of A are also elements of B." },
      { term: "De Morgan's Laws", definition: "Rules relating union and intersection through complements." },
      { term: "Distributive Law", definition: "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)" },
      { term: "Proof by Contradiction", definition: "Assume the opposite of what you want to prove and show it leads to a contradiction." },
      { term: "Direct Proof", definition: "A straightforward proof that starts with assumptions and derives the conclusion." }
    ];
    
    setTerms(glossaryTerms);
    setFilteredTerms(glossaryTerms);
  }, []);

  // Filter terms based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTerms(terms);
    } else {
      const filtered = terms.filter(t => 
        t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTerms(filtered);
    }
  }, [searchTerm, terms]);

  const handleQuickLookup = (term) => {
    const found = terms.find(t => t.term.toLowerCase() === term.toLowerCase());
    if (found) {
      setSelectedTerm(found);
    } else {
      // Fallback to MDN search
      window.open(`https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(term)}`, '_blank');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleQuickLookup(searchTerm);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dictionary-modal-overlay" onClick={onClose}>
      <div className="dictionary-modal" onClick={e => e.stopPropagation()}>
        <div className="dictionary-header">
          <h2>📚 Math & Programming Dictionary</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="dictionary-content">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
              autoFocus
            />
            <small>Press Enter to search online if term not found</small>
          </div>

          {selectedTerm && (
            <div className="selected-term">
              <h3>{selectedTerm.term}</h3>
              <p>{selectedTerm.definition}</p>
              <button onClick={() => setSelectedTerm(null)}>← Back to list</button>
            </div>
          )}

          {!selectedTerm && (
            <div className="terms-list">
              <div className="terms-count">
                {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
              </div>
              <div className="terms-grid">
                {filteredTerms.map((term, index) => (
                  <div key={index} className="term-item" onClick={() => setSelectedTerm(term)}>
                    <strong>{term.term}</strong>
                    <p>{term.definition.substring(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;
