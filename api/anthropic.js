export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: req.body.max_tokens || 2500,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();

    // Normalize DeepSeek response to Anthropic-like format
    const normalized = {
      content: [{ type: 'text', text: data.choices?.[0]?.message?.content || '' }]
    };

    return res.status(response.status).json(normalized);

  } catch (error) {
    return res.status(502).json({ error: 'Upstream error', message: error.message });
  }
}
