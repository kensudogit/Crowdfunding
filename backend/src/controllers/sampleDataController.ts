import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcryptjs';

export const generateSampleData = async (req: Request, res: Response): Promise<void> => {
  try {
    // 既存のサンプルデータを削除（オプション）
    await pool.query('DELETE FROM comments');
    await pool.query('DELETE FROM pledges');
    await pool.query('DELETE FROM projects');
    await pool.query('DELETE FROM users');

    // パスワードハッシュを生成
    const passwordHash = await bcrypt.hash('password123', 10);

    // サンプルユーザーの作成
    const usersResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, bio, avatar_url) VALUES
      ('田中太郎', 'tanaka@example.com', $1, '太郎', '田中', 'テクノロジーとイノベーションに情熱を注ぐ起業家です。', 'https://i.pravatar.cc/150?img=1'),
      ('佐藤花子', 'sato@example.com', $1, '花子', '佐藤', 'アートとデザインが大好きなクリエイターです。', 'https://i.pravatar.cc/150?img=5'),
      ('鈴木一郎', 'suzuki@example.com', $1, '一郎', '鈴木', '音楽プロデューサーとして活動しています。', 'https://i.pravatar.cc/150?img=12'),
      ('山田次郎', 'yamada@example.com', $1, '次郎', '山田', 'ゲーム開発者です。面白いゲームを作りたい！', 'https://i.pravatar.cc/150?img=15'),
      ('高橋三郎', 'takahashi@example.com', $1, '三郎', '高橋', '料理とグルメが趣味のフードクリエイターです。', 'https://i.pravatar.cc/150?img=20'),
      ('伊藤四郎', 'ito@example.com', $1, '四郎', '伊藤', '本と読書が大好きな作家志望です。', 'https://i.pravatar.cc/150?img=25'),
      ('渡辺五郎', 'watanabe@example.com', $1, '五郎', '渡辺', '映画制作に携わる映像クリエイターです。', 'https://i.pravatar.cc/150?img=30'),
      ('中村六郎', 'nakamura@example.com', $1, '六郎', '中村', '支援者として様々なプロジェクトを応援しています。', 'https://i.pravatar.cc/150?img=35')
      RETURNING id, username`,
      [passwordHash]
    );

    const users = usersResult.rows;

    // サンプルプロジェクトの作成
    const projectsResult = await pool.query(
      `INSERT INTO projects (creator_id, title, description, goal_amount, current_amount, image_url, category, status, start_date, end_date) VALUES
      ($1, 'AI搭載スマートホームシステム', '最新のAI技術を活用した次世代スマートホームシステムを開発します。音声認識、顔認証、自動調節機能など、未来の住まいを実現します。', 5000000, 0, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'テクノロジー', 'active', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '45 days'),
      ($2, 'デジタルアートコレクション展', '若手アーティストによるデジタルアートのオンライン展示会を開催します。VR技術を活用した没入型体験も提供します。', 2000000, 0, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', 'アート', 'active', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '50 days'),
      ($3, 'インディーズ音楽アルバム制作', '5人のアーティストによるコラボレーションアルバムを制作します。ジャンルを超えた新しい音楽の可能性を追求します。', 1500000, 0, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '音楽', 'active', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP + INTERVAL '40 days'),
      ($4, 'ローグライクRPGゲーム開発', 'プレイするたびに世界が変わるローグライクRPGを開発します。美しいピクセルアートと戦略的なゲームプレイが特徴です。', 3000000, 0, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 'ゲーム', 'active', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '55 days'),
      ($5, 'オーガニックレストラン開店', '地元の有機野菜を使用したオーガニックレストランを開店します。健康的で美味しい食事を提供します。', 4000000, 0, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', '食品', 'active', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP + INTERVAL '52 days'),
      ($6, 'SF小説シリーズ出版', '3部作のSF小説シリーズを出版します。壮大な世界観と深いストーリーが魅力です。', 800000, 0, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', '本', 'active', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP + INTERVAL '48 days'),
      ($7, '短編映画制作プロジェクト', '社会問題をテーマにした短編映画を制作します。国際映画祭への出品も予定しています。', 2500000, 0, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', '映画', 'active', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP + INTERVAL '42 days'),
      ($1, 'IoT農業ソリューション', 'IoTセンサーを活用したスマート農業システムを開発します。効率的な農業経営をサポートします。', 6000000, 0, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', 'テクノロジー', 'active', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '57 days'),
      ($2, 'アートブック出版', '現代アーティストの作品集を出版します。高品質な印刷とデザインにこだわります。', 1200000, 0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'アート', 'active', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP + INTERVAL '35 days'),
      ($3, 'ライブ配信コンサート', 'オンラインライブ配信コンサートを開催します。世界中のファンとつながります。', 1000000, 0, 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', '音楽', 'active', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '53 days')
      RETURNING id`,
      [users[0].id, users[1].id, users[2].id, users[3].id, users[4].id, users[5].id, users[6].id]
    );

    const projects = projectsResult.rows;

    // サンプル支援データの作成
    const pledgeAmounts = [
      [projects[0].id, [50000, 100000, 200000, 150000, 300000, 500000, 1000000, 200000, 150000, 100000, 500000]],
      [projects[1].id, [100000, 200000, 150000, 300000, 500000, 200000, 200000]],
      [projects[2].id, [50000, 100000, 200000, 150000, 300000, 200000, 200000]],
      [projects[3].id, [500000, 1000000, 500000, 500000, 1000000, 500000, 500000]],
      [projects[4].id, [200000, 300000, 500000, 200000, 1000000, 200000, 200000]],
      [projects[5].id, [50000, 100000, 200000, 150000, 200000, 150000]],
      [projects[6].id, [300000, 200000, 500000, 200000, 300000, 200000, 100000]],
    ];

    for (const [projectId, amounts] of pledgeAmounts) {
      let userIndex = 0;
      for (const amount of amounts) {
        const userId = users[userIndex % users.length].id;
        await pool.query(
          'INSERT INTO pledges (project_id, user_id, amount, reward_tier) VALUES ($1, $2, $3, $4)',
          [projectId, userId, amount, amount >= 1000000 ? 'エグゼクティブサポーター' : amount >= 500000 ? 'ダイヤモンドサポーター' : amount >= 300000 ? 'プラチナサポーター' : amount >= 200000 ? 'ゴールドサポーター' : amount >= 100000 ? 'シルバーサポーター' : '早期支援者特典']
        );
        userIndex++;
      }
    }

    // プロジェクトの現在金額を更新
    for (const project of projects) {
      const totalResult = await pool.query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM pledges WHERE project_id = $1',
        [project.id]
      );
      await pool.query(
        'UPDATE projects SET current_amount = $1 WHERE id = $2',
        [parseFloat(totalResult.rows[0].total), project.id]
      );
    }

    // サンプルコメントデータの作成
    const comments = [
      [projects[0].id, users[1].id, '素晴らしいプロジェクトですね！応援しています。'],
      [projects[0].id, users[2].id, 'AI技術の活用が楽しみです。成功を祈っています！'],
      [projects[0].id, users[3].id, 'スマートホームは未来の生活を変えますね。'],
      [projects[1].id, users[0].id, 'デジタルアートの世界が広がりますね。'],
      [projects[1].id, users[2].id, 'VR体験が楽しみです！'],
      [projects[2].id, users[0].id, '音楽のコラボレーションが楽しみです！'],
      [projects[3].id, users[0].id, 'ローグライクRPG大好きです！'],
      [projects[4].id, users[0].id, 'オーガニックレストラン、楽しみです！'],
      [projects[5].id, users[0].id, 'SF小説シリーズ、読むのが楽しみです！'],
      [projects[6].id, users[0].id, '社会問題をテーマにした映画、素晴らしいです。'],
    ];

    for (const [projectId, userId, content] of comments) {
      await pool.query(
        'INSERT INTO comments (project_id, user_id, content) VALUES ($1, $2, $3)',
        [projectId, userId, content]
      );
    }

    res.json({
      message: 'Sample data generated successfully',
      users: users.length,
      projects: projects.length,
    });
  } catch (error) {
    console.error('Generate sample data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
