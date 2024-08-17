import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React from 'react';

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
	TableOptions,
	TableState,
	VisibilityState,
} from '@tanstack/react-table';

type PaginationState = {
	pageIndex: number;
	pageSize: number;
};

interface TableProps<T extends object> {
	columnFilters?: ColumnFilter[];
	columnVisibility?: Record<keyof T, boolean>;
	columns: ColumnDef<T>[];
	data: T[];
	enableHiding?: boolean;
	filterFn?: FilterFn<T>;
	filterValue?: string;
	manualPagination?: boolean;
	onPaginationChange?: OnChangeFn<PaginationState>;
	pageCount?: number;
	pageSize?: number;
	paginate?: boolean;
	pagination?: PaginationState;
	setColumnVisibility?: OnChangeFn<VisibilityState>;
	showFooter?: boolean;
	showSn?: boolean;
}

export type TableRef<T extends object = object> = {
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
		manualPagination,
		onPaginationChange,
		pageCount,
		pageSize = DEFAULT_PAGINATION_SIZE,
		paginate = true,
		pagination,
		setColumnVisibility,
		showFooter,
		showSn = true,
	}: TableProps<T>,
	ref: React.ForwardedRef<TableRef<T>>
) {
	const [globalFilter, setGlobalFilter] = React.useState('');

	const colFilters = React.useMemo(() => columnFilters || [], [columnFilters]);

	const tableState = React.useMemo(() => {
		const state: Partial<TableState> = {
			columnFilters: colFilters,
			columnVisibility,
			globalFilter,
		};
		if (pagination) state.pagination = pagination;
		return state;
	}, [colFilters, columnVisibility, globalFilter, pagination]);

	const tableOptions = React.useMemo(() => {
		const params: TableOptions<T> = {
			// debugTable: true,
			// debugHeaders: true,
			// debugColumns: true,
			data,
			enableHiding,
			columns,
			initialState: {
				pagination: {
					pageSize,
					pageIndex: 0,
				},
			},
			manualPagination,
			pageCount,
			// sortDescFirst: false,
			//
			state: tableState,

			// Column Visibility
			onColumnVisibilityChange: setColumnVisibility,

			// Global Filtering
			onGlobalFilterChange: setGlobalFilter,
			globalFilterFn: filterFn,

			// Pagination
			// onPaginationChange,

			getCoreRowModel: getCoreRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
		};

		if (onPaginationChange) params.onPaginationChange = onPaginationChange;

		return params;
	}, [
		columns,
		data,
		enableHiding,
		filterFn,
		manualPagination,
		onPaginationChange,
		pageCount,
		pageSize,
		setColumnVisibility,
		tableState,
	]);

	const table = useReactTable(tableOptions);

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
			// if (!table.getCoreRowModel || typeof table.getCoreRowModel !== 'function') {
			if (
				!table.getFilteredRowModel ||
				typeof table.getFilteredRowModel !== 'function'
			) {
				return [];
			}

			const rowsOnPage = table
				// .getCoreRowModel()
				.getFilteredRowModel()
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
								<tr className="table-row-horizontal" key={headerGroup.id}>
									{showSn && (
										<th className="table-head group" scope="col">
											#
										</th>
									)}
									{headerGroup.headers.map((header) => {
										return (
											<th
												key={header.id}
												className="table-head group"
												scope="col"
											>
												<div
													className={`flex items-center justify-between select-none`}
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext()
														  )}
												</div>
											</th>
										);
									})}
								</tr>
							))}
						</thead>

						<tbody className="bg-white dark:text-gray-900">
							{table.getRowModel().rows.map((row, rowIndex) => (
								<tr
									className="bg-transparent table-row-horizontal dark:bg-gray-800 even:bg-gray-200 dark:odd:bg-gray-700"
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
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
						{showFooter ? (
							<tfoot className="bg-gray-200 dark:bg-gray-700">
								{table.getFooterGroups().map((footerGroup) => (
									<tr key={footerGroup.id}>
										{showSn && <td className="table-footer-data"></td>}
										{footerGroup.headers.map((header) => (
											<td
												key={header.id}
												colSpan={header.colSpan}
												className="table-footer-data"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.footer,
															header.getContext()
													  )}
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
			)}
			{/* Pagination Stop */}
		</React.Fragment>
	);
}

const ForwardedTable = React.forwardRef(Table);

export default ForwardedTable;
