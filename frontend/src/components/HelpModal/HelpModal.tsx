import { useState, useEffect, useRef } from 'react';
import './HelpModal.css';

const STORAGE_BTN_POSITION = 'helpModalBtnPosition';
const STORAGE_MODAL_POSITION = 'helpModalPosition';

export const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [btnPosition, setBtnPosition] = useState(() => {
    const saved = localStorage.getItem(STORAGE_BTN_POSITION);
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        return { x: Number(x) ?? 16, y: Number(y) ?? 80 };
      } catch {
        return { x: 16, y: 80 };
      }
    }
    return { x: 16, y: 80 };
  });
  const [modalPosition, setModalPosition] = useState(() => {
    const saved = localStorage.getItem(STORAGE_MODAL_POSITION);
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        return { x: Number(x) ?? 100, y: Number(y) ?? 60 };
      } catch {
        return { x: 100, y: 60 };
      }
    }
    return { x: 100, y: 60 };
  });
  const [dragState, setDragState] = useState<{ type: 'btn' | 'modal'; startX: number; startY: number; startLeft: number; startTop: number } | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
    section7: false,
    section8: false,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_BTN_POSITION, JSON.stringify(btnPosition));
  }, [btnPosition]);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(STORAGE_MODAL_POSITION, JSON.stringify(modalPosition));
    }
  }, [modalPosition, isOpen]);

  useEffect(() => {
    if (!dragState) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      if (dragState.type === 'btn') {
        const maxX = window.innerWidth - 120;
        const maxY = window.innerHeight - 48;
        setBtnPosition({
          x: Math.max(0, Math.min(dragState.startLeft + dx, maxX)),
          y: Math.max(0, Math.min(dragState.startTop + dy, maxY)),
        });
      } else {
        const el = modalRef.current;
        const w = el ? el.offsetWidth : 400;
        const h = el ? el.offsetHeight : 400;
        const maxX = window.innerWidth - w;
        const maxY = window.innerHeight - h;
        setModalPosition({
          x: Math.max(0, Math.min(dragState.startLeft + dx, maxX)),
          y: Math.max(0, Math.min(dragState.startTop + dy, maxY)),
        });
      }
    };
    const handleUp = () => setDragState(null);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.body.style.userSelect = '';
    };
  }, [dragState]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleBtnMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.help-btn-drag-handle')) {
      e.preventDefault();
      setDragState({
        type: 'btn',
        startX: e.clientX,
        startY: e.clientY,
        startLeft: btnPosition.x,
        startTop: btnPosition.y,
      });
    }
  };

  const handleBtnClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.help-btn-drag-handle')) return;
    openModal();
  };

  const handleModalHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setDragState({
      type: 'modal',
      startX: e.clientX,
      startY: e.clientY,
      startLeft: modalPosition.x,
      startTop: modalPosition.y,
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <>
      <div
        className="help-float-wrapper"
        style={{ left: btnPosition.x, top: btnPosition.y }}
        onMouseDown={handleBtnMouseDown}
      >
        <span className="help-btn-drag-handle" title="ドラッグして移動">☰</span>
        <button type="button" onClick={handleBtnClick} className="help-btn" aria-label="操作手順を開く">
          ❓ 操作手順
        </button>
      </div>

      {isOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal} aria-hidden />
          <div
            ref={modalRef}
            className="modal-content modal-content-draggable"
            style={{ left: modalPosition.x, top: modalPosition.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header modal-header-green modal-header-draggable"
              onMouseDown={handleModalHeaderMouseDown}
              role="button"
              tabIndex={0}
              title="ドラッグして移動"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  (e.target as HTMLElement).focus();
                }
              }}
            >
              <span className="modal-header-icon" aria-hidden>📖</span>
              <h2>操作手順</h2>
              <button type="button" className="close-btn close-btn-in-header" onClick={closeModal} aria-label="閉じる">
                ×
              </button>
            </div>
            <div className="modal-body">
              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section1')}>
                  <span className="step-num">1</span>
                  <h3>アカウント登録・ログイン</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section1 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section1 && (
                  <div className="section-content">
                    <ol>
                      <li>ヘッダーの「登録」をクリック</li>
                      <li>ユーザー名、メールアドレス、パスワードを入力</li>
                      <li>「登録」ボタンをクリックしてアカウントを作成</li>
                      <li>既にアカウントをお持ちの場合は「ログイン」からログイン</li>
                    </ol>
                  </div>
                )}
              </section>

              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section2')}>
                  <span className="step-num">2</span>
                  <h3>プロジェクトの閲覧</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section2 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section2 && (
                  <div className="section-content">
                    <ol>
                      <li>トップページでプロジェクト一覧を確認</li>
                      <li>興味のあるプロジェクトカードをクリック</li>
                      <li>プロジェクト詳細ページで詳細情報、進捗、コメントを確認</li>
                      <li>ページネーションボタンで他のプロジェクトを閲覧</li>
                    </ol>
                  </div>
                )}
              </section>

              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section3')}>
                  <span className="step-num">3</span>
                  <h3>プロジェクトの作成</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section3 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section3 && (
                  <div className="section-content">
                    <ol>
                      <li>ログイン後、ヘッダーの「プロジェクト作成」をクリック</li>
                      <li>以下の情報を入力：
                        <ul>
                          <li>プロジェクトタイトル（必須）</li>
                          <li>説明（必須、10文字以上）</li>
                          <li>目標金額（必須）</li>
                          <li>カテゴリー（任意）</li>
                          <li>画像URL（任意）</li>
                          <li>終了日（必須）</li>
                        </ul>
                      </li>
                      <li>「プロジェクトを作成」ボタンをクリック</li>
                      <li>作成後、プロジェクト詳細ページに自動遷移</li>
                    </ol>
                  </div>
                )}
              </section>

              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section4')}>
                  <span className="step-num">4</span>
                  <h3>プロジェクトへの支援</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section4 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section4 && (
                  <div className="section-content">
                    <ol>
                      <li>プロジェクト詳細ページを開く</li>
                      <li>「このプロジェクトを支援する」ボタンをクリック</li>
                      <li>支援金額を入力</li>
                      <li>「支援する」ボタンをクリック</li>
                      <li>支援が完了すると、プロジェクトの進捗が更新されます</li>
                    </ol>
                    <p className="note">※ ログインが必要です</p>
                  </div>
                )}
              </section>

              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section5')}>
                  <span className="step-num">5</span>
                  <h3>コメントの投稿</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section5 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section5 && (
                  <div className="section-content">
                    <ol>
                      <li>プロジェクト詳細ページを開く</li>
                      <li>コメントセクションまでスクロール</li>
                      <li>コメント入力欄にテキストを入力</li>
                      <li>「コメント投稿」ボタンをクリック</li>
                      <li>自分のコメントは編集・削除が可能です</li>
                    </ol>
                    <p className="note">※ ログインが必要です</p>
                  </div>
                )}
              </section>

              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section6')}>
                  <span className="step-num">6</span>
                  <h3>マイプロジェクト・マイ支援の確認</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section6 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section6 && (
                  <div className="section-content">
                    <ol>
                      <li>ログイン後、ヘッダーの「マイプロジェクト」をクリック</li>
                      <li>自分が作成したプロジェクトの一覧を確認</li>
                      <li>「マイ支援」をクリックすると、自分が支援したプロジェクトの一覧を確認</li>
                      <li>各プロジェクトをクリックして詳細を確認</li>
                    </ol>
                  </div>
                )}
              </section>

              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section7')}>
                  <span className="step-num">7</span>
                  <h3>プロジェクトの編集・削除</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section7 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section7 && (
                  <div className="section-content">
                    <ol>
                      <li>「マイプロジェクト」から自分のプロジェクトを選択</li>
                      <li>プロジェクト詳細ページを開く</li>
                      <li>（編集・削除機能は今後実装予定）</li>
                    </ol>
                    <p className="note">※ 作成者のみが編集・削除可能です</p>
                  </div>
                )}
              </section>

              <section className="help-section help-section-card">
                <div className="section-header" onClick={() => toggleSection('section8')}>
                  <span className="step-num">Q</span>
                  <h3>よくある質問</h3>
                  <button type="button" className="toggle-btn">
                    {expandedSections.section8 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section8 && (
                  <div className="section-content">
                    <dl>
                      <dt>Q: 支援したお金はいつ引き落とされますか？</dt>
                      <dd>A: 現在はデモ環境のため、実際の決済処理は行われません。</dd>
                      <dt>Q: プロジェクトの目標金額に達しなかった場合はどうなりますか？</dt>
                      <dd>A: プロジェクトのステータスが「未達成」となり、支援金は返金されます（実装予定）。</dd>
                      <dt>Q: 複数のプロジェクトに支援できますか？</dt>
                      <dd>A: はい、複数のプロジェクトに支援することができます。</dd>
                      <dt>Q: プロジェクトの画像はどこで取得できますか？</dt>
                      <dd>A: 画像URLを入力する必要があります。画像ホスティングサービス（Imgur、Cloudinary等）を使用してください。</dd>
                    </dl>
                  </div>
                )}
              </section>
            </div>
            <div className="modal-footer modal-footer-green">
              <button type="button" onClick={closeModal} className="close-modal-btn close-modal-btn-green">
                閉じる
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
