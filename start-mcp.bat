@echo off
title Hostclub MCP Server
echo 🚀 Hostclub MCP Server を起動中...
echo.
echo 📁 作業ディレクトリ: %CD%
echo ⏰ 開始時刻: %DATE% %TIME%
echo.

REM 環境変数の確認
if not exist ".env" (
    echo ❌ .envファイルが見つかりません
    echo 💡 VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定してください
    pause
    exit /b 1
)

REM MCPサーバーの起動
echo 🔗 MCPサーバーを起動しています...
node test-mcp-server.mjs

echo.
echo ⏹️ MCPサーバーが停止しました
pause 