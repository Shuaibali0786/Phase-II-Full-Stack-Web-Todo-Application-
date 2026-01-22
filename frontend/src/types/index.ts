// User Interface
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Priority Interface
export interface Priority {
  id: string;
  name: string;
  value: number;
  color: string;
  created_at: string;
  updated_at: string;
}

// Tag Interface
export interface Tag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Task Interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority?: Priority;
  user_id: string;
  due_date?: string;
  reminder_time?: string;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

// Task Creation Interface
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority_id?: string;
  due_date?: string;
  reminder_time?: string;
  tag_ids?: string[];
}

// Task Update Interface
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority_id?: string;
  due_date?: string;
  reminder_time?: string;
  tag_ids?: string[];
  is_completed?: boolean;
}

// Priority Creation Interface
export interface CreatePriorityRequest {
  name: string;
  value: number;
  color: string;
}

// Tag Creation Interface
export interface CreateTagRequest {
  name: string;
  color: string;
}

// AI Message Request
export interface AIMessageRequest {
  message: string;
  context?: Record<string, any>;
}

// AI Message Response
export interface AIMessageResponse {
  response: string;
  actions?: Array<{
    action_type: 'create_task' | 'update_task' | 'delete_task' | 'mark_complete';
    task_data?: CreateTaskRequest;
    task_id?: string;
  }>;
}

// Token Response
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Registration Request
export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

// Task List Response
export interface TaskListResponse {
  tasks: Task[];
  total: number;
  offset: number;
  limit: number;
}

// Auth Context
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}