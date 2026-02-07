import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HelpModal } from '../HelpModal/HelpModal';
import './SidePanel.css';

export const SidePanel = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidePanelOpen');
    return saved !== null ? saved === 'true' : true;
  });
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('sidePanelPosition');
    if (saved) {
      const pos = JSON.parse(saved);
      return { x: pos.x || 0, y: pos.y || 80 };
    }
    return { x: 0, y: 80 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    localStorage.setItem('sidePanelOpen', String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('sidePanelPosition', JSON.stringify(position));
  }, [position]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      setIsDragging(true);
      const rect = panelRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && panelRef.current) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // 画面内に収まるように制限
        const maxX = window.innerWidth - panelRef.current.offsetWidth;
        const maxY = window.innerHeight - panelRef.current.offsetHeight;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStart]);

  return (
    <>
      <button 
        className="side-panel-toggle" 
        onClick={togglePanel} 
        aria-label="Toggle side panel"
        style={{
          left: isOpen ? `${position.x + 220}px` : `${position.x}px`,
          top: `${position.y + 100}px`,
        }}
      >
        {isOpen ? '◀' : '▶'}
      </button>
      <aside 
        ref={panelRef}
        className={`side-panel ${isOpen ? 'open' : 'closed'} ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div 
          className="side-panel-drag-handle"
          onMouseDown={handleMouseDown}
          title="ドラッグして移動"
        >
          <span className="drag-icon">☰</span>
          <span className="drag-text">リモコン盤</span>
          <button 
            className="side-panel-close-btn"
            onClick={togglePanel}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>
        <div className="side-panel-content">
          <nav className="side-nav">
            <NavLink to="/" end className="side-nav-link">
              プロジェクト一覧
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/projects/create" className="side-nav-link">
                  プロジェクト作成
                </NavLink>
                <NavLink to="/projects/my" className="side-nav-link">
                  マイプロジェクト
                </NavLink>
                <NavLink to="/pledges/my" className="side-nav-link">
                  マイ支援
                </NavLink>
                <NavLink to="/admin" className="side-nav-link">
                  管理画面
                </NavLink>
                <div className="side-user-info">
                  <span className="user-label">ユーザー:</span>
                  <span className="user-name">{user?.username}</span>
                </div>
                <button onClick={handleLogout} className="side-logout-btn">
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="side-nav-link">
                  ログイン
                </NavLink>
                <NavLink to="/register" className="side-nav-link">
                  登録
                </NavLink>
              </>
            )}
            <div className="side-help-section">
              <HelpModal />
            </div>
          </nav>
        </div>
      </aside>
      {isOpen && window.innerWidth <= 768 && (
        <div className="side-panel-overlay" onClick={togglePanel}></div>
      )}
    </>
  );
};
