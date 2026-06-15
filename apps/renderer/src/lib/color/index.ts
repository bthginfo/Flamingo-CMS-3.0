/**
 * COLOR SYSTEM — Barrel export
 *
 * Single entry point for the unified color architecture.
 * All consumers import from '@/lib/color' (or '../lib/color').
 */

// Registry & types
export { COLOR_TOKENS, ALL_SLOTS, CSS_VAR_TO_SLOT } from './registry';
export type { ColorTokenDef, ColorSlot, Appearance, BrandPalette } from './registry';

// Resolver
export { resolveAppearance, appearanceToCssVars } from './resolve-appearance';

// Migration
export { migrateOverrides } from './migrate-overrides';

// Contracts
export { SECTION_CONTRACTS, DEFAULT_CONTRACT, getSectionContract } from './contracts';

// Validation (dev/build only — tree-shaken in production)
export { validateRegistry, validateContract, validateOverrides } from './validate';

// Brand bridge
export { extractBrandPalette } from './brand-bridge';
