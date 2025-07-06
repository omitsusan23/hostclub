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

## 🎨 Figma MCP Server 統合

### Figmaセットアップ手順

1. **Figmaデスクトップアプリで有効化**
   - Figmaメニュー → 基本設定
   - 「Dev Mode MCPサーバーを有効にする」を選択
   - 確認メッセージが表示されることを確認

2. **Figmaテスト**
   - `figma-mcp-test.html` をブラウザで開く
   - 接続テストを実行

3. **Cursor設定** (自動で含まれています)
   ```json
   {
     "mcpServers": {
       "figma": {
         "url": "http://127.0.0.1:3845/sse"
       }
     }
   }
   ```

### 🎯 Figmaでできること

- **デザインからコード生成**: 選択したフレームをReactコンポーネントに変換
- **デザイン情報抽出**: 変数、コンポーネント、レイアウトデータを取得
- **Code Connect連携**: 実際のコンポーネントとの整合性を保持

### 📋 Figma使用例

```
「選択中のFigmaフレームをReactコンポーネントとして実装してください」
「このデザインのCSSスタイルを生成してください」
「Figmaのデザインシステムから変数を抽出してください」
```

## 🛠️ 利用可能なツール

### Hostclub ツール（api/mcp.ts）
- `get_stores` - 詳細な店舗情報取得
- `get_casts` - キャスト一覧取得
- `check_store_registration` - 店舗登録状況確認
- `get_database_stats` - データベース統計
- `get_store_details` - 店舗詳細情報

### Figma ツール（外部サーバー）
- フレームからコード生成
- デザイン情報抽出
- Code Connect連携

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
    },
    "figma": {
      "url": "http://127.0.0.1:3845/sse"
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

### CursorでFigmaデザインを活用

```
選択中のFigmaフレームをHostclub用のReactコンポーネントとして実装してください
```

```
FigmaのデザインシステムをHostclubのTailwind CSSテーマに変換してください
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

### Windsurf
- Figmaプラグインをプラグインストアからインストール
- Cascade設定でFigma MCPサーバーが自動表示

### VS Code
- MCP拡張機能をインストール
- 設定ファイルにサーバー情報を追加

## 📚 参考リンク

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Vercel MCP Adapter](https://vercel.com/docs/mcp)
- [Figma Dev Mode MCP Server Guide](https://help.figma.com/hc/ja/articles/32132100833559-Dev-Mode-MCP%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E5%88%A9%E7%94%A8%E3%82%AC%E3%82%A4%E3%83%89)
- [Supabase Documentation](https://supabase.com/docs)

## 🆘 トラブルシューティング

### よくある問題

1. **Hostclub接続エラー**
   - 環境変数が正しく設定されているか確認
   - Supabaseプロジェクトが稼働中か確認

2. **権限エラー**
   - RLSポリシーを確認
   - APIキーの権限を確認

3. **Figma接続エラー**
   - Figmaデスクトップアプリが起動中か確認
   - Dev Mode MCPサーバーが有効か確認
   - ポート3845がブロックされていないか確認

4. **CORS エラー**
   - ローカル開発時は適切なポートを使用
   - 本番環境では適切なドメインを設定

## 📊 プロジェクト構成

```
├── api/
│   └── mcp.ts                 # Hostclub MCPサーバー
├── mcp-test.html             # Hostclub MCPテスト
├── figma-mcp-test.html       # Figma MCPテスト
├── cursor-mcp-config.json    # Cursor設定ファイル
├── hostclub_schema.sql       # データベーススキーマ
├── start-mcp.bat             # 起動スクリプト
└── README-MCP.md            # このファイル
``` 