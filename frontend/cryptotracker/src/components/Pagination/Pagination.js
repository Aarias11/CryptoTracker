import React from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

const Pagination = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
  return (
    <div className="flex justify-between items-center py-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${
          currentPage === 1 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gray-600 hover:bg-gray-700'
        }`}
      >
        <IconArrowLeft />
      </button>
      <span className="mx-4">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${
          currentPage === totalPages 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gray-600 hover:bg-gray-700'
        }`}
      >
        <IconArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
