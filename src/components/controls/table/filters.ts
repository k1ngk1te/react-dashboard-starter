import { rankItem, rankings } from '@tanstack/match-sorter-utils';
import dayjs from 'dayjs';

import { filters as utilityFilters } from '../../../utils';

import type { RankingInfo } from '@tanstack/match-sorter-utils';
import type { Row } from '@tanstack/react-table';

// most of table work acceptably well with this function
const fuzzyFilter = <TData extends Record<string, any> = object>(
  row: Row<TData>,
  columnId: string,
  filterValue: string | number,
  addMeta: (item: RankingInfo) => void
) => {
  const itemRank = rankItem(row.getValue(columnId), filterValue as string, {
    threshold: rankings.MATCHES,
  });
  addMeta(itemRank);
  return itemRank.passed;
};

fuzzyFilter.autoRemove = (val: any) => !val;

//  if the value is falsy, then the columnFilters state entry for that filter will removed from that array.
// https://github.com/KevinVandy/material-react-table/discussions/223#discussioncomment-4249221

const containsFilter = <TData extends Record<string, any> = object>(
  row: Row<TData>,
  id: string,
  filterValue: string | number = ''
) => {
  return utilityFilters.contains(row.getValue<string | number>(id), filterValue.toString());
};

containsFilter.autoRemove = (val: any) => !val;

const dateRangeFilter = <TData extends Record<string, any> = object>(
  row: Row<TData>,
  id: string,
  filterValue: (dayjs.Dayjs | Date | string)[] = []
) => {
  if (!Array.isArray(filterValue)) return true;

  const value = String(row.getValue(id));
  const [start, end] = filterValue;

  if (!start && !end) return true;

  if ((start || end) && !value) return false;

  const date = dayjs(dayjs(value).format('YYYY-MM-DD'));
  const fromDate = start ? dayjs(start).format('YYYY-MM-DD') : undefined;
  const toDate = end ? dayjs(end).format('YYYY-MM-DD') : undefined;

  // Note: Did double dayjs initialization to remove time and get fresh from hours and late to hours.
  const from = fromDate ? dayjs(fromDate) : undefined;
  const to = toDate ? dayjs(toDate) : undefined;

  if (!date.isValid() || (from && !from.isValid()) || (to && !to.isValid())) return false;

  if (from && !to) return date.isSame(from) || date.isAfter(from);
  else if (!from && to) return date.isSame(to) || date.isBefore(to);
  else if (from && to) {
    return (date.isSame(from) || date.isAfter(from)) && (date.isSame(to) || date.isBefore(to));
  }
  return true;
};

dateRangeFilter.autoRemove = (val: any) => !val;

const startsWithFilter = <TData extends Record<string, any> = object>(
  row: Row<TData>,
  id: string,
  filterValue: string | number = ''
) =>
  row
    .getValue<string | number>(id)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim());

startsWithFilter.autoRemove = (val: any) => !val;

const equalWithFilter = <TData extends Record<string, any> = object>(
  row: Row<TData>,
  id: string,
  filterValue: string | number = ''
) => {
  const columnValue = row.getValue<string | number>(id).toString().toLowerCase().trim();

  return columnValue === filterValue.toString().toLowerCase().trim();
};

equalWithFilter.autoRemove = (val: any) => !val;

export const contains = containsFilter;
export const dateRange = dateRangeFilter;
export const equal = equalWithFilter;
export const fuzzy = fuzzyFilter;
export const starts = startsWithFilter;

const filters = {
  contains,
  dateRange,
  equal,
  fuzzy,
  starts,
};

export default filters;
