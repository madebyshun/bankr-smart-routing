---
name: bankr-smart-routing
description: Smart model routing for Bankr LLM Gateway. Auto-selects the best model based on query complexity — code, analysis, crypto/Base ecosystem, or casual chat. Use when building bots or apps with Bankr LLM to optimize cost and quality.
---

# bankr-smart-routing

Auto-select the best Bankr LLM model based on query complexity.

## 4 Tiers

| Tier | Best for | Models |
|------|----------|--------|
| `light` | Casual chat, simple questions | gemini-3.1-flash-lite, gpt-5-nano |
| `mid` | Crypto, Base ecosystem, DeFi | gemini-3-flash, claude-haiku-4.5 |
| `full` | Deep analysis, research, scoring | claude-sonnet-4.6, gemini-3-pro |
| `code` | Code, contracts, technical tasks | qwen3-coder, gpt-5.2-codex |

## Usage

```typescript
import { selectModels, getTier } from 'bankr-smart-routing'

const text = "Analyze this Base builder's onchain activity"
const models = selectModels(text) // → MODELS_FULL
const tier = getTier(text)        // → 'full'

// Use with Bankr LLM API
for (const model of models) {
  try {
    const res = await fetch('https://llm.bankr.bot/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.BANKR_API_KEY,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: text }]
      })
    })
    if (res.ok) {
      const data = await res.json()
      const reply = data?.content?.[0]?.text
      if (reply) {
        console.log(`[LLM] Responded with: ${model}`)
        return reply
      }
    }
  } catch {
    continue // try next model
  }
}
```

## Install

```bash
# As OpenClaw skill
openclaw skills install bankr-smart-routing

# As npm package
npm install bankr-smart-routing
```

## Built by

[Blue Agent](https://t.me/blockyagent_bot) / [Blocky Studio](https://x.com/blockyonbase)

$BLUEAGENT | Base
