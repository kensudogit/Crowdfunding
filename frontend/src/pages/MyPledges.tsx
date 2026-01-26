import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pledgeAPI } from '../services/api';
import { Pledge } from '../types';
import './MyPledges.css';

export const MyPledges = () => {
  const { isAuthenticated } = useAuth();
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadPledges();
    }
  }, [isAuthenticated]);

  const loadPledges = async () => {
    try {
      const response = await pledgeAPI.getMyPledges();
      setPledges(response.pledges);
    } catch (error) {
      console.error('Failed to load pledges:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  if (!isAuthenticated) {
    return <div className="error">ログインが必要です</div>;
  }

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="my-pledges">
      <h1>マイ支援</h1>

      {pledges.length === 0 ? (
        <div className="empty-state">
          <p>まだ支援したプロジェクトがありません</p>
          <Link to="/" className="browse-btn">
            プロジェクトを探す
          </Link>
        </div>
      ) : (
        <div className="pledges-list">
          {pledges.map((pledge) => (
            <div key={pledge.id} className="pledge-item">
              {pledge.project?.image_url && (
                <img
                  src={pledge.project.image_url}
                  alt={pledge.project.title}
                  className="pledge-thumb"
                />
              )}
              <div className="pledge-info">
                <h3>
                  <Link to={`/projects/${pledge.project_id}`}>
                    {pledge.project?.title || 'プロジェクト'}
                  </Link>
                </h3>
                <div className="pledge-details">
                  <span className="pledge-amount">{formatCurrency(pledge.amount)}</span>
                  <span className="pledge-date">
                    {new Date(pledge.created_at).toLocaleDateString('ja-JP')}
                  </span>
                  {pledge.reward_tier && (
                    <span className="pledge-reward">{pledge.reward_tier}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
