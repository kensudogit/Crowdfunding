import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { Project } from '../types';
import './Home.css';

const CATEGORIES = [
  '',
  'テクノロジー',
  'アート',
  '音楽',
  'ゲーム',
  '食品',
  '本',
  '映画',
  'その他',
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'newest', label: '新着順' },
  { value: 'most_funded', label: '支援額が多い順' },
  { value: 'ending_soon', label: '終了間近' },
];

const LIMIT = 20;

export const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll(page, LIMIT, {
        search: search || undefined,
        category: category || undefined,
        sort,
      });
      if (response?.projects) {
        setProjects(response.projects);
        setTotal(response.total ?? 0);
      } else {
        setProjects([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

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

  return (
    <div className="home">
      <h1>プロジェクト一覧</h1>

      <div className="home-filters">
        <form onSubmit={handleSearchSubmit} className="home-search-form">
          <input
            type="search"
            placeholder="キーワードで検索..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="home-search-input"
            aria-label="検索"
          />
          <button type="submit" className="home-search-btn">
            検索
          </button>
        </form>
        <div className="home-filter-row">
          <label className="home-filter-label">
            カテゴリ
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="home-select"
            >
              <option value="">すべて</option>
              {CATEGORIES.filter(Boolean).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="home-filter-label">
            並び順
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="home-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {(search || category) && (
          <div className="home-filter-tags">
            {search && (
              <span className="home-filter-tag">
                検索: {search}
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                    setPage(1);
                  }}
                  aria-label="検索を解除"
                >
                  ×
                </button>
              </span>
            )}
            {category && (
              <span className="home-filter-tag">
                {category}
                <button
                  type="button"
                  onClick={() => {
                    setCategory('');
                    setPage(1);
                  }}
                  aria-label="カテゴリを解除"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <p>プロジェクトがありません</p>
          {(search || category) && (
            <p className="empty-hint">
              検索条件を変えるか、条件を解除してみてください。
            </p>
          )}
          {!search && !category && (
            <>
              <p className="empty-hint">
                サンプルデータを生成するには、<a href="/admin">管理画面</a>から「サンプルデータを生成」をクリックしてください。
              </p>
              <p className="empty-hint" style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#e74c3c' }}>
                ※ バックエンドサーバーが起動していない場合は、データを取得できません。
                <br />
                Docker環境を起動するには、<code>start-dev.bat</code>を実行してください。
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="home-result-count">
            全 {total} 件 {totalPages > 1 && `（${page} / ${totalPages} ページ）`}
          </p>
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
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              前へ
            </button>
            <span>ページ {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              次へ
            </button>
          </div>
        </>
      )}
    </div>
  );
};
