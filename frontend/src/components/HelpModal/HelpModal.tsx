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
                      <li>画面上部のヘッダー右側にある「登録」リンクをクリックし、登録ページへ移動します。</li>
                      <li>登録フォームに以下を入力します。
                        <ul>
                          <li><strong>ユーザー名</strong>：ログイン時に使用する名前（他のユーザーに表示されます）</li>
                          <li><strong>メールアドレス</strong>：有効なメール形式で入力</li>
                          <li><strong>パスワード</strong>：十分な長さ・強度のパスワードを設定</li>
                        </ul>
                      </li>
                      <li>入力内容を確認し、「登録」ボタンをクリックしてアカウントを作成します。</li>
                      <li>登録が完了するとログイン状態になります。既にアカウントがある場合は、ヘッダーの「ログイン」をクリックし、メールアドレスとパスワードでログインしてください。</li>
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
                      <li>「プロジェクト一覧」またはロゴをクリックしてトップページを開き、一覧表示されているプロジェクトカードを確認します。</li>
                      <li>各カードにはタイトル・目標金額・達成率・終了日などが表示されています。興味のあるプロジェクトのカードをクリックします。</li>
                      <li>プロジェクト詳細ページでは以下を確認できます。
                        <ul>
                          <li>プロジェクトの説明・カテゴリー・画像</li>
                          <li>目標金額と現在の支援額（達成率）</li>
                          <li>支援者数・コメント一覧</li>
                        </ul>
                      </li>
                      <li>一覧が複数ページある場合、画面下部のページ番号や「次へ」ボタンで他のプロジェクトを閲覧できます。</li>
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
                      <li>ログインした状態で、ヘッダーの「プロジェクト作成」をクリックし、作成フォームを開きます。</li>
                      <li>次の項目を入力します。
                        <ul>
                          <li><strong>プロジェクトタイトル</strong>（必須）：わかりやすいタイトルを付けてください。</li>
                          <li><strong>説明</strong>（必須）：10文字以上で、内容・目的・リターンなどを記載します。</li>
                          <li><strong>目標金額</strong>（必須）：達成したい金額を数値で入力（単位：円）。</li>
                          <li><strong>カテゴリー</strong>（任意）：該当するカテゴリーを選択または入力。</li>
                          <li><strong>画像URL</strong>（任意）：プロジェクトの代表画像のURL（Imgur・Cloudinary等のURLを貼り付け）。</li>
                          <li><strong>終了日</strong>（必須）：募集を締め切る日付を選択します。</li>
                        </ul>
                      </li>
                      <li>入力内容を確認し、「プロジェクトを作成」ボタンをクリックします。</li>
                      <li>作成に成功すると、そのプロジェクトの詳細ページへ自動で遷移し、内容を確認できます。</li>
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
                      <li>支援したいプロジェクトの詳細ページを開きます（プロジェクト一覧からカードをクリック）。</li>
                      <li>ページ内の「このプロジェクトを支援する」ボタン（または支援用の入力エリア）をクリックします。</li>
                      <li>支援金額を入力します。最低金額の制限がある場合はその以上で、任意の金額を指定できます。</li>
                      <li>金額を確認し、「支援する」ボタンをクリックして支援を確定します。</li>
                      <li>支援が記録されると、そのプロジェクトの支援額・達成率が更新され、「マイ支援」からも確認できるようになります。デモ環境では実際の決済は行われません。</li>
                    </ol>
                    <p className="note">※ 支援にはログインが必須です。未ログインの場合は「ログイン」から先にログインしてください。</p>
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
                      <li>コメントを書きたいプロジェクトの詳細ページを開きます。</li>
                      <li>ページを下にスクロールし、「コメント」または「コメント一覧」のセクションまで移動します。</li>
                      <li>コメント入力欄（テキストボックス）に、質問・応援メッセージ・感想などを入力します。</li>
                      <li>「コメント投稿」ボタンをクリックすると、コメントが一覧に追加され、他のユーザーにも表示されます。</li>
                      <li>自分が投稿したコメントは、編集ボタン・削除ボタンから編集または削除できます。他人のコメントは編集・削除できません。</li>
                    </ol>
                    <p className="note">※ コメントの投稿にはログインが必須です。</p>
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
                      <li>ログインした状態で、ヘッダーの「マイプロジェクト」をクリックします。</li>
                      <li>自分が作成したプロジェクトの一覧が表示されます。各カードから達成率・支援数などを確認でき、クリックすると詳細ページへ移動します。</li>
                      <li>ヘッダーの「マイ支援」をクリックすると、自分が支援したプロジェクトの一覧が表示されます。支援金額やプロジェクトの現在の状況を確認できます。</li>
                      <li>一覧の各プロジェクト（カードまたはリンク）をクリックすると、そのプロジェクトの詳細ページを開き、進捗やコメントを確認できます。</li>
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
                      <li>ヘッダーの「マイプロジェクト」を開き、編集・削除したいプロジェクトのカードをクリックして詳細ページを開きます。</li>
                      <li>プロジェクト詳細ページで、タイトル・説明・目標金額・終了日などの内容を確認します。</li>
                      <li>編集・削除の操作は、詳細ページ内の「編集」ボタンや「削除」ボタンから行います（※ 編集・削除機能は今後実装予定です）。</li>
                    </ol>
                    <p className="note">※ プロジェクトの編集・削除は、そのプロジェクトの作成者のみが行えます。他人が作成したプロジェクトは編集・削除できません。</p>
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
                      <dd>A: 現在はデモ環境のため、実際の決済・引き落とし処理は行われません。本番運用時には、プロジェクト成立後の決済フローが実装される予定です。</dd>
                      <dt>Q: プロジェクトの目標金額に達しなかった場合はどうなりますか？</dt>
                      <dd>A: 終了日までに目標金額に達しなかった場合、プロジェクトのステータスは「未達成」となり、支援金は支援者に返金される想定です（返金機能は実装予定）。</dd>
                      <dt>Q: 複数のプロジェクトに支援できますか？</dt>
                      <dd>A: はい、同じアカウントから複数のプロジェクトに支援することができます。「マイ支援」で支援したプロジェクト一覧を確認できます。</dd>
                      <dt>Q: プロジェクトの画像はどこで取得できますか？</dt>
                      <dd>A: 画像はURLで指定します。Imgur・Cloudinary・GitHub など、画像をホスティングできるサービスに画像をアップロードし、その画像のURLをプロジェクト作成フォームの「画像URL」欄に貼り付けてください。</dd>
                      <dt>Q: 操作手順のウィンドウは動かせますか？</dt>
                      <dd>A: はい。画面上の「❓ 操作手順」は左端の☰をドラッグで移動できます。モーダルを開いた状態では、緑のヘッダー部分をドラッグするとモーダル全体を移動できます。</dd>
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
