import { EventSource } from 'eventsource';

console.log('🎨 Figma MCP Server 接続チェック\n');

const FIGMA_MCP_URL = 'http://127.0.0.1:3845/sse';

console.log(`📍 接続先: ${FIGMA_MCP_URL}`);
console.log('🔄 接続テスト中...\n');

try {
    const eventSource = new EventSource(FIGMA_MCP_URL);
    
    eventSource.onopen = function(event) {
        console.log('✅ Figma MCPサーバーに正常に接続されました！');
        console.log(`🕒 接続時刻: ${new Date().toLocaleString('ja-JP')}`);
        console.log('📦 プロトコル: Server-Sent Events (SSE)');
        console.log('🎯 ステータス: アクティブ\n');
        
        console.log('💡 次のステップ:');
        console.log('1. figma-mcp-test.html をブラウザで開いてテスト');
        console.log('2. cursor-mcp-config.json の設定をCursorに追加');
        console.log('3. Figmaでフレームを選択してAIに指示\n');
        
        eventSource.close();
        process.exit(0);
    };
    
    eventSource.onerror = function(event) {
        console.log('❌ Figma MCPサーバーへの接続に失敗しました\n');
        
        console.log('🔍 確認事項:');
        console.log('1. Figmaデスクトップアプリが起動中か');
        console.log('2. Figmaメニュー → 基本設定でMCPサーバーが有効か');
        console.log('3. Figmaファイルが開かれているか');
        console.log('4. ポート3845がファイアウォールでブロックされていないか\n');
        
        console.log('📚 詳細ガイド:');
        console.log('https://help.figma.com/hc/ja/articles/32132100833559-Dev-Mode-MCP%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E5%88%A9%E7%94%A8%E3%82%AC%E3%82%A4%E3%83%89');
        
        eventSource.close();
        process.exit(1);
    };
    
    // 10秒後にタイムアウト
    setTimeout(() => {
        if (eventSource.readyState === EventSource.CONNECTING) {
            console.log('⚠️  接続タイムアウトが発生しました\n');
            
            console.log('💡 トラブルシューティング:');
            console.log('1. Figmaデスクトップアプリを再起動');
            console.log('2. MCPサーバー設定を再確認');
            console.log('3. 他のアプリケーションがポート3845を使用していないか確認');
            
            eventSource.close();
            process.exit(1);
        }
    }, 10000);
    
} catch (error) {
    console.log(`❌ 予期しないエラーが発生しました: ${error.message}\n`);
    
    console.log('🛠️  解決方法:');
    console.log('1. Node.jsのバージョンを確認 (v18以上推奨)');
    console.log('2. eventsourceパッケージをインストール: npm install eventsource');
    console.log('3. ネットワーク設定を確認');
    
    process.exit(1);
} 