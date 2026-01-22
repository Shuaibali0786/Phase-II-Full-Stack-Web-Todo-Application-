'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { TableHeaderProps, SortColumn } from './types';

export default function TableHeader({ sortConfig, onSort }: TableHeaderProps) {
  const getSortIcon = (column: SortColumn) => {
    if (sortConfig.column !== column) {
      return <ChevronsUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.order === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleSort = (column: SortColumn) => {
    onSort(column);
  };

  const headerCellClass = "px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-orange-400 transition-colors select-none";
  const sortButtonClass = "flex items-center gap-2 w-full";

  return (
    <thead className="bg-gray-800/50 border-b border-gray-700">
      <tr>
        {/* Checkbox Column */}
        <th className="px-4 py-3 w-12">
          <span className="sr-only">Complete</span>
        </th>

        {/* Title Column */}
        <th className={headerCellClass}>
          <button
            onClick={() => handleSort('title')}
            className={sortButtonClass}
            aria-label="Sort by title"
          >
            <span>Title</span>
            {getSortIcon('title')}
          </button>
        </th>

        {/* Status Column */}
        <th className={headerCellClass}>
          <button
            onClick={() => handleSort('is_completed')}
            className={sortButtonClass}
            aria-label="Sort by status"
          >
            <span>Status</span>
            {getSortIcon('is_completed')}
          </button>
        </th>

        {/* Priority Column */}
        <th className={headerCellClass}>
          <button
            onClick={() => handleSort('priority')}
            className={sortButtonClass}
            aria-label="Sort by priority"
          >
            <span>Priority</span>
            {getSortIcon('priority')}
          </button>
        </th>

        {/* Due Date Column */}
        <th className={headerCellClass}>
          <button
            onClick={() => handleSort('due_date')}
            className={sortButtonClass}
            aria-label="Sort by due date"
          >
            <span>Due Date</span>
            {getSortIcon('due_date')}
          </button>
        </th>

        {/* Actions Column */}
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
          Actions
        </th>
      </tr>
    </thead>
  );
}
