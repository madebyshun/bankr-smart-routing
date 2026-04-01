// src/router.ts
import { classifyQuery } from './classifier';

export type ModelTier = 'light' | 'mid' | 'full' | 'code';

// ==================== MODEL CONFIG ====================
export const MODELS_LIGHT = ['gemini-3.1-flash-lite'];
export const MODELS_MID   = ['gemini-3-flash'];
export const MODELS_FULL  = ['claude-sonnet-4.6'];
export const MODELS_CODE  = ['claude-sonnet-4.6', 'qwen3-coder'];

export const ALL_MODELS = {
  light: MODELS_LIGHT,
  mid:   MODELS_MID,
  full:  MODELS_FULL,
  code:  MODELS_CODE,
} as const;

/**
 * Get smart tier using LLM Classifier + fallback
 */
export async function getTier(text: string): Promise<ModelTier> {
  if (text.length < 40) {
    return 'light';
  }

  try {
    return await classifyQuery(text);
  } catch (error) {
    console.warn('[SmartRouting] Classifier failed, using fallback');
  }

  // Keyword fallback
  const lowered = text.toLowerCase();
  if (lowered.includes('solidity') || lowered.includes('contract') || lowered.includes('deploy') || 
      lowered.includes('function') || lowered.includes('debug') || lowered.includes('bug')) {
    return 'code';
  }
  if (lowered.includes('analyze') || lowered.includes('score') || lowered.includes('strategy') || 
      lowered.includes('compare') || lowered.includes('explain')) {
    return 'full';
  }
  if (lowered.includes('how') || lowered.includes('what') || lowered.includes('swap') || 
      lowered.includes('price') || lowered.includes('wallet')) {
    return 'mid';
  }

  return 'light';
}

/**
 * Select best models with fallback chain
 */
export async function selectModels(text: string): Promise<string[]> {
  const tier = await getTier(text);

  const primary = {
    light: MODELS_LIGHT[0],
    mid:   MODELS_MID[0],
    full:  MODELS_FULL[0],
    code:  MODELS_CODE[0],
  }[tier];

  const fallbacks = ALL_MODELS[tier].filter((m: string) => m !== primary);

  return [primary, ...fallbacks];
}