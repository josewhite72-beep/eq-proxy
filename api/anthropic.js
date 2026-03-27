export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const deepseekRes = await fetch('https://api.deepseek.com/beta/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 8192,
        temperature: 0.7,
        stream: true,
        response_format: { type: 'json_object' },
        messages: req.body.messages,
      }),
    });

    if (!deepseekRes.ok) {
      const errorText = await deepseekRes.text();
      return res.status(502).json({ error: 'DeepSeek error', details: errorText });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const reader = deepseekRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
      if (res.flush) res.flush();
    }
    res.end();

  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
