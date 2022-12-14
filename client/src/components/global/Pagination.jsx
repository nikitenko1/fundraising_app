import React from 'react';

const Pagination = ({ totalPage, currentPage, setPage }) => {
  return (
    <div className="flex border border-green-300 rounded-md w-fit m-auto mt-12">
      {currentPage > 1 && (
        <>
          <p
            onClick={() => setPage(1)}
            className="w-10 h-10 leading-10 text-center border-r border-gray-300 cursor-pointer"
          >
            &lt;&lt;
          </p>
          <p
            onClick={() => setPage(1)}
            className="w-10 h-10 leading-10 text-center border-r border-gray-300 cursor-pointer"
          >
            &lt;
          </p>
        </>
      )}
      {Array(totalPage)
        .fill('')
        .map((_, i) => (
          <p
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 leading-10 text-center border-r border-gray-300 ${
              currentPage === i + 1 ? 'bg-green-400 text-white' : undefined
            } hover:bg-green-400 hover:text-white transition-all cursor-pointer`}
          >
            {i + 1}
          </p>
        ))}
      {currentPage !== totalPage && (
        <>
          <p
            onClick={() => setPage(currentPage + 1)}
            className="w-10 h-10 leading-10 text-center border-r border-gray-300 cursor-pointer"
          >
            &gt;
          </p>
          <p
            onClick={() => setPage(totalPage)}
            className="w-10 h-10 leading-10 text-center cursor-pointer"
          >
            &gt;&gt;
          </p>
        </>
      )}
    </div>
  );
};

export default Pagination;
