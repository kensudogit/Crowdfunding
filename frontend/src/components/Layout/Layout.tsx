import { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
            <NavLink to="/" end>プロジェクト一覧</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/projects/create">プロジェクト作成</NavLink>
                <NavLink to="/projects/my">マイプロジェクト</NavLink>
                <NavLink to="/pledges/my">マイ支援</NavLink>
                <NavLink to="/admin">管理画面</NavLink>
                <span className="user-info">
                  {user?.username}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">ログイン</NavLink>
                <NavLink to="/register">登録</NavLink>
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
