# bankr-smart-routing 🟦

> Smart model routing for [Bankr LLM Gateway](https://bankr.bot) — auto-select the right model based on query complexity.

Built by [Blue Agent](https://t.me/blockyagent_bot) / [Blocky Studio](https://x.com/blockyonbase)

---

## Why?

Bankr LLM Gateway has 27 models. Using the same model for everything is:
- **Expensive** — claude-sonnet for "gm" is overkill
- **Slow** — heavy models for simple queries waste time
- **Suboptimal** — light models for deep analysis miss quality

`bankr-smart-routing` picks the right model automatically.

---

## 4 Tiers

| Tier | Query type | Primary model |
|------|-----------|---------------|
| `light` | Casual chat, greetings | `gemini-3.1-flash-lite` |
| `mid` | Crypto, Base, DeFi, NFTs | `gemini-3-flash` |
| `full` | Analysis, research, scoring | `claude-sonnet-4.6` |
| `code` | Code, contracts, debugging | `qwen3-coder` |

Each tier has multiple fallback models — if the primary fails, the next one kicks in automatically.

---

## Install

```bash
npm install bankr-smart-routing
```

Or as OpenClaw skill:
```bash
openclaw skills install bankr-smart-routing
```

---

## Usage

```typescript
import { selectModels, getTier, MODELS_FULL } from 'bankr-smart-routing'

// Auto-select models for a query
const models = selectModels("Analyze this Base builder")
// → ['claude-sonnet-4.6', 'claude-sonnet-4.5', 'gemini-3-pro', ...]

// Get tier name
const tier = getTier("deploy a token on Base")
// → 'code'

// Use in your LLM loop
async function askLLM(text: string): Promise<string> {
  const modelsToTry = selectModels(text)
  
  for (const model of modelsToTry) {
    try {
      const res = await fetch('https://llm.bankr.bot/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.BANKR_API_KEY!,
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
        const reply = data?.content?.[0]?.text?.trim()
        if (reply) {
          console.log(`[LLM] Model: ${model}`)
          return reply
        }
      }
    } catch {
      continue // fallback to next model
    }
  }
  
  throw new Error('All models failed')
}
```

---

## API

### `selectModels(text: string): string[]`
Returns ordered array of models to try for a given query.

### `getTier(text: string): ModelTier`
Returns the tier name: `'light' | 'mid' | 'full' | 'code'`

### `MODELS_LIGHT / MODELS_MID / MODELS_FULL / MODELS_CODE`
Model arrays for each tier (exported for custom use).

### `ALL_MODELS`
Object containing all tier arrays.

---

## Pattern matching

Priority order (first match wins):

```
code tier:      code, deploy, contract, solidity, typescript, javascript,
                python, function, bug, error, implement, build, script,
                debug, compile, syntax

full tier:      score, analyze, explain, compare, research, what is,
                how does, tell me about, deep, detail, strategy,
                evaluate, assess, summarize, review

mid tier:       how, what, where, when, why, can i, help, support,
                claim, reward, earn, point, quest, refer, submit,
                wallet, token, price, buy, sell, gm, gn, hello, hi,
                hey, thx, thanks, builder, base, defi, nft, agent,
                protocol, project, ecosystem, trend, market, crypto,
                blockchain, swap, transaction

light tier:     text.length < 60 OR everything else
```

---

## Used by

- [Blue Agent Bot](https://t.me/blockyagent_bot) — AI assistant for Base builders
- [Blue Agent Beta](https://t.me/Blockyagent_beta_bot) — v2.0 with full features

---

## Links

- Token: [$BLUEAGENT](https://dexscreener.com/base/0xf895783b2931c919955e18b5e3343e7c7c456ba3) on Base
- Twitter: [@blocky_agent](https://x.com/blocky_agent)
- Studio: [@blockyonbase](https://x.com/blockyonbase)
- Bankr: [bankr.bot](https://bankr.bot)

---

MIT License
