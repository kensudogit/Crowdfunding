export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
}

export interface Project {
  id: number;
  creator_id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  image_url?: string;
  category?: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  creator?: User;
  total_pledged?: number;
  pledge_count?: number;
}

export interface Pledge {
  id: number;
  project_id: number;
  user_id: number;
  amount: number;
  reward_tier?: string;
  created_at: string;
  user?: User;
  project?: Project;
}

export interface Comment {
  id: number;
  project_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
