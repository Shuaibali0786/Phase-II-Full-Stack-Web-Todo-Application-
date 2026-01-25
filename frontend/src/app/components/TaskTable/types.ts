import { Task } from '@/types';

// Sort configuration
export type SortColumn = 'title' | 'is_completed' | 'priority' | 'due_date' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  column: SortColumn;
  order: SortOrder;
}

// Pagination configuration
export type PageSize = 10 | 25 | 50 | 100;

export interface PaginationConfig {
  currentPage: number;
  pageSize: PageSize;
  totalTasks: number;
}

// Table props
export interface TaskTableProps {
  onAddTask?: () => void;  // Callback when Add Task button clicked
  onEditTask?: (task: Task) => void;  // Callback when Edit button clicked
  onDeleteTask?: (task: Task) => void;  // Callback when Delete button clicked
  onTaskUpdated?: () => void;  // Callback after task changes (e.g., completion toggle)
  refreshTrigger?: number;  // Increment to trigger a task list refresh
}

// TableHeader props
export interface TableHeaderProps {
  sortConfig: SortConfig;
  onSort: (column: SortColumn) => void;
}

// TableRow props
export interface TableRowProps {
  task: Task;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// PaginationControls props
export interface PaginationControlsProps {
  currentPage: number;
  pageSize: PageSize;
  totalTasks: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
}
