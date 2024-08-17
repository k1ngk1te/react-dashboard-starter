import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';

import { SortIcon, SortUpIcon, SortDownIcon } from './components';
import { fuzzy } from './filters';
import Pagination from './pagination';
import { DEFAULT_PAGINATION_SIZE } from '../../../config/app';
import useDebounce from '../../../hooks/use-debounce';

import type {
  ColumnDef,
  ColumnFilter,
  FilterFn,
  OnChangeFn,
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

type a = object;

export interface TableDataType extends a {
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;
  canHoverRow?: boolean;
}

interface TableProps<T extends TableDataType> {
  columnFilters?: ColumnFilter[];
  columnVisibility?: Record<keyof T, boolean>;
  columns: ColumnDef<T>[];
  data: T[];
  enableHiding?: boolean;
  filterFn?: FilterFn<T>;
  filterValue?: string;
  pageSize?: number;
  paginate?: boolean;
  setColumnVisibility?: OnChangeFn<VisibilityState>;
  showFooter?: boolean;
  showSn?: boolean;
}

export type TableRef<T extends TableDataType = object> = {
  getRowsOnPage: (pageNo?: number) => Row<T>['original'][];
  getNoOfPages: () => number;
};

function Table<T extends object>(
  {
    columnFilters,
    columns = [],
    columnVisibility,
    data,
    enableHiding,
    filterFn = fuzzy,
    filterValue,
    paginate = true,
    pageSize = DEFAULT_PAGINATION_SIZE,
    setColumnVisibility,
    showFooter,
    showSn,
  }: TableProps<T>,
  ref: React.ForwardedRef<TableRef<T>>
) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const colFilters = React.useMemo(() => columnFilters || [], [columnFilters]);

  const table = useReactTable({
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
    data,
    enableHiding,
    columns,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    sortDescFirst: false,
    //
    state: {
      columnFilters: colFilters,
      columnVisibility,
      globalFilter,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    // Column Visibility
    onColumnVisibilityChange: setColumnVisibility,

    // Global Filtering
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterFn,

    // Sorting
    onSortingChange: setSorting,
  });

  const filteredValue = useDebounce(filterValue);

  const getRowsOnPage = React.useCallback(
    (pageNo?: number) => {
      const tableState = table && table.getState();

      if (!tableState || !tableState.pagination) {
        return [];
      }

      const pageIndex = tableState.pagination.pageIndex;
      const pageSize = tableState.pagination.pageSize;

      const index = pageNo ? pageIndex + (pageNo - 1) : pageIndex;

      // if (!table.getCoreRowModel || !table.getCoreRowModel()) {
      if (!table.getCoreRowModel || typeof table.getCoreRowModel !== 'function') {
        return [];
      }

      const rowsOnPage = table
        .getCoreRowModel()
        .rows.slice(index * pageSize, (index + 1) * pageSize);

      return rowsOnPage.map((row) => row.original);
    },
    [table]
  );

  const getPageLength = React.useCallback(() => {
    const tableState = table && table.getPageOptions();

    if (!tableState || !tableState.length) {
      return 0;
    }
    return table.getPageOptions().length;
  }, [table]);

  React.useImperativeHandle(
    ref,
    () => ({
      getRowsOnPage,
      getNoOfPages: getPageLength,
    }),
    [getRowsOnPage, getPageLength]
  );

  React.useEffect(() => {
    if (filteredValue !== undefined) setGlobalFilter(filteredValue);
  }, [filteredValue]);

  return (
    <React.Fragment>
      {/* Table Start */}
      <div className="flex flex-col">
        <div className="table-container">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {showSn && (
                    <th className="table-head group" scope="col">
                      #
                    </th>
                  )}
                  {headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();

                    return (
                      // Add the sorting props to control sorting. For this example
                      // we can add them into the header props
                      <th key={header.id} className="table-head group" scope="col">
                        <div
                          className={`flex items-center justify-between select-none ${
                            canSort ? 'cursor-pointer' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}

                          {/* Add a sort direction indicator */}
                          {sorted === 'asc' ? (
                            <SortUpIcon />
                          ) : sorted === 'desc' ? (
                            <SortDownIcon />
                          ) : canSort ? (
                            <SortIcon />
                          ) : null}
                          {/* {{
                            asc: (
                              <SortUpIcon />
                            ),
                            desc: (
                              <SortDownIcon />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <SortIcon />
                          )} */}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white dark:bg-gray-800">
              {table.getRowModel().rows.map((row, rowIndex) => {
                const canHoverRow = (row.original as TableDataType).canHoverRow;
                return (
                  <tr
                    onClick={(e) => {
                      const onRowClick = (row.original as TableDataType).onRowClick;
                      if (onRowClick) {
                        onRowClick(e);
                      }
                    }}
                    className={`even:bg-gray-50 even:dark:bg-gray-700 ${
                      canHoverRow
                        ? 'cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-600 hover:even:bg-gray-200'
                        : ''
                    }`}
                    key={row.id}
                  >
                    {showSn && (
                      <td className="table-data-sn">
                        {table.getState().pagination.pageIndex *
                          table.getState().pagination.pageSize +
                          (rowIndex + 1)}
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="table-data">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            {showFooter ? (
              <tfoot className="bg-gray-200">
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {showSn && <td className="table-footer-data"></td>}
                    {footerGroup.headers.map((header) => (
                      <td key={header.id} colSpan={header.colSpan} className="table-footer-data">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.footer, header.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tfoot>
            ) : null}
          </table>
        </div>
      </div>
      {/* Table Stop */}

      {/* Pagination Start */}
      {paginate && (
        <div className="border-0 border-t border-solid border-gray-200 mt-3">
          <Pagination
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            gotoPage={table.setPageIndex}
            nextPage={table.nextPage}
            pageCount={table.getPageCount()}
            pageIndex={table.getState().pagination.pageIndex}
            pageLength={table.getPageOptions().length}
            pageSize={table.getState().pagination.pageSize}
            previousPage={table.previousPage}
            setPageSize={table.setPageSize}
          />
        </div>
      )}
      {/* Pagination Stop */}
    </React.Fragment>
  );
}

const ForwardedTable = React.forwardRef(Table);

export default ForwardedTable;
