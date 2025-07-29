# MCP設定手順

## 1. トークンを置き換える

`~/.cursor/mcp.json`ファイルの以下の箇所を実際の値に置き換えてください：

- `YOUR_PROJECT_REF` → SupabaseのプロジェクトID
- `YOUR_ACCESS_TOKEN` → Supabaseのアクセストークン  
- `YOUR_VERCEL_TOKEN` → Vercelのアクセストークン

## 2. Cursorを再起動

1. Cursorを完全に終了（File → Exit）
2. Cursorを再起動
3. Settings → MCP を開く
4. 両方のサーバーが緑色（Active）になっていることを確認

## 3. 使用例

### Supabase
- テーブル一覧: "Show me all tables in Supabase"
- データ取得: "Get all data from users table"
- スキーマ確認: "Show the schema for the products table"

### Vercel
- プロジェクト一覧: "List all my Vercel projects"
- デプロイ状況: "Show recent deployments"
- 環境変数: "Show environment variables for my project"

## トラブルシューティング

エラーが出る場合：
1. トークンが正しくコピーされているか確認
2. Cursorを再起動
3. `~/.cursor/mcp.json`のJSONフォーマットが正しいか確認