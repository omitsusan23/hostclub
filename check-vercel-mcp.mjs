import https from 'https';
import http from 'http';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// テスト用のMCPリクエスト
const testMCPRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

async function testVercelMCP() {
  log('🔍 Vercel MCP サーバー接続テスト', 'blue');
  log('===============================================', 'cyan');

  const vercelUrl = 'https://hostclub-1.vercel.app/api/mcp';
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testMCPRequest);
    
    const options = {
      hostname: 'hostclub-1.vercel.app',
      port: 443,
      path: '/api/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json'
      },
      timeout: 15000
    };

    log(`📡 接続先: ${vercelUrl}`, 'cyan');
    log(`📤 送信データ: ${postData}`, 'yellow');

    const req = https.request(options, (res) => {
      log(`📊 ステータスコード: ${res.statusCode}`, 'green');
      log(`📋 レスポンスヘッダー:`, 'yellow');
      Object.entries(res.headers).forEach(([key, value]) => {
        log(`   ${key}: ${value}`, 'yellow');
      });

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        log(`📥 レスポンス:`, 'green');
        try {
          const parsed = JSON.parse(data);
          log(JSON.stringify(parsed, null, 2), 'green');
          
          if (res.statusCode === 200 && parsed.result) {
            log('✅ Vercel MCP サーバー接続成功！', 'green');
            if (parsed.result.tools) {
              log(`🔧 利用可能なツール数: ${parsed.result.tools.length}`, 'green');
              parsed.result.tools.forEach((tool, index) => {
                log(`   ${index + 1}. ${tool.name} - ${tool.description}`, 'green');
              });
            }
          } else {
            log('⚠️ 接続は成功したが、期待されるレスポンスではありません', 'yellow');
          }
        } catch (e) {
          log(`レスポンス (生データ): ${data}`, 'yellow');
          log(`JSON解析エラー: ${e.message}`, 'red');
        }
        resolve(res.statusCode);
      });
    });

    req.on('error', (err) => {
      log(`❌ 接続エラー: ${err.message}`, 'red');
      reject(err);
    });

    req.on('timeout', () => {
      log('⏰ タイムアウト (15秒)', 'red');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.write(postData);
    req.end();
  });
}

