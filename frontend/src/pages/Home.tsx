import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { Project } from '../types';
import './Home.css';

export const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadProjects();
  }, [page]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll(page, 20);
      if (response && response.projects) {
        setProjects(response.projects);
      } else {
        setProjects([]);
      }
    } catch (error: any) {
      console.error('Failed to load projects:', error);
      // ネットワークエラーの場合は空配列を設定（エラーメッセージは表示しない）
      // バックエンドが起動していない場合は、空の状態メッセージが表示される
      setProjects([]);
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

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="home">
      <h1>プロジェクト一覧</h1>
      {projects.length === 0 && !loading ? (
        <div className="empty-state">
          <p>プロジェクトがありません</p>
          <p className="empty-hint">
            サンプルデータを生成するには、<a href="/admin">管理画面</a>から「サンプルデータを生成」をクリックしてください。
          </p>
          <p className="empty-hint" style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#e74c3c' }}>
            ※ バックエンドサーバーが起動していない場合は、データを取得できません。
            <br />
            Docker環境を起動するには、<code>start-dev.bat</code>を実行してください。
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-card"
            >
              {project.image_url && (
                <div className="project-image">
                  <img src={project.image_url} alt={project.title} />
                </div>
              )}
              <div className="project-content">
                <h3>{project.title}</h3>
                <p className="project-description">
                  {project.description.substring(0, 100)}
                  {project.description.length > 100 ? '...' : ''}
                </p>
                <div className="project-meta">
                  <div className="project-creator">
                    {project.creator?.username || 'Unknown'}
                  </div>
                  {project.category && (
                    <span className="project-category">{project.category}</span>
                  )}
                </div>
                <div className="project-stats">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${calculateProgress(
                          project.current_amount,
                          project.goal_amount
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="project-amounts">
                    <span className="current-amount">
                      {formatCurrency(project.current_amount)}
                    </span>
                    <span className="goal-amount">
                      / {formatCurrency(project.goal_amount)}
                    </span>
                    <span className="progress-percentage">
                      ({Math.round(calculateProgress(project.current_amount, project.goal_amount))}%)
                    </span>
                  </div>
                  <div className="project-meta-info">
                    <div className="project-days">
                      あと {getDaysRemaining(project.end_date)} 日
                    </div>
                    {project.pledge_count !== undefined && (
                      <div className="project-supporters">
                        {project.pledge_count}人の支援者
                      </div>
                    )}
                    {project.category && (
                      <div className="project-category-badge">
                        {project.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          前へ
        </button>
        <span>ページ {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={projects.length < 20}
        >
          次へ
        </button>
      </div>
    </div>
  );
};
