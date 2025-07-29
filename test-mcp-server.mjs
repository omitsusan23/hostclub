import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// 環境変数をロード
config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;

// Supabase設定
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('必要な環境変数が設定されていません:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定');
  console.error('SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// MCPエンドポイント
app.post('/api/mcp', async (req, res) => {
  const { method, params, id } = req.body;

  try {
    // tools/list リクエスト
    if (method === 'tools/list') {
      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
              name: 'get_stores',
              description: '登録されている店舗の一覧を取得します',
              inputSchema: {
                type: 'object',
                properties: {},
                required: []
              }
            },
            {
              name: 'get_casts',
              description: '指定された店舗のキャスト一覧を取得します',
              inputSchema: {
                type: 'object',
                properties: {
                  storeId: {
                    type: 'string',
                    description: '店舗ID'
                  }
                },
                required: ['storeId']
              }
            },
            {
              name: 'check_store_registration',
              description: '指定されたストアIDが登録されているかチェックします',
              inputSchema: {
                type: 'object',
                properties: {
                  storeId: {
                    type: 'string',
                    description: 'チェックするストアID'
                  }
                },
                required: ['storeId']
              }
            },
            {
              name: 'get_database_stats',
              description: 'データベースの統計情報を取得します',
              inputSchema: {
                type: 'object',
                properties: {},
                required: []
              }
            },
            {
              name: 'get_store_details',
              description: '指定された店舗の詳細情報を取得します',
              inputSchema: {
                type: 'object',
                properties: {
                  storeId: {
                    type: 'string',
                    description: '店舗ID'
                  }
                },
                required: ['storeId']
              }
            }
          ]
        }
      });
    }

    // tools/call リクエスト
    if (method === 'tools/call') {
      const { name, arguments: args } = params;

      switch (name) {
        case 'get_stores': {
          const { data, error } = await supabase
            .from('stores')
            .select('*');
          
          if (error) throw error;
          
          return res.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `店舗一覧を取得しました。合計 ${data.length} 店舗が見つかりました:\n\n${
                    data.map(store => `- ${store.name} (ID: ${store.id})`).join('\n')
                  }`
                }
              ]
            }
          });
        }

        case 'get_casts': {
          const { data, error } = await supabase
            .from('casts')
            .select('*')
            .eq('store_id', args.storeId);
          
          if (error) throw error;
          
          return res.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `店舗ID ${args.storeId} のキャスト一覧を取得しました。合計 ${data.length} 人のキャストが見つかりました:\n\n${
                    data.map(cast => `- ${cast.display_name || cast.real_name}`).join('\n')
                  }`
                }
              ]
            }
          });
        }

        case 'check_store_registration': {
          const { data, error } = await supabase
            .from('stores')
            .select('id, name')
            .eq('id', args.storeId)
            .single();
          
          const isRegistered = !error && data !== null;
          
          return res.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: isRegistered 
                    ? `ストアID "${args.storeId}" は登録されています。店舗名: ${data.name}`
                    : `ストアID "${args.storeId}" は登録されていません。`
                }
              ]
            }
          });
        }

        case 'get_database_stats': {
          const [stores, casts, tables, reservations] = await Promise.all([
            supabase.from('stores').select('*', { count: 'exact', head: true }),
            supabase.from('casts').select('*', { count: 'exact', head: true }),
            supabase.from('tables').select('*', { count: 'exact', head: true }),
            supabase.from('reservations').select('*', { count: 'exact', head: true })
          ]);
          
          return res.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `データベース統計情報:\n\n- 店舗数: ${stores.count || 0}\n- キャスト数: ${casts.count || 0}\n- テーブル数: ${tables.count || 0}\n- 予約数: ${reservations.count || 0}`
                }
              ]
            }
          });
        }

        case 'get_store_details': {
          const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('*')
            .eq('id', args.storeId)
            .single();
          
          if (storeError) throw storeError;
          
          const { count: castCount } = await supabase
            .from('casts')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', args.storeId);
          
          const { count: tableCount } = await supabase
            .from('tables')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', args.storeId);
          
          return res.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `店舗詳細情報:\n\n店舗名: ${store.name}\nID: ${store.id}\nキャスト数: ${castCount || 0}\nテーブル数: ${tableCount || 0}\n設定: ${JSON.stringify(store.settings, null, 2)}`
                }
              ]
            }
          });
        }

        default:
          return res.status(400).json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Unknown tool: ${name}`
            }
          });
      }
    }

    // その他のメソッド
    return res.status(400).json({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Method not found: ${method}`
      }
    });

  } catch (error) {
    console.error('MCPエラー:', error);
    return res.status(500).json({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: error.message
      }
    });
  }
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok', supabase: supabaseUrl ? 'configured' : 'not configured' });
});

app.listen(port, () => {
  console.log(`MCP サーバーが起動しました: http://localhost:${port}`);
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log('\nテストするには mcp-test.html をブラウザで開いてください');
});