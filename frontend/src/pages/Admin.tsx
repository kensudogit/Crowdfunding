import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Admin.css';

export const Admin = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const generateSampleData = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/sample-data/generate');
      setMessage(`サンプルデータを生成しました: ${response.data.users}人のユーザー、${response.data.projects}個のプロジェクト`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'サンプルデータの生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="error">ログインが必要です</div>;
  }

  return (
    <div className="admin-page">
      <h1>管理画面</h1>
      <div className="admin-card">
        <h2>サンプルデータ生成</h2>
        <p>顧客プレゼン用のサンプルデータを生成します。</p>
        <p className="warning">※ 既存のデータは削除されます</p>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <button
          onClick={generateSampleData}
          disabled={loading}
          className="generate-btn"
        >
          {loading ? '生成中...' : 'サンプルデータを生成'}
        </button>
      </div>
    </div>
  );
};
