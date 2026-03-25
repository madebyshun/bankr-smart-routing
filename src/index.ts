/**
 * bankr-smart-routing
 * Auto-select the best Bankr LLM model based on query complexity
 * Built by Blue Agent / Blocky Studio
 */

// ================================
// MODEL TIERS
// ================================

/** Fast, cheap models for casual/simple queries */
export const MODELS_LIGHT = [
  'gemini-3.1-flash-lite', // Google ultra-fast ⭐
  'gpt-5-nano',            // GPT fastest
  'gpt-5.4-nano',          // GPT nano latest
  'qwen3.5-flash',         // Fast, good for Asian content
  'gpt-5.4-mini',          // Mini latest
  'gpt-5-mini',            // Mini stable
]

/** Balanced models for crypto/ecosystem queries */
export const MODELS_MID = [
  'gemini-3-flash',        // Google balanced ⭐
  'claude-haiku-4.5',      // Anthropic fast + smart
  'grok-4.1-fast',         // xAI fast
  'minimax-m2.7',          // Strong Chinese model
  'gemini-2.5-flash',      // Google stable
  'kimi-k2.5',             // Moonshot balanced
  'gpt-5.4',               // GPT standard
]

/** Powerful models for deep analysis */
export const MODELS_FULL = [
  'claude-sonnet-4.6',     // Best overall ⭐
  'claude-sonnet-4.5',     // Sonnet stable
  'gemini-3-pro',          // Google best
  'gemini-3.1-pro',        // Google newest pro
  'deepseek-v3.2',         // Powerhouse
  'gpt-5.2',               // GPT powerful
  'gemini-2.5-pro',        // Google pro stable
  'qwen3.5-plus',          // Qwen best
  'claude-haiku-4.5',      // Fallback
  'gpt-5.4',               // Final fallback
]

/** Specialized models for coding/technical queries */
export const MODELS_CODE = [
  'qwen3-coder',           // Code specialist ⭐
  'gpt-5.2-codex',         // Codex
  'claude-sonnet-4.6',     // Claude great at code
  'deepseek-v3.2',         // Strong coder
  'gpt-5.2',               // GPT code
]

// ================================
// QUERY PATTERNS
// ================================

const CODE_PATTERNS = /code|deploy|contract|solidity|typescript|javascript|python|function|bug|error|implement|build|script|debug|compile|syntax/i
const FULL_PATTERNS = /score|analyze|explain|compare|research|what is|how does|tell me about|deep|detail|strategy|evaluate|assess|summarize|review/i
const MID_PATTERNS  = /builder|base|defi|nft|agent|protocol|project|ecosystem|trend|token|price|market|crypto|blockchain|swap|wallet|transaction/i

// ================================
// MAIN FUNCTION
// ================================

export type ModelTier = 'light' | 'mid' | 'full' | 'code'

/**
 * Select the best models for a given query
 * Returns an ordered array of models to try (with fallback)
 */
export function selectModels(text: string): string[] {
  if (CODE_PATTERNS.test(text)) return MODELS_CODE
  if (FULL_PATTERNS.test(text)) return MODELS_FULL
  if (MID_PATTERNS.test(text))  return MODELS_MID
  return MODELS_LIGHT
}

/**
 * Get the tier name for a query
 */
export function getTier(text: string): ModelTier {
  if (CODE_PATTERNS.test(text)) return 'code'
  if (FULL_PATTERNS.test(text)) return 'full'
  if (MID_PATTERNS.test(text))  return 'mid'
  return 'light'
}

/**
 * All available models across all tiers
 */
export const ALL_MODELS = {
  light: MODELS_LIGHT,
  mid:   MODELS_MID,
  full:  MODELS_FULL,
  code:  MODELS_CODE,
}
