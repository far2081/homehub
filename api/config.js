export default function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    const payload = JSON.stringify({
      supabaseUrl: (process.env && process.env.SUPABASE_URL) ? process.env.SUPABASE_URL : '',
      supabaseAnonKey: (process.env && process.env.SUPABASE_ANON_KEY) ? process.env.SUPABASE_ANON_KEY : ''
    });

    if (typeof res.status === 'function') {
      return res.status(200).send ? res.status(200).send(payload) : res.status(200).json(JSON.parse(payload));
    }
    res.statusCode = 200;
    res.end(payload);
  } catch (_) {
    res.statusCode = 200;
    res.end(JSON.stringify({ supabaseUrl: '', supabaseAnonKey: '' }));
  }
}
