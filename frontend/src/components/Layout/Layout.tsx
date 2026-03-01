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
        <div className="container header-inner">
          <Link to="/" className="logo">
            <img src="/PC.png" alt="Crowdfunding Logo" className="logo-image" />
            <h1>Crowdfunding</h1>
          </Link>
          <nav className="header-nav">
            <NavLink to="/" end className="header-nav-link">
              プロジェクト一覧
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/projects/create" className="header-nav-link">
                  プロジェクト作成
                </NavLink>
                <NavLink to="/projects/my" className="header-nav-link">
                  マイプロジェクト
                </NavLink>
                <NavLink to="/pledges/my" className="header-nav-link">
                  マイ支援
                </NavLink>
                <NavLink to="/admin" className="header-nav-link">
                  管理画面
                </NavLink>
                <span className="header-user">{user?.username}</span>
                <button type="button" onClick={handleLogout} className="header-logout-btn">
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="header-nav-link">
                  ログイン
                </NavLink>
                <NavLink to="/register" className="header-nav-link">
                  登録
                </NavLink>
              </>
            )}
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
      <HelpModal />
    </div>
  );
};
