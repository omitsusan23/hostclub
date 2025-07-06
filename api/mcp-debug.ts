import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 環境変数の確認
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    console.log('Debug info:');
    console.log('- VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Not set');
    console.log('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set');

    if (!supabaseUrl) {
      return res.status(500).json({
        error: 'VITE_SUPABASE_URL not set',
        debug: {
          availableEnvVars: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
        }
      });
    }

    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    
    if (!supabaseKey) {
      return res.status(500).json({
        error: 'Neither SUPABASE_SERVICE_ROLE_KEY nor VITE_SUPABASE_ANON_KEY is set',
        debug: {
          availableEnvVars: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
        }
      });
    }

    // Supabase接続テスト
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Testing Supabase connection...');
    
    // 簡単なクエリでテスト
    const { data, error } = await supabase
      .from('stores')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: 'Supabase connection failed',
        details: error.message,
        debug: {
          supabaseUrl,
          hasServiceKey: !!supabaseServiceKey,
          hasAnonKey: !!supabaseAnonKey
        }
      });
    }

    console.log('Supabase connection successful');

    // MCP tools/list リクエストの処理
    if (req.method === 'POST' && req.body?.method === 'tools/list') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: {
          tools: [
            {
              name: 'get_stores',
              description: '登録されている店舗の一覧を取得します',
              inputSchema: {
                type: 'object',
                properties: {
                  limit: {
                    type: 'number',
                    description: '取得する店舗数の上限',
                    default: 10
                  }
                }
              }
            },
            {
              name: 'get_database_stats',
              description: 'Hostclubデータベースの統計情報を取得します',
              inputSchema: {
                type: 'object',
                properties: {}
              }
            }
          ]
        }
      });
    }

    // 基本的なレスポンス
    return res.status(200).json({
      status: 'ok',
      message: 'MCP Debug Server is working',
      environment: {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        hasAnonKey: !!supabaseAnonKey,
        method: req.method,
        body: req.body
      }
    });

  } catch (error) {
    console.error('Handler error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 