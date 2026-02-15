import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Debug: confirm which backend the frontend is calling
if (typeof window !== 'undefined') {
  console.log('[api] NEXT_PUBLIC_API_URL =', process.env.NEXT_PUBLIC_API_URL);
  console.log('[api] baseURL resolved to =', API_BASE_URL);
}

// Create an axios instance targeting the backend
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token from localStorage on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 → attempt token refresh, then redirect to login on failure
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/api/v1/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        localStorage.setItem('access_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/v1/login', { email, password }),

  register: (userData: any) =>
    apiClient.post('/api/v1/register', userData),

  logout: () =>
    apiClient.post('/api/v1/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post('/api/v1/refresh', { refresh_token: refreshToken }),

  forgotPassword: (data: { email: string }) =>
    apiClient.post('/api/v1/forgot-password', data),

  resetPassword: (data: { token: string; new_password: string }) =>
    apiClient.post('/api/v1/reset-password', data),
};

export const userApi = {
  getProfile: () =>
    apiClient.get('/api/v1/me'),

  updateProfile: (userData: any) =>
    apiClient.put('/api/v1/me', userData),
};

export const taskApi = {
  getTasks: (params?: any) =>
    apiClient.get('/api/v1/tasks', { params }),

  createTask: (taskData: any) =>
    apiClient.post('/api/v1/tasks', taskData),

  getTask: (taskId: string) =>
    apiClient.get(`/api/v1/tasks/${taskId}`),

  updateTask: (taskId: string, taskData: any) =>
    apiClient.put(`/api/v1/tasks/${taskId}`, taskData),

  deleteTask: (taskId: string) =>
    apiClient.delete(`/api/v1/tasks/${taskId}`),

  toggleTaskComplete: (taskId: string, isCompleted: boolean) =>
    apiClient.patch(`/api/v1/tasks/${taskId}/complete`, { is_completed: isCompleted }),
};

export const priorityApi = {
  getPriorities: () =>
    apiClient.get('/api/v1/priorities'),

  createPriority: (priorityData: any) =>
    apiClient.post('/api/v1/priorities', priorityData),

  updatePriority: (priorityId: string, priorityData: any) =>
    apiClient.put(`/api/v1/priorities/${priorityId}`, priorityData),

  deletePriority: (priorityId: string) =>
    apiClient.delete(`/api/v1/priorities/${priorityId}`),
};

export const tagApi = {
  getTags: () =>
    apiClient.get('/api/v1/tags'),

  createTag: (tagData: any) =>
    apiClient.post('/api/v1/tags', tagData),

  updateTag: (tagId: string, tagData: any) =>
    apiClient.put(`/api/v1/tags/${tagId}`, tagData),

  deleteTag: (tagId: string) =>
    apiClient.delete(`/api/v1/tags/${tagId}`),
};

export const aiApi = {
  sendMessage: (messageData: any) =>
    apiClient.post('/api/v1/chat', messageData),
};
