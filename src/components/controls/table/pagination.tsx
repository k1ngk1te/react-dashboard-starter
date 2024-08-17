import {
  BackwardOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  ForwardOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';
import React from 'react';

import { Button, PageButton } from './components';

function Pagination({
  canNextPage,
  canPreviousPage,
  gotoPage,
  maxPages = 5,
  nextPage,
  pageCount,
  pageIndex,
  pageLength,
  pageSize,
  pageSizes = [5, 10, 20, 50, 100, 200, 500, 1000],
  previousPage,
  setPageSize,
}: {
  canNextPage: boolean;
  canPreviousPage: boolean;
  gotoPage: (page: number) => void;
  maxPages?: number;
  nextPage: () => void;
  previousPage: () => void;
  pageCount: number;
  pageIndex: number;
  pageLength: number;
  pageSizes?: number[];
  pageSize: number;
  setPageSize: (size: number) => void;
}) {
  const { pages } = React.useMemo(() => {
    let start: number;
    let end: number;

    const currentPage = pageIndex + 1;
    const totalPages = pageLength;

    if (totalPages <= maxPages) {
      // Total pages less than max so show all pages
      start = 1;
      end = totalPages;
    } else {
      // Total pages more than max so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrentPage) {
        // Current page near the start
        start = 1;
        end = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // Current page near the end
        start = totalPages - maxPages + 1;
        end = totalPages;
      } else {
        // Current page somewhere in the middle
        start = currentPage - maxPagesBeforeCurrentPage;
        end = currentPage + maxPagesAfterCurrentPage;
      }
    }

    // Calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    // const endIndex = Math.min(startIndex + pageSize - 1, pageLength - 1);

    // Create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(end + 1 - start).keys()).map((i) => start + i);

    return { startIndex, pages };
  }, [pageLength, pageIndex, maxPages, pageSize]);

  return (
    <div className="my-2 py-3 flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button onClick={previousPage} disabled={!canPreviousPage}>
          Previous
        </Button>
        <Button onClick={nextPage} disabled={!canNextPage}>
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex gap-x-2 items-center">
          <p className="mb-0 text-sm text-gray-700 tracking-wider w-full dark:text-gray-300">
            Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
            <span className="font-medium">{pageLength}</span>
          </p>
          <div className="mx-2">
            <Select
              style={{ width: '100%', fontSize: '8px' }}
              size="large"
              className="!text-xs"
              id="size"
              onChange={(value) => setPageSize(+value)}
              value={pageSize ? String(pageSize) : ''}
              options={pageSizes.map((pageSize) => ({
                label: `Show ${pageSize}`,
                value: String(pageSize),
              }))}
            />
          </div>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <PageButton
              className="rounded-l-md"
              onClick={gotoPage ? () => gotoPage(0) : undefined}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">First</span>

              <span className="py-1">
                <BackwardOutlined className="h-3 w-3" aria-hidden="true" />
              </span>
            </PageButton>
            <PageButton onClick={previousPage} disabled={!canPreviousPage}>
              <span className="sr-only">Previous</span>
              <span className="p-1">
                <CaretLeftOutlined className="h-3 w-3" aria-hidden="true" />
              </span>
            </PageButton>
            <div className="hidden lg:flex lg:items-center">
              {pages.map((page, index) => (
                <PageButton
                  active={page === pageIndex + 1}
                  disabled={page === pageIndex + 1}
                  key={index}
                  onClick={() => gotoPage(page - 1)}
                >
                  <span className="p-1">
                    <span className="h-3 w-3">{page}</span>
                  </span>
                </PageButton>
              ))}
            </div>
            <PageButton onClick={nextPage} disabled={!canNextPage}>
              <span className="sr-only">Next</span>
              <span className="p-1">
                <CaretRightOutlined className="h-3 w-3" aria-hidden="true" />
              </span>
            </PageButton>
            <PageButton
              className="rounded-r-md"
              onClick={gotoPage ? () => gotoPage(pageCount - 1) : undefined}
              disabled={!canNextPage}
            >
              <span className="sr-only">Last</span>
              <span className="py-1">
                <ForwardOutlined className="h-3 w-3" aria-hidden="true" />
              </span>
            </PageButton>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
