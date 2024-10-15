import React from 'react';
import ReactPaginate from 'react-paginate';
import { PaginationContainer } from './style';

const PaginationComponent = ({ pageCount, handlePageClick}) => {
    return (
        <PaginationContainer>
            <ReactPaginate
                previousLabel={'Trước'}
                nextLabel={'Sau'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                disabledClassName={'disabled'}
                breakClassName={'break'}
            />
        </PaginationContainer>
    );
};

export default PaginationComponent;
