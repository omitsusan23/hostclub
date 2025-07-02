# 🏨 Hostclub MCP Server

このプロジェクトは、Hostclub管理システムを**Model Context Protocol (MCP)**サーバーとして提供し、Cursor、Claude、その他のAIアプリケーションから直接アクセスできるようにします。

## 🚀 クイックスタート

### 1. ローカルでMCPサーバーを起動

```bash
# パッケージをインストール
npm install

# MCPサーバーを起動
node test-mcp-server.mjs
```

または、Windows環境では：
```cmd
start-mcp.bat
```

### 2. ブラウザでテスト

1. `mcp-test.html` をブラウザで開く
2. 各ツールのボタンをクリックしてテスト

### 3. CursorでMCP接続

1. Cursorのメニューで **Cursor Settings** → **Features** → **Model Context Protocol**
2. `cursor-mcp-config.json` の内容をコピーペースト
3. CursorのAIチャットでHostclubの情報を取得可能！

## 🛠️ 利用可能なツール

### 基本ツール（テスト用）
- `ping` - 接続テスト
- `test_database` - データベース接続確認
- `list_stores` - 店舗一覧

### 本格ツール（api/mcp.ts）
- `get_stores` - 詳細な店舗情報取得
- `get_casts` - キャスト一覧取得
- `check_store_registration` - 店舗登録状況確認
- `get_database_stats` - データベース統計
- `get_store_details` - 店舗詳細情報

## 🌐 本番環境デプロイ

### Vercelにデプロイ

```bash
# Vercelにデプロイ
vercel --prod

# 環境変数を設定
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY  # オプション：管理者権限用
```

### 本番環境でのCursor設定

```json
{
  "mcpServers": {
    "hostclub": {
      "url": "https://your-project.vercel.app/api/mcp"
    }
  }
}
```

## 📋 使用例

### CursorでHostclubデータを取得

```
HostclubのMCPサーバーから店舗一覧を取得してください
```

```
キャスト数が最も多い店舗を教えてください
```

```
データベースの統計情報を表示してください
```

## 🔧 カスタマイズ

### 新しいツールの追加

1. `api/mcp.ts` にツールを追加
2. Supabaseデータベースとの連携を実装
3. 適切なエラーハンドリングを追加

### セキュリティ設定

- 本番環境では `SUPABASE_SERVICE_ROLE_KEY` を使用
- Row Level Security (RLS) ポリシーを適切に設定
- API制限やレート制限を検討

## 🤝 他のMCPクライアントとの連携

### Claude Desktop
```json
{
  "mcpServers": {
    "hostclub": {
      "command": "node",
      "args": ["path/to/test-mcp-server.mjs"],
      "env": {
        "VITE_SUPABASE_URL": "your-url",
        "VITE_SUPABASE_ANON_KEY": "your-key"
      }
    }
  }
}
```

### 他のAIアプリケーション
- MCP対応のアプリケーションであれば、URLエンドポイントで接続可能
- Streamable HTTP transport を使用

## 📚 参考リンク

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Vercel MCP Adapter](https://vercel.com/docs/mcp)
- [Supabase Documentation](https://supabase.com/docs)

## 🆘 トラブルシューティング

### よくある問題

1. **接続エラー**
   - 環境変数が正しく設定されているか確認
   - Supabaseプロジェクトが稼働中か確認

2. **権限エラー**
   - RLSポリシーを確認
   - APIキーの権限を確認

3. **CORS エラー**
   - ローカル開発時は `http://localhost:3001` を使用
   - 本番環境では適切なドメインを設定 