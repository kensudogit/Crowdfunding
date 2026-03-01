import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI, pledgeAPI, commentAPI } from '../services/api';
import { Project, Pledge, Comment } from '../types';
import './ProjectDetail.css';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      alert('リンクのコピーに失敗しました');
    }
  };

  useEffect(() => {
    if (id) {
      loadProject();
      loadPledges();
      loadComments();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectAPI.getById(parseInt(id!));
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPledges = async () => {
    try {
      const response = await pledgeAPI.getByProject(parseInt(id!));
      setPledges(response.pledges);
    } catch (error) {
      console.error('Failed to load pledges:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await commentAPI.getByProject(parseInt(id!));
      setComments(response.comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handlePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await pledgeAPI.create(parseInt(id!), {
        amount: parseFloat(pledgeAmount),
      });
      setPledgeAmount('');
      setShowPledgeForm(false);
      loadProject();
      loadPledges();
    } catch (error: any) {
      alert(error.response?.data?.error || '支援に失敗しました');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await commentAPI.create(parseInt(id!), commentContent);
      setCommentContent('');
      loadComments();
    } catch (error: any) {
      alert(error.response?.data?.error || 'コメント投稿に失敗しました');
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

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!project) {
    return <div className="error">プロジェクトが見つかりません</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        {project.image_url && (
          <img src={project.image_url} alt={project.title} className="project-hero-image" />
        )}
        <div className="project-info">
          <div className="project-title-row">
            <h1>{project.title}</h1>
            <button
              type="button"
              onClick={handleShare}
              className="project-share-btn"
              title="リンクをコピー"
              aria-label="リンクをコピー"
            >
              {shareCopied ? '✓ コピーしました' : '共有'}
            </button>
          </div>
          <div className="project-creator-info">
            <span>作成者: {project.creator?.username || 'Unknown'}</span>
            {project.category && (
              <span className="category-badge">{project.category}</span>
            )}
          </div>
        </div>
      </div>

      <div className="project-body">
        <div className="project-main">
          <div className="project-description">
            <h2>プロジェクトについて</h2>
            <p>{project.description}</p>
          </div>

          <div className="comments-section">
            <h2>コメント ({comments.length})</h2>
            {isAuthenticated ? (
              <form onSubmit={handleComment} className="comment-form">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="コメントを入力..."
                  required
                  rows={3}
                />
                <button type="submit">コメント投稿</button>
              </form>
            ) : (
              <p>
                <a href="/login">ログイン</a>してコメントを投稿
              </p>
            )}
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.username}</span>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="project-sidebar">
          <div className="funding-card">
            <div className="funding-stats">
              <div className="funding-amount">
                <span className="current">{formatCurrency(project.current_amount)}</span>
                <span className="goal">目標: {formatCurrency(project.goal_amount)}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${calculateProgress(project.current_amount, project.goal_amount)}%`,
                  }}
                />
              </div>
              <div className="funding-meta">
                <span>支援者数: {pledges.length}人</span>
                <span>
                  終了日: {new Date(project.end_date).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                {!showPledgeForm ? (
                  <button
                    onClick={() => setShowPledgeForm(true)}
                    className="pledge-btn"
                  >
                    このプロジェクトを支援する
                  </button>
                ) : (
                  <form onSubmit={handlePledge} className="pledge-form">
                    <input
                      type="number"
                      value={pledgeAmount}
                      onChange={(e) => setPledgeAmount(e.target.value)}
                      placeholder="支援金額"
                      min="1"
                      step="1"
                      required
                    />
                    <div className="pledge-form-actions">
                      <button type="submit">支援する</button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPledgeForm(false);
                          setPledgeAmount('');
                        }}
                      >
                        キャンセル
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <a href="/login" className="pledge-btn">
                ログインして支援する
              </a>
            )}
          </div>

          <div className="pledges-list">
            <h3>最近の支援</h3>
            {pledges.length === 0 ? (
              <p>まだ支援がありません</p>
            ) : (
              <ul>
                {pledges.slice(0, 10).map((pledge) => (
                  <li key={pledge.id}>
                    <span className="pledge-user">{pledge.user?.username || 'Anonymous'}</span>
                    <span className="pledge-amount">{formatCurrency(pledge.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
