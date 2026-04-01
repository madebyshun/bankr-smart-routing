// src/router.ts
import { classifyQuery } from './classifier';

export type ModelTier = 'light' | 'mid' | 'full' | 'code';

// ==================== MODEL CONFIG ====================
export const MODELS_LIGHT = ['gemini-3.1-flash-lite'];
export const MODELS_MID   = ['gemini-3-flash'];
export const MODELS_FULL  = ['claude-sonnet-4.6'];
export const MODELS_CODE  = ['claude-sonnet-4.6', 'qwen3-coder']; // Claude ưu tiên đầu

export const ALL_MODELS = {
  light: MODELS_LIGHT,
  mid:   MODELS_MID,
  full:  MODELS_FULL,
  code:  MODELS_CODE,
} as const;

const GREETINGS = ['gm', 'gn', 'hello', 'hi', 'hey', 'thanks', 'thank you', 'ok', 'okay'];

/**
 * Get smart tier - Final optimized version
 */
export async function getTier(text: string): Promise<ModelTier> {
  const trimmed = text.trim().toLowerCase();

  // 1. Greetings → always light
  if (GREETINGS.some(g => trimmed === g || trimmed.startsWith(g + ' '))) {
    return 'light';
  }

  // 2. Very short messages → light
  if (trimmed.length < 35) {
    return 'light';
  }

  // 3. Primary: LLM Classifier
  try {
    return await classifyQuery(text);
  } catch (error) {
    console.warn('[SmartRouting] Classifier failed, using fallback');
  }

  // 4. Keyword Fallback
  if (/solidity|contract|deploy|function|debug|bug|smart contract|write code|fix code/i.test(trimmed)) {
    return 'code';
  }

  if (/analyze|analysis|strategy|compare|explain|detailed|evaluate|score|phân tích|builder score/i.test(trimmed)) {
    return 'full';
  }

  if (/how|what|swap|price|wallet|claim|reward|referral|how to/i.test(trimmed)) {
    return 'mid';
  }

  return 'light';
}

/**
 * Select best models - Claude Sonnet 4.6 ưu tiên cho full & code
 */
export async function selectModels(text: string): Promise<string[]> {
  const tier = await getTier(text);

  const primary = {
    light: MODELS_LIGHT[0],
    mid:   MODELS_MID[0],
    full:  MODELS_FULL[0],
    code:  MODELS_CODE[0],     // Claude Sonnet 4.6 luôn ưu tiên
  }[tier];

  const fallbacks = ALL_MODELS[tier].filter((m: string) => m !== primary);

  return [primary, ...fallbacks];
}