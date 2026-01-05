import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.SUPABASE_URL || 
                      'https://sbgisgcszuorovxrbexj.supabase.co';

  // Try Service Key first, then Anon Key
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                             process.env.VITE_SUPABASE_ANON_KEY || 
                             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({
      error: 'Configuration Error: Missing Supabase Credentials',
      details: { url: !!supabaseUrl, key: !!supabaseServiceKey }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });

  // --- GET Handler (Debug) ---
  if (req.method === 'GET') {
    try {
      const { data, error, count } = await supabase
        .from('p2p_opportunities')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;

      return res.status(200).json({
        status: 'online',
        record_count: count,
        latest_records: data,
        env_check: {
          using_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          project_url: supabaseUrl
        }
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
  }

  // --- POST Handler ---
  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // 1. Top 10 Payload (P2P Opportunities)
      if (data.top_10_melhores_maker_opportunities && Array.isArray(data.top_10_melhores_maker_opportunities)) {
        
        // Check if array is empty BEFORE processing
        if (data.top_10_melhores_maker_opportunities.length === 0) {
          console.warn('Payload array (P2P) is empty');
        } else {
          
          const parseNumber = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
              const cleanVal = val.replace(',', '.');
              const num = parseFloat(cleanVal);
              return isNaN(num) ? 0 : num;
            }
            return 0;
          };

          // MAP DATA
          const p2pData = data.top_10_melhores_maker_opportunities.map((item: any) => {
            return {
              tipo: item.tipo,
              exchange_entrada: item.exchange_entrada || item.exchange,
              exchange_saida: item.exchange_saida || item.exchange,
              preco_entrada: parseNumber(item.preco_entrada),
              preco_saida: parseNumber(item.preco_saida),
              diferenca_pct: parseNumber(item.diferenca_pct),
              comerciante_entrada: item.comerciante_entrada || 'Desconhecido',
              comerciante_saida: item.comerciante_saida || 'Desconhecido',
              timestamp: item.timestamp || new Date().toISOString()
            };
          });

          // DELETE OLD DATA (Only if we have new data)
          const { error: deleteError } = await supabase
            .from('p2p_opportunities')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
          
          if (deleteError) {
            console.error('P2P Delete Error:', deleteError);
          }

          // INSERT NEW DATA
          const { error: insertError } = await supabase
            .from('p2p_opportunities')
            .insert(p2pData);

          if (insertError) {
            console.error('P2P Insert Error:', insertError);
            throw insertError;
          }
        }
      }

      // 2. Active Trades Payload
      if (data.active_trades && Array.isArray(data.active_trades)) {
        if (data.active_trades.length > 0) {
           // DELETE OLD ACTIVE TRADES
           const { error: deleteError } = await supabase
             .from('active_trades')
             .delete()
             .neq('id', '00000000-0000-0000-0000-000000000000');

           if (deleteError) {
             console.error('Active Trades Delete Error:', deleteError);
           }

           // INSERT NEW ACTIVE TRADES
           const { error: insertError } = await supabase
             .from('active_trades')
             .insert(data.active_trades);

           if (insertError) {
             console.error('Active Trades Insert Error:', insertError);
             throw insertError;
           }
        }
      }

      // 3. Trade History Payload
      if (data.trade_history && Array.isArray(data.trade_history)) {
        if (data.trade_history.length > 0) {
           // UPSERT TRADE HISTORY (Insert or Update based on ID)
           const { error: upsertError } = await supabase
             .from('trade_history')
             .upsert(data.trade_history, { onConflict: 'id' });

           if (upsertError) {
             console.error('Trade History Upsert Error:', upsertError);
             throw upsertError;
           }
        }
      }

      // 4. Single Signal Payload (Event-based)
      if (data.type && data.symbol && (data.type === 'ENTRY' || data.type === 'EXIT')) {
        
        // Handle ENTRY
        if (data.type === 'ENTRY') {
           const newTrade = {
             symbol: data.symbol,
             side: data.side, // 'LONG' | 'SHORT'
             setup: data.setup,
             score: data.score,
             strength: data.strength,
             entry_price: data.entry_price,
             current_price: data.entry_price, // Initial price
             pnl: 0,
             entry_time: data.time || new Date().toISOString(),
             updated_at: new Date().toISOString()
             // Note: volatility and volume_ratio are ignored as they are not in the table schema
           };
           
           // Insert into active_trades
           const { error } = await supabase.from('active_trades').insert(newTrade);
           
           if (error) {
             console.error('Signal Entry Error:', error);
             throw error;
           }
           
           return res.status(200).json({ 
             success: true, 
             message: 'Signal Entry Processed', 
             trade: newTrade 
           });
        }
        
        // Handle EXIT
        if (data.type === 'EXIT') {
            // 1. Find the active trade for this symbol
            const { data: activeTrade, error: fetchError } = await supabase
              .from('active_trades')
              .select('*')
              .eq('symbol', data.symbol)
              .order('entry_time', { ascending: false })
              .limit(1)
              .single();

            if (fetchError || !activeTrade) {
              console.warn(`Active trade not found for exit: ${data.symbol}`);
              return res.status(404).json({ 
                error: 'Active trade not found for symbol', 
                symbol: data.symbol 
              });
            }

            // 2. Create history entry
            const historyEntry = {
              symbol: activeTrade.symbol,
              side: activeTrade.side,
              setup: activeTrade.setup,
              score: activeTrade.score,
              entry_price: activeTrade.entry_price,
              exit_price: data.exit_price || data.price || activeTrade.current_price, // Fallback
              pnl: data.pnl !== undefined ? data.pnl : 0,
              result: (data.pnl !== undefined && data.pnl > 0) ? 'WIN' : 'LOSS',
              entry_time: activeTrade.entry_time,
              exit_time: data.time || new Date().toISOString()
            };

            // 3. Insert into history
            const { error: histError } = await supabase
              .from('trade_history')
              .insert(historyEntry);

            if (histError) {
               console.error('History Insert Error:', histError);
               throw histError;
            }

            // 4. Delete from active_trades
            const { error: delError } = await supabase
              .from('active_trades')
              .delete()
              .eq('id', activeTrade.id);

            if (delError) {
              console.error('Active Delete Error (Cleanup):', delError);
              // Not critical if history was inserted
            }

            return res.status(200).json({ 
              success: true, 
              message: 'Trade closed and moved to history',
              history: historyEntry
            });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Data processed successfully',
        received_p2p: data.top_10_melhores_maker_opportunities?.length || 0,
        received_active: data.active_trades?.length || 0,
        received_history: data.trade_history?.length || 0
      });

    } catch (error: any) {
      console.error('Webhook Error:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  return res.status(405).send('Method not allowed');
}
