import axios from 'axios';

// 環境変数からAPI URLを取得（ビルド時に設定される）
// 環境変数が設定されている場合はそれを使用、なければデフォルト値を使用
// 環境変数に /api が含まれていない場合は自動的に追加
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// 環境変数が設定されているが /api が含まれていない場合は追加
if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.endsWith('/api')) {
  // 末尾のスラッシュを削除してから /api を追加
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
  API_URL = `${baseUrl}/api`;
}

// デバッグ用：API URLを確認
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
  console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒のタイムアウト
});

// リクエストインターセプター（トークンを追加）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (!error.response) {
      // ネットワークエラーまたはサーバーが応答しない場合
      const errorMessage = error.code === 'ECONNABORTED' 
        ? 'リクエストがタイムアウトしました。バックエンドサーバーが応答していません。'
        : error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')
        ? 'ネットワークエラー: バックエンドサーバーに接続できません。サーバーが起動しているか確認してください。'
        : 'サーバーに接続できません。バックエンドが起動しているか確認してください。';
      
      console.error('Network error:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      });
      
      return Promise.reject({
        ...error,
        response: {
          data: {
            error: errorMessage
          },
          status: 503
        }
      });
    }
    return Promise.reject(error);
  }
);

// 認証API
export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// プロジェクトAPI
export const projectAPI = {
  getAll: async (page: number = 1, limit: number = 20, status?: string) => {
    const response = await api.get('/projects', {
      params: { page, limit, status },
    });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (data: {
    title: string;
    description: string;
    goal_amount: number;
    image_url?: string;
    category?: string;
    end_date: string;
  }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  update: async (id: number, data: Partial<{
    title: string;
    description: string;
    goal_amount: number;
    image_url?: string;
    category?: string;
    end_date: string;
    status: string;
  }>) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  getMyProjects: async () => {
    const response = await api.get('/projects/my');
    return response.data;
  },
};

// 支援API
export const pledgeAPI = {
  create: async (projectId: number, data: { amount: number; reward_tier?: string }) => {
    const response = await api.post(`/pledges/project/${projectId}`, data);
    return response.data;
  },
  getByProject: async (projectId: number) => {
    const response = await api.get(`/pledges/project/${projectId}`);
    return response.data;
  },
  getMyPledges: async () => {
    const response = await api.get('/pledges/my');
    return response.data;
  },
};

// コメントAPI
export const commentAPI = {
  getByProject: async (projectId: number) => {
    const response = await api.get(`/comments/project/${projectId}`);
    return response.data;
  },
  create: async (projectId: number, content: string) => {
    const response = await api.post(`/comments/project/${projectId}`, { content });
    return response.data;
  },
  update: async (commentId: number, content: string) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
  delete: async (commentId: number) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default api;
