# SafetySchoolMap - 学校安全マップ

学校周辺の安全性を視覚化し、危険箇所の報告・管理を行うWebアプリケーションです。

## 主な機能

- **インタラクティブマップ**: Mapboxを使用した学校周辺の地図表示
- **危険箇所報告**: ユーザーからの危険箇所の報告と画像アップロード
- **安全スコア**: AI による安全性の評価とスコア表示
- **リーダーボード**: 安全活動の貢献度ランキング
- **管理ダッシュボード**: 管理者向けの報告管理機能
- **ミッション機能**: ゲーミフィケーションによる参加促進

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: Radix UI, Tailwind CSS
- **Backend**: Supabase (データベース、認証、ストレージ)
- **Map**: Mapbox GL JS, React Map GL
- **AI**: OpenAI API (画像解析、安全性評価)
- **API連携**: xROAD API (道路・交通データ)

## セットアップ

1. リポジトリをクローン:
   ```bash
   git clone <repository-url>
   cd safetyschoolmap
   ```

2. 依存関係をインストール:
   ```bash
   npm install
   ```

3. 環境変数を設定:
   `.env.local`ファイルを作成し、以下の環境変数を設定してください：
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Mapbox
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # xROAD API
   NEXT_PUBLIC_XROAD_API_KEY=your_xroad_api_key
   ```

4. 開発サーバーを起動:
   ```bash
   npm run dev
   ```

## プロジェクト構造

```
/app              # Next.js App Router
/components       # 再利用可能なReactコンポーネント
/hooks           # カスタムReactフック
/lib             # ユーティリティ関数とAPI
/public          # 静的ファイル
/supabase        # Supabaseマイグレーション
/types           # TypeScript型定義
```

## API連携

### xROAD API
道路データプラットフォームとの連携により、道路情報や交通量データを取得できます。

### Supabase
ユーザー認証、データベース、ファイルストレージを提供します。

### OpenAI API
アップロードされた画像の解析と安全性評価に使用されます。

## 開発

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLintチェック
```

## デプロイ

プロジェクトはVercelでのデプロイに最適化されています。

## ライセンス

MIT License