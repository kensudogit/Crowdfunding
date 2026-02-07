import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SidePanel } from '../SidePanel/SidePanel';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/PC.png" alt="Crowdfunding Logo" className="logo-image" />
            <h1>Crowdfunding</h1>
          </Link>
        </div>
      </header>
      <div className="layout-with-sidepanel">
        <SidePanel />
        <main className="main">
          <div className="container">{children}</div>
        </main>
      </div>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Crowdfunding Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
