# 🌐 Vercel 環境変数設定ガイド

## 🎯 **必要な環境変数**

Hostclub MCPサーバーが動作するために、以下の環境変数を設定する必要があります：

```
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📋 **設定手順**

### 1️⃣ **Vercel Dashboard にアクセス**
```
🌐 https://vercel.com/dashboard
```

### 2️⃣ **プロジェクトを選択**
- `hostclub` プロジェクトをクリック

### 3️⃣ **Settings タブを開く**
- プロジェクト画面の上部にある **Settings** タブをクリック

### 4️⃣ **Environment Variables を選択**
- 左側のサイドバーから **Environment Variables** を選択

### 5️⃣ **環境変数を追加**

#### **環境変数 1: VITE_SUPABASE_URL**
```
Name: VITE_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environment: Production, Preview, Development (全て選択)
```

#### **環境変数 2: SUPABASE_SERVICE_ROLE_KEY**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (長いキー)
Environment: Production, Preview, Development (全て選択)
```

#### **環境変数 3: VITE_SUPABASE_ANON_KEY**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (長いキー)
Environment: Production, Preview, Development (全て選択)
```

### 6️⃣ **保存**
- 各環境変数を追加後、**Save** をクリック

## 🔍 **環境変数の値の確認方法**

### 📊 **Supabase Dashboard で確認**

1. **Supabase Dashboard にアクセス**
   ```
   🌐 https://supabase.com/dashboard
   ```

2. **プロジェクトを選択**
   - Hostclub プロジェクトをクリック

3. **Settings > API を開く**
   - 左側のサイドバーから **Settings** → **API** を選択

4. **必要な値をコピー**
   ```
   Project URL: https://your-project-id.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role secret key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🚀 **再デプロイ**

### 環境変数設定後の再デプロイ方法

#### **方法 1: 自動デプロイ**
```bash
# GitHubにコミット・プッシュで自動デプロイ
git add .
git commit -m "Trigger redeploy after env vars setup"
git push origin main
```

#### **方法 2: Vercel CLI**
```bash
# Vercel CLIを使用
npx vercel --prod
```

#### **方法 3: Dashboard から**
```
1. Vercel Dashboard > Deployments タブ
2. 最新のデプロイメントの「...」メニューをクリック
3. "Redeploy" を選択
```

## 📊 **設定確認**

### 環境変数設定後のテスト

```bash
# 環境変数設定後にテスト実行
node check-vercel-mcp-fixed.mjs
```

**期待される結果**:
```
🌐 Vercel サイト: ✅ 200
🔧 Vercel MCP: ✅ 200  ← これが成功すればOK！
```

## ⚠️ **注意点**

### 🔒 **セキュリティ**
- **service_role key** は非常に強力な権限を持つため、取り扱いに注意
- **anon key** は公開されても問題ないが、**service_role key** は秘密に保つ

### 🔄 **環境の種類**
- **Production**: 本番環境（main ブランチ）
- **Preview**: プレビュー環境（PR作成時）
- **Development**: 開発環境（ローカル開発時）

### 📝 **設定後の確認**
```javascript
// api/mcp.ts で環境変数が正しく読み込まれているか確認
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials for MCP server');
}
```

## 🎯 **トラブルシューティング**

### 問題: 環境変数が反映されない
**解決策**:
1. 環境変数を再確認
2. 全環境（Production, Preview, Development）が選択されているか確認
3. 再デプロイを実行

### 問題: 500エラーが続く
**解決策**:
1. Vercel Function Logs を確認
2. Supabase接続を確認
3. 環境変数の値が正しいか確認

## 🔗 **参考リンク**

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase API Settings](https://supabase.com/dashboard/project/_/settings/api)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## 📞 **サポートが必要な場合**

1. **Vercel Dashboard** のスクリーンショットを共有
2. **Supabase Dashboard** のAPI設定画面を確認
3. **環境変数の設定状況** を確認

設定完了後、MCPサーバーのテストを再実行してください！ 