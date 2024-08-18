import React from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

const Pagination = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="p-2 bg-gray-300 rounded-lg disabled:opacity-50"
      >
        <IconArrowLeft />
      </button>
      <span className="mx-4">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 bg-gray-300 rounded-lg disabled:opacity-50"
      >
        <IconArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
