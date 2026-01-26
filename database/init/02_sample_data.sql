-- Crowdfunding Sample Data for Customer Presentation

-- 既存のサンプルデータを削除（重複を防ぐため）
DELETE FROM comments;
DELETE FROM pledges;
DELETE FROM projects;
DELETE FROM users;

-- サンプルユーザーの作成
INSERT INTO users (username, email, password_hash, first_name, last_name, bio, avatar_url) VALUES
('田中太郎', 'tanaka@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '太郎', '田中', 'テクノロジーとイノベーションに情熱を注ぐ起業家です。', 'https://i.pravatar.cc/150?img=1'),
('佐藤花子', 'sato@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '花子', '佐藤', 'アートとデザインが大好きなクリエイターです。', 'https://i.pravatar.cc/150?img=5'),
('鈴木一郎', 'suzuki@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '一郎', '鈴木', '音楽プロデューサーとして活動しています。', 'https://i.pravatar.cc/150?img=12'),
('山田次郎', 'yamada@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '次郎', '山田', 'ゲーム開発者です。面白いゲームを作りたい！', 'https://i.pravatar.cc/150?img=15'),
('高橋三郎', 'takahashi@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '三郎', '高橋', '料理とグルメが趣味のフードクリエイターです。', 'https://i.pravatar.cc/150?img=20'),
('伊藤四郎', 'ito@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '四郎', '伊藤', '本と読書が大好きな作家志望です。', 'https://i.pravatar.cc/150?img=25'),
('渡辺五郎', 'watanabe@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '五郎', '渡辺', '映画制作に携わる映像クリエイターです。', 'https://i.pravatar.cc/150?img=30'),
('中村六郎', 'nakamura@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', '六郎', '中村', '支援者として様々なプロジェクトを応援しています。', 'https://i.pravatar.cc/150?img=35');

-- サンプルプロジェクトの作成
INSERT INTO projects (creator_id, title, description, goal_amount, current_amount, image_url, category, status, start_date, end_date) VALUES
(1, 'AI搭載スマートホームシステム', 
 '最新のAI技術を活用した次世代スマートホームシステムを開発します。音声認識、顔認証、自動調節機能など、未来の住まいを実現します。',
 5000000, 3200000,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
 'テクノロジー', 'active',
 CURRENT_TIMESTAMP - INTERVAL '15 days',
 CURRENT_TIMESTAMP + INTERVAL '45 days'),

(2, 'デジタルアートコレクション展', 
 '若手アーティストによるデジタルアートのオンライン展示会を開催します。VR技術を活用した没入型体験も提供します。',
 2000000, 1850000,
 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
 'アート', 'active',
 CURRENT_TIMESTAMP - INTERVAL '10 days',
 CURRENT_TIMESTAMP + INTERVAL '50 days'),

(3, 'インディーズ音楽アルバム制作', 
 '5人のアーティストによるコラボレーションアルバムを制作します。ジャンルを超えた新しい音楽の可能性を追求します。',
 1500000, 1200000,
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
 '音楽', 'active',
 CURRENT_TIMESTAMP - INTERVAL '20 days',
 CURRENT_TIMESTAMP + INTERVAL '40 days'),

(4, 'ローグライクRPGゲーム開発', 
 'プレイするたびに世界が変わるローグライクRPGを開発します。美しいピクセルアートと戦略的なゲームプレイが特徴です。',
 3000000, 4500000,
 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
 'ゲーム', 'active',
 CURRENT_TIMESTAMP - INTERVAL '5 days',
 CURRENT_TIMESTAMP + INTERVAL '55 days'),

(5, 'オーガニックレストラン開店', 
 '地元の有機野菜を使用したオーガニックレストランを開店します。健康的で美味しい食事を提供します。',
 4000000, 2800000,
 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
 '食品', 'active',
 CURRENT_TIMESTAMP - INTERVAL '8 days',
 CURRENT_TIMESTAMP + INTERVAL '52 days'),

(6, 'SF小説シリーズ出版', 
 '3部作のSF小説シリーズを出版します。壮大な世界観と深いストーリーが魅力です。',
 800000, 950000,
 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
 '本', 'active',
 CURRENT_TIMESTAMP - INTERVAL '12 days',
 CURRENT_TIMESTAMP + INTERVAL '48 days'),

(7, '短編映画制作プロジェクト', 
 '社会問題をテーマにした短編映画を制作します。国際映画祭への出品も予定しています。',
 2500000, 1800000,
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
 '映画', 'active',
 CURRENT_TIMESTAMP - INTERVAL '18 days',
 CURRENT_TIMESTAMP + INTERVAL '42 days'),

(1, 'IoT農業ソリューション', 
 'IoTセンサーを活用したスマート農業システムを開発します。効率的な農業経営をサポートします。',
 6000000, 2100000,
 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
 'テクノロジー', 'active',
 CURRENT_TIMESTAMP - INTERVAL '3 days',
 CURRENT_TIMESTAMP + INTERVAL '57 days'),

(2, 'アートブック出版', 
 '現代アーティストの作品集を出版します。高品質な印刷とデザインにこだわります。',
 1200000, 850000,
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
 'アート', 'active',
 CURRENT_TIMESTAMP - INTERVAL '25 days',
 CURRENT_TIMESTAMP + INTERVAL '35 days'),

(3, 'ライブ配信コンサート', 
 'オンラインライブ配信コンサートを開催します。世界中のファンとつながります。',
 1000000, 750000,
 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
 '音楽', 'active',
 CURRENT_TIMESTAMP - INTERVAL '7 days',
 CURRENT_TIMESTAMP + INTERVAL '53 days');

-- サンプル支援データの作成
INSERT INTO pledges (project_id, user_id, amount, reward_tier, created_at) VALUES
-- プロジェクト1への支援
(1, 2, 50000, '早期支援者特典', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(1, 3, 100000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '13 days'),
(1, 4, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '12 days'),
(1, 5, 150000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '11 days'),
(1, 6, 300000, 'プラチナサポーター', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(1, 7, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(1, 8, 1000000, 'エグゼクティブサポーター', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(1, 2, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(1, 3, 150000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(1, 4, 100000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(1, 5, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '4 days'),

-- プロジェクト2への支援
(2, 1, 100000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(2, 3, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(2, 4, 150000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(2, 5, 300000, 'プラチナサポーター', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(2, 6, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 7, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(2, 8, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '3 days'),

-- プロジェクト3への支援
(3, 1, 50000, '早期支援者特典', CURRENT_TIMESTAMP - INTERVAL '19 days'),
(3, 2, 100000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '18 days'),
(3, 4, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '17 days'),
(3, 5, 150000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '16 days'),
(3, 6, 300000, 'プラチナサポーター', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(3, 7, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(3, 8, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '13 days'),

-- プロジェクト4への支援
(4, 1, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(4, 2, 1000000, 'エグゼクティブサポーター', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(4, 3, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(4, 5, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '1 days'),
(4, 6, 1000000, 'エグゼクティブサポーター', CURRENT_TIMESTAMP),
(4, 7, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP),
(4, 8, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP),

-- プロジェクト5への支援
(5, 1, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(5, 2, 300000, 'プラチナサポーター', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(5, 3, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(5, 4, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(5, 6, 1000000, 'エグゼクティブサポーター', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(5, 7, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(5, 8, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '1 days'),

-- プロジェクト6への支援
(6, 1, 50000, '早期支援者特典', CURRENT_TIMESTAMP - INTERVAL '11 days'),
(6, 2, 100000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(6, 3, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(6, 4, 150000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(6, 5, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(6, 7, 150000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '6 days'),

-- プロジェクト7への支援
(7, 1, 300000, 'プラチナサポーター', CURRENT_TIMESTAMP - INTERVAL '17 days'),
(7, 2, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '16 days'),
(7, 3, 500000, 'ダイヤモンドサポーター', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(7, 4, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(7, 5, 300000, 'プラチナサポーター', CURRENT_TIMESTAMP - INTERVAL '13 days'),
(7, 6, 200000, 'ゴールドサポーター', CURRENT_TIMESTAMP - INTERVAL '12 days'),
(7, 8, 100000, 'シルバーサポーター', CURRENT_TIMESTAMP - INTERVAL '11 days');

-- プロジェクトの現在金額を更新（支援総額に合わせる）
UPDATE projects SET current_amount = (
  SELECT COALESCE(SUM(amount), 0) FROM pledges WHERE pledges.project_id = projects.id
) WHERE id IN (1, 2, 3, 4, 5, 6, 7);

-- サンプルコメントデータの作成
INSERT INTO comments (project_id, user_id, content, created_at) VALUES
(1, 2, '素晴らしいプロジェクトですね！応援しています。', CURRENT_TIMESTAMP - INTERVAL '13 days'),
(1, 3, 'AI技術の活用が楽しみです。成功を祈っています！', CURRENT_TIMESTAMP - INTERVAL '12 days'),
(1, 4, 'スマートホームは未来の生活を変えますね。', CURRENT_TIMESTAMP - INTERVAL '11 days'),
(1, 5, '早く製品化されることを期待しています！', CURRENT_TIMESTAMP - INTERVAL '10 days'),

(2, 1, 'デジタルアートの世界が広がりますね。', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(2, 3, 'VR体験が楽しみです！', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(2, 4, '若手アーティストの作品を見られるのが嬉しいです。', CURRENT_TIMESTAMP - INTERVAL '6 days'),

(3, 1, '音楽のコラボレーションが楽しみです！', CURRENT_TIMESTAMP - INTERVAL '18 days'),
(3, 2, '新しい音楽の可能性を感じます。', CURRENT_TIMESTAMP - INTERVAL '17 days'),
(3, 4, 'アルバムの発売を心待ちにしています。', CURRENT_TIMESTAMP - INTERVAL '16 days'),

(4, 1, 'ローグライクRPG大好きです！', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(4, 2, 'ピクセルアートが美しいですね。', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(4, 3, 'ゲームプレイが楽しみです！', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(4, 5, '早くプレイしたいです！', CURRENT_TIMESTAMP - INTERVAL '1 days'),

(5, 1, 'オーガニックレストラン、楽しみです！', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(5, 2, '健康的な食事が食べられるのが嬉しいです。', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(5, 3, '開店を心待ちにしています。', CURRENT_TIMESTAMP - INTERVAL '4 days'),

(6, 1, 'SF小説シリーズ、読むのが楽しみです！', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(6, 2, '壮大な世界観が楽しみです。', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(6, 3, '3部作すべて読みたいです！', CURRENT_TIMESTAMP - INTERVAL '8 days'),

(7, 1, '社会問題をテーマにした映画、素晴らしいです。', CURRENT_TIMESTAMP - INTERVAL '16 days'),
(7, 2, '国際映画祭での受賞を期待しています！', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(7, 3, '映画制作の成功を祈っています。', CURRENT_TIMESTAMP - INTERVAL '14 days');
