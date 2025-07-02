import { z } from 'zod';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createMcpHandler } from '@vercel/mcp-adapter';
import { createClient } from '@supabase/supabase-js';

// Supabase設定
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials for MCP server');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// MCPハンドラーの作成
const handler = createMcpHandler(
  (server) => {
    // 1. 店舗情報の取得
    server.tool(
      'get_stores',
      '登録されている店舗の一覧を取得します',
      {
        limit: z.number().int().min(1).max(100).optional().default(10),
      },
      async ({ limit }) => {
        try {
          const { data, error } = await supabase
            .from('stores')
            .select('id, name, subdomain, created_at')
            .limit(limit);

          if (error) {
            return {
              content: [{ 
                type: 'text', 
                text: `❌ エラー: ${error.message}` 
              }],
            };
          }

          const storeList = data.map(store => 
            `🏪 **${store.name}** (ID: ${store.id})\n` +
            `   - サブドメイン: ${store.subdomain}\n` +
            `   - 作成日: ${new Date(store.created_at).toLocaleDateString('ja-JP')}`
          ).join('\n\n');

          return {
            content: [{ 
              type: 'text', 
              text: `📋 **店舗一覧** (${data.length}件)\n\n${storeList}` 
            }],
          };
        } catch (err) {
          return {
            content: [{ 
              type: 'text', 
              text: `❌ 予期しないエラー: ${err instanceof Error ? err.message : 'Unknown error'}` 
            }],
          };
        }
      },
    );

    // 2. キャスト一覧の取得
    server.tool(
      'get_casts',
      '指定した店舗のキャスト一覧を取得します',
      {
        store_id: z.string().uuid('有効なUUIDを指定してください'),
        limit: z.number().int().min(1).max(50).optional().default(20),
      },
      async ({ store_id, limit }) => {
        try {
          const { data, error } = await supabase
            .from('casts')
            .select('id, username, email, role, created_at')
            .eq('store_id', store_id)
            .limit(limit);

          if (error) {
            return {
              content: [{ 
                type: 'text', 
                text: `❌ エラー: ${error.message}` 
              }],
            };
          }

          if (data.length === 0) {
            return {
              content: [{ 
                type: 'text', 
                text: '📭 この店舗にはまだキャストが登録されていません' 
              }],
            };
          }

          const castList = data.map(cast => 
            `👤 **${cast.username || cast.email || 'Anonymous'}**\n` +
            `   - 役割: ${cast.role}\n` +
            `   - Email: ${cast.email || '未設定'}\n` +
            `   - 登録日: ${new Date(cast.created_at).toLocaleDateString('ja-JP')}`
          ).join('\n\n');

          return {
            content: [{ 
              type: 'text', 
              text: `👥 **キャスト一覧** (${data.length}件)\n\n${castList}` 
            }],
          };
        } catch (err) {
          return {
            content: [{ 
              type: 'text', 
              text: `❌ 予期しないエラー: ${err instanceof Error ? err.message : 'Unknown error'}` 
            }],
          };
        }
      },
    );

    // 3. 店舗登録状況の確認
    server.tool(
      'check_store_registration',
      'サブドメインで店舗の登録状況を確認します',
      {
        subdomain: z.string().min(1, 'サブドメインを指定してください'),
      },
      async ({ subdomain }) => {
        try {
          // 店舗の存在確認
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('id, name, subdomain')
            .eq('subdomain', subdomain)
            .single();

          if (storeError && storeError.code !== 'PGRST116') {
            return {
              content: [{ 
                type: 'text', 
                text: `❌ エラー: ${storeError.message}` 
              }],
            };
          }

          if (!storeData) {
            return {
              content: [{ 
                type: 'text', 
                text: `❌ サブドメイン「${subdomain}」の店舗は登録されていません` 
              }],
            };
          }

          // ユーザー数の取得
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          let userCount = 0;
          if (!authError && authData) {
            userCount = authData.users.filter(
              user => user.user_metadata?.store_id === storeData.id
            ).length;
          }

          return {
            content: [{ 
              type: 'text', 
              text: `✅ **店舗情報**\n\n` +
                   `🏪 店舗名: ${storeData.name}\n` +
                   `🌐 サブドメイン: ${storeData.subdomain}\n` +
                   `👥 登録ユーザー数: ${userCount}名\n` +
                   `🆔 店舗ID: ${storeData.id}`
            }],
          };
        } catch (err) {
          return {
            content: [{ 
              type: 'text', 
              text: `❌ 予期しないエラー: ${err instanceof Error ? err.message : 'Unknown error'}` 
            }],
          };
        }
      },
    );

    // 4. データベース統計情報
    server.tool(
      'get_database_stats',
      'Hostclubデータベースの統計情報を取得します',
      {},
      async () => {
        try {
          // 並列でデータを取得
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
            }],
          };
        } catch (err) {
          return {
            content: [{ 
              type: 'text', 
              text: `❌ 統計情報の取得に失敗: ${err instanceof Error ? err.message : 'Unknown error'}` 
            }],
          };
        }
      },
    );

    // 5. 店舗の詳細情報取得
    server.tool(
      'get_store_details',
      '店舗の詳細情報（キャスト、オペレーター、管理者含む）を取得します',
      {
        store_id: z.string().uuid('有効なUUIDを指定してください'),
      },
      async ({ store_id }) => {
        try {
          // 並列で店舗情報と関連データを取得
          const [storeResult, castsResult, operatorsResult, adminsResult] = await Promise.all([
            supabase.from('stores').select('*').eq('id', store_id).single(),
            supabase.from('casts').select('id, username, email, role').eq('store_id', store_id),
            supabase.from('operators').select('id, username, email').eq('store_id', store_id),
            supabase.from('admins').select('id, username, email').eq('store_id', store_id),
          ]);

          if (storeResult.error) {
            return {
              content: [{ 
                type: 'text', 
                text: `❌ 店舗が見つかりません: ${storeResult.error.message}` 
              }],
            };
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
            admins.forEach(admin => {
              details += `   • ${admin.username || admin.email || 'Anonymous'}\n`;
            });
            details += '\n';
          }

          if (operators.length > 0) {
            details += `⚙️ **オペレーター一覧**\n`;
            operators.forEach(operator => {
              details += `   • ${operator.username || operator.email || 'Anonymous'}\n`;
            });
            details += '\n';
          }

          if (casts.length > 0) {
            details += `👤 **キャスト一覧** (最新5名)\n`;
            casts.slice(0, 5).forEach(cast => {
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
            }],
          };
        } catch (err) {
          return {
            content: [{ 
              type: 'text', 
              text: `❌ 予期しないエラー: ${err instanceof Error ? err.message : 'Unknown error'}` 
            }],
          };
        }
      },
    );
  },
  {},
  { basePath: '/api' },
);

export default handler; 