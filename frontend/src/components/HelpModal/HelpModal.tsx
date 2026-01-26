import { useState } from 'react';
import './HelpModal.css';

export const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <>
      <button onClick={openModal} className="help-btn">
        ❓ 操作手順
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>操作手順</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section1')}>
                  <h3>1. アカウント登録・ログイン</h3>
                  <button className="toggle-btn">
                    {expandedSections.section1 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section1 && (
                  <div className="section-content">
                    <ol>
                      <li>右上の「登録」ボタンをクリック</li>
                      <li>ユーザー名、メールアドレス、パスワードを入力</li>
                      <li>「登録」ボタンをクリックしてアカウントを作成</li>
                      <li>既にアカウントをお持ちの場合は「ログイン」からログイン</li>
                    </ol>
                  </div>
                )}
              </section>

              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section2')}>
                  <h3>2. プロジェクトの閲覧</h3>
                  <button className="toggle-btn">
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

              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section3')}>
                  <h3>3. プロジェクトの作成</h3>
                  <button className="toggle-btn">
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

              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section4')}>
                  <h3>4. プロジェクトへの支援</h3>
                  <button className="toggle-btn">
                    {expandedSections.section4 ? '▽ 閉じる' : '△ 開く'}
                  </button>
                </div>
                {expandedSections.section4 && (
                  <div className="section-content">
                    <ol>
                      <li>プロジェクト詳細ページを開く</li>
                      <li>右側のサイドバーで「このプロジェクトを支援する」ボタンをクリック</li>
                      <li>支援金額を入力</li>
                      <li>「支援する」ボタンをクリック</li>
                      <li>支援が完了すると、プロジェクトの進捗が更新されます</li>
                    </ol>
                    <p className="note">※ ログインが必要です</p>
                  </div>
                )}
              </section>

              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section5')}>
                  <h3>5. コメントの投稿</h3>
                  <button className="toggle-btn">
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

              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section6')}>
                  <h3>6. マイプロジェクト・マイ支援の確認</h3>
                  <button className="toggle-btn">
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

              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section7')}>
                  <h3>7. プロジェクトの編集・削除</h3>
                  <button className="toggle-btn">
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

              <section className="help-section">
                <div className="section-header" onClick={() => toggleSection('section8')}>
                  <h3>よくある質問</h3>
                  <button className="toggle-btn">
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
            <div className="modal-footer">
              <button onClick={closeModal} className="close-modal-btn">
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
