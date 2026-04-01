// src/classifier.ts
const CLASSIFIER_SYSTEM_PROMPT = `
You are a smart routing classifier for Blue Agent Telegram bot on Base chain.

Classify the user query into exactly ONE tier. Reply with ONLY the tier name in lowercase.

Tiers:
- light: Casual chat, greetings (gm, gn, hi, hello), thanks, very short messages.
- mid:   General questions about Base, tokens, wallet, points, rewards, swap, price, simple project info, claim, referral.
- full:  Deep analysis, research, comparison, strategy, detailed explanation, builder score, evaluate project, complex reasoning.
- code:  Writing code, Solidity smart contracts, debugging, implementing functions, deploy scripts, fixing bugs, TypeScript/JavaScript.

Rules:
- Support both English and Vietnamese queries naturally.
- If query mentions contract address, solidity, "viết code", "fix bug", "deploy", "function" → prefer 'code'.
- Only return one word: light, mid, full or code. No explanation, no extra text.
`;

export async function classifyQuery(text: string): Promise<'light' | 'mid' | 'full' | 'code'> {
  const prompt = `${CLASSIFIER_SYSTEM_PROMPT}\n\nQuery: """${text}"""`;

  const response = await fetch('https://llm.bankr.bot/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.BANKR_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gemini-3.1-flash-lite',
      max_tokens: 10,
      temperature: 0.0,
      messages: [
        { role: 'system', content: CLASSIFIER_SYSTEM_PROMPT },
        { role: 'user', content: `Query: """${text}"""` }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Classifier HTTP error: ${response.status}`);
  }

  const data = await response.json();
  let result = (data?.content?.[0]?.text || data?.text || '').trim().toLowerCase();

  if (result.includes('code')) return 'code';
  if (result.includes('full')) return 'full';
  if (result.includes('mid')) return 'mid';
  return 'light';
}