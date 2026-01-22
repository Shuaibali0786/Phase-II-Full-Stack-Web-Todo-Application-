import React, { useState } from 'react';
import { Priority, Tag } from '../../../types';

interface SearchFilterBarProps {
  priorities: Priority[];
  tags: Tag[];
  onFiltersChange: (filters: {
    searchQuery: string;
    completedFilter: boolean | null;
    priorityFilter: string | null;
    tagFilter: string | null;
    sortField: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  priorities,
  tags,
  onFiltersChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [completedFilter, setCompletedFilter] = useState<boolean | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleInputChange = () => {
    onFiltersChange({
      searchQuery,
      completedFilter,
      priorityFilter,
      tagFilter,
      sortField,
      sortOrder
    });
  };

  return (
    <div className="search-filter-bar">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleInputChange();
          }}
        />
      </div>

      <div className="filter-options">
        <div className="filter-item">
          <label>Status:</label>
          <select
            value={completedFilter === null ? 'all' : completedFilter ? 'completed' : 'pending'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all') setCompletedFilter(null);
              else setCompletedFilter(value === 'completed');
              handleInputChange();
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Priority:</label>
          <select
            value={priorityFilter || ''}
            onChange={(e) => {
              setPriorityFilter(e.target.value || null);
              handleInputChange();
            }}
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Tag:</label>
          <select
            value={tagFilter || ''}
            onChange={(e) => {
              setTagFilter(e.target.value || null);
              handleInputChange();
            }}
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Sort By:</label>
          <select
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              handleInputChange();
            }}
          >
            <option value="created_at">Created Date</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc');
              handleInputChange();
            }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
      <style jsx>{`
        .search-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          margin-bottom: 16px;
        }
        .search-input input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        .filter-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }
        .filter-item {
          display: flex;
          flex-direction: column;
        }
        .filter-item label {
          margin-bottom: 4px;
          font-weight: bold;
          font-size: 0.9em;
        }
        .filter-item select {
          padding: 6px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default SearchFilterBar;