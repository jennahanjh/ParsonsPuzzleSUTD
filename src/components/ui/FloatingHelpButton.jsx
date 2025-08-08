import React, { useState } from 'react';
import DictionaryModal from './DictionaryModal';
import './FloatingHelpButton.css';

const FloatingHelpButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="floating-help-btn"
        onClick={() => setIsModalOpen(true)}
        title="Open Dictionary & Help"
      >
        📚
      </button>
      
      <DictionaryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default FloatingHelpButton;