async function testVercelStatus() {
  log('🌐 Vercel サイト基本接続テスト', 'blue');
  log('===============================================', 'cyan');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'hostclub-1.vercel.app',
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      log(`📊 ステータスコード: ${res.statusCode}`, 'green');
      log(`📋 レスポンスヘッダー:`, 'yellow');
      Object.entries(res.headers).forEach(([key, value]) => {
        log(`   ${key}: ${value}`, 'yellow');
      });

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ Vercel サイト接続成功！', 'green');
          log(`📄 レスポンス長: ${data.length} バイト`, 'green');
        } else {
          log(`⚠️ 予期しないステータスコード: ${res.statusCode}`, 'yellow');
        }
        resolve(res.statusCode);
      });
    });

    req.on('error', (err) => {
      log(`❌ 接続エラー: ${err.message}`, 'red');
      reject(err);
    });

    req.on('timeout', () => {
      log('⏰ タイムアウト (10秒)', 'red');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function testLocalMCP() {
  log('🏠 ローカル MCP サーバー接続テスト', 'blue');
  log('===============================================', 'cyan');

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testMCPRequest);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json'
      },
      timeout: 5000
    };

    log(`📡 接続先: http://localhost:3001/`, 'cyan');

    const req = http.request(options, (res) => {
      log(`📊 ステータスコード: ${res.statusCode}`, 'green');

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ ローカル MCP サーバー接続成功！', 'green');
        } else {
          log(`⚠️ 予期しないステータスコード: ${res.statusCode}`, 'yellow');
        }
        resolve(res.statusCode);
      });
    });

    req.on('error', (err) => {
      log(`❌ ローカル接続エラー: ${err.message}`, 'red');
      log('💡 ローカルサーバーが起動していない可能性があります', 'yellow');
      reject(err);
    });

    req.on('timeout', () => {
      log('⏰ タイムアウト (5秒)', 'red');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// メイン実行
async function main() {
  log('🚀 MCP サーバー接続テスト開始', 'bold');
  log('===============================================', 'cyan');
  log(`🕒 開始時刻: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
  log('', 'reset');

  const results = {
    vercel_site: null,
    vercel_mcp: null,
    local_mcp: null
  };

  // 1. Vercel サイト基本接続テスト
  try {
    results.vercel_site = await testVercelStatus();
    log('', 'reset');
  } catch (error) {
    log(`❌ Vercel サイト接続失敗: ${error.message}`, 'red');
    log('', 'reset');
  }

  // 2. Vercel MCP サーバーテスト
  try {
    results.vercel_mcp = await testVercelMCP();
    log('', 'reset');
  } catch (error) {
    log(`❌ Vercel MCP サーバー接続失敗: ${error.message}`, 'red');
    log('', 'reset');
  }

  // 3. ローカル MCP サーバーテスト
  try {
    results.local_mcp = await testLocalMCP();
    log('', 'reset');
  } catch (error) {
    log(`❌ ローカル MCP サーバー接続失敗: ${error.message}`, 'red');
    log('', 'reset');
  }

  // 結果サマリー
  log('📊 テスト結果サマリー', 'bold');
  log('===============================================', 'cyan');
  log(`🌐 Vercel サイト: ${results.vercel_site ? `✅ ${results.vercel_site}` : '❌ 失敗'}`, 'green');
  log(`🔧 Vercel MCP: ${results.vercel_mcp ? `✅ ${results.vercel_mcp}` : '❌ 失敗'}`, 'green');
  log(`🏠 ローカル MCP: ${results.local_mcp ? `✅ ${results.local_mcp}` : '❌ 失敗'}`, 'green');
  log('', 'reset');

  // 推奨事項
  log('💡 推奨事項', 'bold');
  log('===============================================', 'cyan');
  
  if (results.vercel_mcp === 200) {
    log('✅ Vercel MCP サーバーが正常に動作しています！', 'green');
    log('   Cursor の MCP 設定で以下のURLを使用できます:', 'green');
    log('   https://hostclub-1.vercel.app/api/mcp', 'green');
    log('', 'reset');
  } else {
    log('⚠️ Vercel MCP サーバーに問題があります', 'yellow');
    log('   以下を確認してください:', 'yellow');
    log('   1. Vercel デプロイメントが成功しているか', 'yellow');
    log('   2. 環境変数が正しく設定されているか', 'yellow');
    log('   3. api/mcp.ts ファイルが存在するか', 'yellow');
    log('', 'reset');
  }

  if (!results.local_mcp) {
    log('💭 ローカル MCP サーバーは起動していません', 'yellow');
    log('   開発時に使用する場合は、別ターミナルで起動してください', 'yellow');
    log('', 'reset');
  }

  log('🎯 現在のCursor MCP設定', 'bold');
  log('===============================================', 'cyan');
  log('cursor-mcp-config.json の設定:', 'cyan');
  log('{', 'cyan');
  log('  "mcpServers": {', 'cyan');
  log('    "hostclub-local": {', 'cyan');
  log('      "url": "http://localhost:3001"', 'cyan');
  log('    },', 'cyan');
  log('    "hostclub-production": {', 'cyan');
  log('      "url": "https://hostclub-1.vercel.app/api/mcp"', 'cyan');
  log('    },', 'cyan');
  log('    "figma": {', 'cyan');
  log('      "url": "http://127.0.0.1:3845/sse"', 'cyan');
  log('    }', 'cyan');
  log('  }', 'cyan');
  log('}', 'cyan');
  log('', 'reset');

  log(`🕒 完了時刻: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
}

main().catch(console.error); 