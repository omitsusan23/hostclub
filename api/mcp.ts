import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

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

    if (!supabaseUrl) {
      return res.status(500).json({
        error: 'VITE_SUPABASE_URL not set'
      });
    }

    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    
    if (!supabaseKey) {
      return res.status(500).json({
        error: 'Neither SUPABASE_SERVICE_ROLE_KEY nor VITE_SUPABASE_ANON_KEY is set'
      });
    }

    // Supabase接続
    const supabase = createClient(supabaseUrl, supabaseKey);

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
                    description: '取得する店舗数の上限（1-100）',
                    minimum: 1,
                    maximum: 100,
                    default: 10
                  }
                }
              }
            },
            {
              name: 'get_casts',
              description: '指定した店舗のキャスト一覧を取得します',
              inputSchema: {
                type: 'object',
                properties: {
                  store_id: {
                    type: 'string',
                    description: '店舗のUUID',
                    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                  },
                  limit: {
                    type: 'number',
                    description: '取得するキャスト数の上限（1-50）',
                    minimum: 1,
                    maximum: 50,
                    default: 20
                  }
                },
                required: ['store_id']
              }
            },
            {
              name: 'check_store_registration',
              description: 'サブドメインで店舗の登録状況を確認します',
              inputSchema: {
                type: 'object',
                properties: {
                  subdomain: {
                    type: 'string',
                    description: '確認するサブドメイン',
                    minLength: 1
                  }
                },
                required: ['subdomain']
              }
            },
            {
              name: 'get_database_stats',
              description: 'Hostclubデータベースの統計情報を取得します',
              inputSchema: {
                type: 'object',
                properties: {}
              }
            },
            {
              name: 'get_store_details',
              description: '店舗の詳細情報（キャスト、オペレーター、管理者含む）を取得します',
              inputSchema: {
                type: 'object',
                properties: {
                  store_id: {
                    type: 'string',
                    description: '店舗のUUID',
                    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                  }
                },
                required: ['store_id']
              }
            }
          ]
        }
      });
    }

    // MCP tools/call リクエストの処理
    if (req.method === 'POST' && req.body?.method === 'tools/call') {
      const { name, arguments: args } = req.body.params;

      try {
        let result;

        switch (name) {
          case 'get_stores':
            result = await handleGetStores(supabase, args);
            break;
          case 'get_casts':
            result = await handleGetCasts(supabase, args);
            break;
          case 'check_store_registration':
            result = await handleCheckStoreRegistration(supabase, args);
            break;
          case 'get_database_stats':
            result = await handleGetDatabaseStats(supabase);
            break;
          case 'get_store_details':
            result = await handleGetStoreDetails(supabase, args);
            break;
          default:
            return res.status(400).json({
              jsonrpc: '2.0',
              id: req.body.id,
              error: {
                code: -32601,
                message: `Unknown tool: ${name}`
              }
            });
        }

        return res.status(200).json({
          jsonrpc: '2.0',
          id: req.body.id,
          result
        });

      } catch (error) {
        return res.status(500).json({
          jsonrpc: '2.0',
          id: req.body.id,
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : 'Internal error'
          }
        });
      }
    }

    // 基本的なレスポンス
    return res.status(200).json({
      status: 'ok',
      message: 'Hostclub MCP Server is working',
      version: '1.0.0'
    });

  } catch (error) {
    console.error('Handler error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// ツール実装関数
async function handleGetStores(supabase: any, args: any) {
  const limit = args?.limit || 10;

  const { data, error } = await supabase
    .from('stores')
    .select('id, name, subdomain, created_at')
    .limit(limit);

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  const storeList = data.map((store: any) => 
    `🏪 **${store.name}** (ID: ${store.id})\n` +
    `   - サブドメイン: ${store.subdomain}\n` +
    `   - 作成日: ${new Date(store.created_at).toLocaleDateString('ja-JP')}`
  ).join('\n\n');

  return {
    content: [{ 
      type: 'text', 
      text: `📋 **店舗一覧** (${data.length}件)\n\n${storeList}` 
    }]
  };
}

async function handleGetCasts(supabase: any, args: any) {
  const { store_id, limit = 20 } = args;

  const { data, error } = await supabase
    .from('casts')
    .select('id, username, email, role, created_at')
    .eq('store_id', store_id)
    .limit(limit);

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  if (data.length === 0) {
    return {
      content: [{ 
        type: 'text', 
        text: '📭 この店舗にはまだキャストが登録されていません' 
      }]
    };
  }

  const castList = data.map((cast: any) => 
    `👤 **${cast.username || cast.email || 'Anonymous'}**\n` +
    `   - 役割: ${cast.role}\n` +
    `   - Email: ${cast.email || '未設定'}\n` +
    `   - 登録日: ${new Date(cast.created_at).toLocaleDateString('ja-JP')}`
  ).join('\n\n');

  return {
    content: [{ 
      type: 'text', 
      text: `👥 **キャスト一覧** (${data.length}件)\n\n${castList}` 
    }]
  };
}

async function handleCheckStoreRegistration(supabase: any, args: any) {
  const { subdomain } = args;

  const { data: storeData, error: storeError } = await supabase
    .from('stores')
    .select('id, name, subdomain')
    .eq('subdomain', subdomain)
    .single();

  if (storeError && storeError.code !== 'PGRST116') {
    throw new Error(`Database error: ${storeError.message}`);
  }

  if (!storeData) {
    return {
      content: [{ 
        type: 'text', 
        text: `❌ サブドメイン「${subdomain}」の店舗は登録されていません` 
      }]
    };
  }

  // ユーザー数の取得は簡略化（auth.admin.listUsers() は権限が必要な場合がある）
  return {
    content: [{ 
      type: 'text', 
      text: `✅ **店舗情報**\n\n` +
           `🏪 店舗名: ${storeData.name}\n` +
           `🌐 サブドメイン: ${storeData.subdomain}\n` +
           `🆔 店舗ID: ${storeData.id}`
    }]
  };
}

async function handleGetDatabaseStats(supabase: any) {
  const [storesResult, castsResult, operatorsResult, adminsResult] = await Promise.all([
    supabase.from('stores').select('id', { count: 'exact' }),
    supabase.from('casts').select('id', { count: 'exact' }),
    supabase.from('operators').select('id', { count: 'exact' }),
    supabase.from('admins').select('id', { count: 'exact' }),
  ]);

  const stats = {
    stores: storesResult.count || 0,
    casts: castsResult.count || 0,
    operators: operatorsResult.count || 0,
    admins: adminsResult.count || 0,
  };

  const total = stats.casts + stats.operators + stats.admins;

  return {
    content: [{ 
      type: 'text', 
      text: `📊 **Hostclub データベース統計**\n\n` +
           `🏪 店舗数: ${stats.stores}店\n` +
           `👤 キャスト数: ${stats.casts}名\n` +
           `⚙️ オペレーター数: ${stats.operators}名\n` +
           `👑 管理者数: ${stats.admins}名\n` +
           `📈 総ユーザー数: ${total}名\n\n` +
           `📅 取得日時: ${new Date().toLocaleString('ja-JP')}`
    }]
  };
}

async function handleGetStoreDetails(supabase: any, args: any) {
  const { store_id } = args;

  const [storeResult, castsResult, operatorsResult, adminsResult] = await Promise.all([
    supabase.from('stores').select('*').eq('id', store_id).single(),
    supabase.from('casts').select('id, username, email, role').eq('store_id', store_id),
    supabase.from('operators').select('id, username, email').eq('store_id', store_id),
    supabase.from('admins').select('id, username, email').eq('store_id', store_id),
  ]);

  if (storeResult.error) {
    throw new Error(`Store not found: ${storeResult.error.message}`);
  }

  const store = storeResult.data;
  const casts = castsResult.data || [];
  const operators = operatorsResult.data || [];
  const admins = adminsResult.data || [];

  let details = `🏪 **${store.name}** の詳細情報\n\n`;
  details += `🆔 店舗ID: ${store.id}\n`;
  details += `🌐 サブドメイン: ${store.subdomain}\n`;
  details += `📅 作成日: ${new Date(store.created_at).toLocaleDateString('ja-JP')}\n\n`;

  details += `👥 **メンバー構成**\n`;
  details += `👑 管理者: ${admins.length}名\n`;
  details += `⚙️ オペレーター: ${operators.length}名\n`;
  details += `👤 キャスト: ${casts.length}名\n\n`;

  if (admins.length > 0) {
    details += `👑 **管理者一覧**\n`;
    admins.forEach((admin: any) => {
      details += `   • ${admin.username || admin.email || 'Anonymous'}\n`;
    });
    details += '\n';
  }

  if (operators.length > 0) {
    details += `⚙️ **オペレーター一覧**\n`;
    operators.forEach((operator: any) => {
      details += `   • ${operator.username || operator.email || 'Anonymous'}\n`;
    });
    details += '\n';
  }

  if (casts.length > 0) {
    details += `👤 **キャスト一覧** (最新5名)\n`;
    casts.slice(0, 5).forEach((cast: any) => {
      details += `   • ${cast.username || cast.email || 'Anonymous'} (${cast.role})\n`;
    });
    if (casts.length > 5) {
      details += `   ... 他 ${casts.length - 5}名\n`;
    }
  }

  return {
    content: [{ 
      type: 'text', 
      text: details 
    }]
  };
} 