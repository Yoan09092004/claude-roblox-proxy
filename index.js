const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_KEY;

app.post('/ask', async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not found!' });
    }
    const { message } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: message }]
      })
    });
    const data = await response.json();
    console.log('API response:', JSON.stringify(data));
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    res.json({ reply: data.content[0].text });
  } catch(e) {
    console.log('Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Running!'));
