import axios, { AxiosInstance } from 'axios';

// Create an axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to unauthorized and we haven't retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Attempt to refresh the token
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        localStorage.setItem('access_token', access_token);

        // Update refresh token as well to prevent using expired refresh tokens
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
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

// Export individual API functions for convenience
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
};

export const tagApi = {
  getTags: () =>
    apiClient.get('/api/v1/tags'),

  createTag: (tagData: any) =>
    apiClient.post('/api/v1/tags', tagData),
};

export const aiApi = {
  sendMessage: (messageData: any) =>
    apiClient.post('/api/v1/chat', messageData),
};