import https from 'https';

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

async function testDebugMCP() {
  log('🔍 Debug MCP サーバーテスト', 'blue');
  log('===============================================', 'cyan');

  const vercelUrl = 'https://hostclub.vercel.app/api/mcp-debug';
  
  return new Promise((resolve, reject) => {
    const testMCPRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };
    
    const postData = JSON.stringify(testMCPRequest);
    
    const options = {
      hostname: 'hostclub.vercel.app',
      port: 443,
      path: '/api/mcp-debug',
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
          
          if (res.statusCode === 200) {
            log('✅ Debug MCP サーバー接続成功！', 'green');
            
            if (parsed.result && parsed.result.tools) {
              log(`🔧 利用可能なツール数: ${parsed.result.tools.length}`, 'green');
              parsed.result.tools.forEach((tool, index) => {
                log(`   ${index + 1}. ${tool.name} - ${tool.description}`, 'green');
              });
            } else if (parsed.status === 'ok') {
              log('📊 基本的な接続は成功', 'green');
              log(`🔧 環境情報: ${JSON.stringify(parsed.environment, null, 2)}`, 'cyan');
            }
          } else {
            log('⚠️ 期待されるレスポンスではありません', 'yellow');
            if (parsed.error) {
              log(`❌ エラー詳細: ${parsed.error}`, 'red');
              if (parsed.debug) {
                log(`🔍 デバッグ情報: ${JSON.stringify(parsed.debug, null, 2)}`, 'yellow');
              }
            }
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

async function testBasicDebugMCP() {
  log('🌐 Basic Debug MCP テスト', 'blue');
  log('===============================================', 'cyan');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'hostclub.vercel.app',
      port: 443,
      path: '/api/mcp-debug',
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      log(`📊 ステータスコード: ${res.statusCode}`, 'green');

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        log(`📥 レスポンス:`, 'green');
        try {
          const parsed = JSON.parse(data);
          log(JSON.stringify(parsed, null, 2), 'green');
        } catch (e) {
          log(`レスポンス (生データ): ${data}`, 'yellow');
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

async function main() {
  log('🚀 Debug MCP サーバーテスト開始', 'bold');
  log('===============================================', 'cyan');
  log(`🕒 開始時刻: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
  log('', 'reset');

  // 1. 基本的なGETテスト
  try {
    await testBasicDebugMCP();
    log('', 'reset');
  } catch (error) {
    log(`❌ Basic GET テスト失敗: ${error.message}`, 'red');
    log('', 'reset');
  }

  // 2. MCP POSTテスト
  try {
    await testDebugMCP();
    log('', 'reset');
  } catch (error) {
    log(`❌ MCP POST テスト失敗: ${error.message}`, 'red');
    log('', 'reset');
  }

  log('🎯 診断結果', 'bold');
  log('===============================================', 'cyan');
  log('このテストにより、以下の問題が特定できます:', 'blue');
  log('1. 環境変数の設定状況', 'blue');
  log('2. Supabase接続の問題', 'blue');
  log('3. @vercel/mcp-adapter の問題', 'blue');
  log('', 'reset');
  log(`🕒 完了時刻: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
}

main().catch(console.error); 