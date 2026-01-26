import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message ||
                          (err.message && err.message.includes('Network') 
                            ? 'サーバーに接続できません。バックエンドが起動しているか確認してください。'
                            : '登録に失敗しました');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>新規登録</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="first_name">名（任意）</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="given-name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">姓（任意）</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="family-name"
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '登録中...' : '登録'}
          </button>
        </form>
        <p className="auth-link">
          既にアカウントをお持ちの方は <Link to="/login">こちらからログイン</Link>
        </p>
      </div>
    </div>
  );
};
