import React from 'react';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination-control">
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        &lt;
      </button>
      {renderPageNumbers()}
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        &gt;
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default PaginationControl;
