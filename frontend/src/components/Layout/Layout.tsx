import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HelpModal } from '../HelpModal/HelpModal';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/PC.png" alt="Crowdfunding Logo" className="logo-image" />
            <h1>Crowdfunding</h1>
          </Link>
          <nav className="nav">
            <Link to="/">プロジェクト一覧</Link>
            {isAuthenticated ? (
              <>
                <Link to="/projects/create">プロジェクト作成</Link>
                <Link to="/projects/my">マイプロジェクト</Link>
                <Link to="/pledges/my">マイ支援</Link>
                <Link to="/admin">管理画面</Link>
                <span className="user-info">
                  {user?.username}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link to="/login">ログイン</Link>
                <Link to="/register">登録</Link>
              </>
            )}
            <HelpModal />
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Crowdfunding Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
