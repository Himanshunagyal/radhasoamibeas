import type { APIRoute } from 'astro';

const topics = [
  'simran and remembrance of God',
  'the soul returning home to God',
  'love for the Master',
  'meditation and inner journey',
  'seva and selfless service',
  'the mind and how to tame it',
  'death and the soul transitioning',
  'the Shabd and inner Sound Current',
  'living an ethical and pure life',
  'detachment from the world',
  'the grace of the Satguru',
  'karma and its role in spiritual life',
];

const authors = [
  'Maharaj Sawan Singh Ji',
  'Maharaj Charan Singh Ji',
  'Maharaj Jagat Singh Ji',
  'Baba Gurinder Singh Ji',
  'Soami Ji Maharaj',
];

export const GET: APIRoute = async () => {
  const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;

  const topic = topics[Math.floor(Math.random() * topics.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];

  const prompt = `Generate ONE spiritual quote in the style and philosophy of Radha Soami Satsang Beas (RSSB) Sant Mat teachings.

Topic: ${topic}
Attributed to: ${author}

Rules:
- 1-3 sentences maximum
- Calm, loving, profound tone
- Use simple everyday language — no complex jargon
- Must feel authentic to Sant Mat philosophy
- Do NOT use quotes around the text
- Return ONLY the quote text, nothing else, no explanation, no attribution`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120,
        temperature: 0.85,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';

    return new Response(JSON.stringify({ quote: text, author, topic }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to generate' }), { status: 500 });
  }
};