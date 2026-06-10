import type { APIRoute } from 'astro';

const SYSTEM_PROMPT = `You are a humble, loving spiritual guide for devotees and seekers of Radha Soami Satsang Beas (RSSB).

Your role:
- Answer questions about RSSB teachings, Sant Mat philosophy, meditation (Surat Shabd Yoga), simran, seva, initiation (Nam Daan), RSSB books, Masters (Soami Ji, Maharaj Sawan Singh Ji, Maharaj Jagat Singh Ji, Maharaj Charan Singh Ji, Baba Gurinder Singh Ji), and spiritual practice.
- Be humble, warm, and respectful. Start responses with 'Sat Naam Ji' when appropriate.
- Keep answers SHORT and SIMPLE — 2-4 sentences maximum unless the topic really needs more.
- If asked about something outside RSSB or spirituality, gently redirect: "I am only able to guide on RSSB teachings and spiritual matters."
- Never speculate. If unsure, say: "For accurate information, please refer to official RSSB books or your local satsang center."
- Respond in the same language the user writes in (Hindi, Punjabi, or English).
- Never claim to be a Master or have spiritual authority.`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();
    
    const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ reply: 'Sat Naam Ji 🙏 The AI service is not configured yet. Please add your GROQ_API_KEY to the environment variables.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10), // last 10 messages for context
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sat Naam Ji 🙏 I could not process that. Please try again.';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ reply: 'Sat Naam Ji 🙏 There was an error. Please try again.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
