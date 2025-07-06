import https from 'https';
import dns from 'dns';

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

// 可能性のあるVercelドメインをチェック
const possibleDomains = [
  'hostclub-1.vercel.app',
  'hostclub.vercel.app',
  'hostclub-omitsusan23.vercel.app',
  'hostclub-1-omitsusan23.vercel.app',
  'hostclub-git-main-omitsusan23.vercel.app',
  'hostclub-pi.vercel.app',
  'hostclub-nu.vercel.app',
  'hostclub-alpha.vercel.app',
  'hostclub-beta.vercel.app'
];

async function checkDomain(domain) {
  return new Promise((resolve) => {
    const options = {
      hostname: domain,
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      resolve({
        domain,
        status: res.statusCode,
        headers: res.headers,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (err) => {
      resolve({
        domain,
        error: err.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        domain,
        error: 'Timeout',
        success: false
      });
    });

    req.end();
  });
}

async function checkDNS(domain) {
  return new Promise((resolve) => {
    dns.resolve4(domain, (err, addresses) => {
      if (err) {
        resolve({
          domain,
          dns_error: err.message,
          dns_success: false
        });
      } else {
        resolve({
          domain,
          addresses,
          dns_success: true
        });
      }
    });
  });
}

async function main() {
  log('🔍 Vercel ドメイン確認ツール', 'bold');
  log('===============================================', 'cyan');
  log(`🕒 開始時刻: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
  log('', 'reset');

  log('📋 チェック対象ドメイン:', 'blue');
  possibleDomains.forEach((domain, index) => {
    log(`   ${index + 1}. ${domain}`, 'cyan');
  });
  log('', 'reset');

  log('🌐 HTTP接続テスト実行中...', 'yellow');
  const httpResults = await Promise.all(
    possibleDomains.map(domain => checkDomain(domain))
  );

  log('📡 DNS解決テスト実行中...', 'yellow');
  const dnsResults = await Promise.all(
    possibleDomains.map(domain => checkDNS(domain))
  );

  log('📊 結果サマリー', 'bold');
  log('===============================================', 'cyan');

  const workingDomains = [];
  
  for (let i = 0; i < possibleDomains.length; i++) {
    const domain = possibleDomains[i];
    const httpResult = httpResults[i];
    const dnsResult = dnsResults[i];

    log(`\n🌐 ${domain}`, 'bold');
    
    if (dnsResult.dns_success) {
      log(`   📡 DNS: ✅ ${dnsResult.addresses.join(', ')}`, 'green');
    } else {
      log(`   📡 DNS: ❌ ${dnsResult.dns_error}`, 'red');
    }

    if (httpResult.success) {
      log(`   🌍 HTTP: ✅ ${httpResult.status}`, 'green');
      workingDomains.push(domain);
      
      if (httpResult.headers['x-vercel-id']) {
        log(`   🆔 Vercel ID: ${httpResult.headers['x-vercel-id']}`, 'green');
      }
    } else {
      log(`   🌍 HTTP: ❌ ${httpResult.error || 'Unknown error'}`, 'red');
    }
  }

  log('\n🎯 推奨事項', 'bold');
  log('===============================================', 'cyan');

  if (workingDomains.length > 0) {
    log('✅ 動作中のドメインが見つかりました:', 'green');
    workingDomains.forEach(domain => {
      log(`   • https://${domain}`, 'green');
    });
    log('', 'reset');
    log('💡 これらのドメインでMCPサーバーを確認してください:', 'blue');
    workingDomains.forEach(domain => {
      log(`   • https://${domain}/api/mcp`, 'blue');
    });
  } else {
    log('❌ 動作中のVercelドメインが見つかりませんでした', 'red');
    log('', 'reset');
    log('🔧 対処法:', 'yellow');
    log('   1. Vercelダッシュボードで正しいドメインを確認', 'yellow');
    log('   2. vercel CLI で `vercel --prod` を実行してデプロイ', 'yellow');
    log('   3. プロジェクトの設定でカスタムドメインを確認', 'yellow');
  }

  log('', 'reset');
  log('🔗 参考リンク:', 'blue');
  log('   • Vercel Dashboard: https://vercel.com/dashboard', 'blue');
  log('   • GitHub連携: https://github.com/omitsusan23/hostclub', 'blue');
  
  log('', 'reset');
  log(`🕒 完了時刻: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
}

main().catch(console.error); 