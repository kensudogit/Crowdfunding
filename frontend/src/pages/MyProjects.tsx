import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../services/api';
import { Project } from '../types';
import './MyProjects.css';

export const MyProjects = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getMyProjects();
      setProjects(response.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
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
    <div className="my-projects">
      <div className="my-projects-header">
        <h1>マイプロジェクト</h1>
        <Link to="/projects/create" className="create-btn">
          新しいプロジェクトを作成
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>まだプロジェクトがありません</p>
          <Link to="/projects/create" className="create-btn">
            最初のプロジェクトを作成
          </Link>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="project-item">
              {project.image_url && (
                <img src={project.image_url} alt={project.title} className="project-thumb" />
              )}
              <div className="project-info">
                <h3>
                  <Link to={`/projects/${project.id}`}>{project.title}</Link>
                </h3>
                <p className="project-description">
                  {project.description.substring(0, 150)}
                  {project.description.length > 150 ? '...' : ''}
                </p>
                <div className="project-stats">
                  <span>目標: {formatCurrency(project.goal_amount)}</span>
                  <span>現在: {formatCurrency(project.current_amount)}</span>
                  <span className={`status status-${project.status}`}>{project.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
