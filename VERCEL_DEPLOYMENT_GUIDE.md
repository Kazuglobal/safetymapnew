# Vercelデプロイメントガイド

## 1. 依存関係の修正 ✅ 完了

### ✅ 実行済み
- `date-fns`を`v4.1.0`から`v3.6.0`にダウングレード済み
- `pnpm install`で依存関係をインストール済み
- TypeScriptエラーなし
- Next.jsビルドも正常完了

## 2. Vercelデプロイ設定

### Install Command
```bash
npm install --legacy-peer-deps
```

### Build Command
```bash
npm run build
```

### Output Directory
```
.next
```

## 3. 環境変数設定

### 必須の環境変数（Vercelで設定）
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 自動設定済み（next.config.mjsにハードコード）
以下の環境変数は`next.config.mjs`にハードコードされているため、Vercelで別途設定する必要はありません：

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

## 4. デプロイ手順

1. **Vercelプロジェクトの作成**
   - GitHubリポジトリを接続
   - プロジェクト名を設定

2. **ビルド設定**
   - Install Command: `npm install --legacy-peer-deps`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **環境変数の設定**
   - Settings → Environment Variables
   - `SUPABASE_SERVICE_ROLE_KEY`を追加

4. **デプロイ実行**
   - Deploy ボタンをクリック

## 5. トラブルシューティング

### ピア依存関係エラーが発生した場合
- `--legacy-peer-deps`フラグを使用することで解決
- React 19使用による警告は無害

### ビルドエラーが発生した場合
- ローカルで`pnpm run build`が成功していることを確認
- 環境変数が正しく設定されていることを確認

## 6. 現在の状態 ✅

- ✅ 依存関係修正完了
- ✅ TypeScriptエラーなし
- ✅ Next.jsビルド成功
- ✅ package.json修正保持
- ✅ 環境変数設定確認済み

コード自体に問題はなく、すべての準備が完了しています。 