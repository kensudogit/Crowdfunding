import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../services/api';
import './CreateProject.css';

export const CreateProject = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: '',
    image_url: '',
    category: '',
    end_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      const project = await projectAPI.create({
        ...formData,
        goal_amount: parseFloat(formData.goal_amount),
      });
      navigate(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'プロジェクト作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="create-project">
      <h1>新しいプロジェクトを作成</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">プロジェクトタイトル *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">説明 *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            rows={10}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="goal_amount">目標金額 *</label>
            <input
              type="number"
              id="goal_amount"
              name="goal_amount"
              value={formData.goal_amount}
              onChange={handleChange}
              required
              min="1"
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">カテゴリー</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="テクノロジー">テクノロジー</option>
              <option value="アート">アート</option>
              <option value="音楽">音楽</option>
              <option value="映画">映画</option>
              <option value="ゲーム">ゲーム</option>
              <option value="本">本</option>
              <option value="食品">食品</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image_url">画像URL</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="end_date">終了日 *</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? '作成中...' : 'プロジェクトを作成'}
        </button>
      </form>
    </div>
  );
};
