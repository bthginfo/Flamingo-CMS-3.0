/**
 * Shared, contrast-safe token themes for demo tenants.
 *
 * darkTokens(palette) returns the COMPLETE set of --token-* overrides for a
 * section that sits on a DARK background. It overrides every text / icon /
 * accent / card slot to a light-on-dark value, so it is impossible to forget
 * one and end up with dark-on-dark (the bug that hit the services cards).
 *
 * Usage in a tenant script:
 *   const { darkTokens } = require('./_lib/theme.cjs');
 *   const darkSectionTokens = darkTokens({ accent: '#E2B58D', btnBg: C.cream, btnText: C.brand });
 *   ...
 *   { type: 'stats', data: {...}, styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens } }
 */
function darkTokens(opts = {}) {
  const accent = opts.accent || 'rgba(255,255,255,0.92)';   // icons, eyebrows, stars, links on dark
  const btnBg = opts.btnBg || '#FFFFFF';
  const btnText = opts.btnText || '#101820';
  const cardBg = opts.cardBg || 'rgba(255,255,255,0.06)';   // glassy card on the dark surface
  const cardBorder = opts.cardBorder || 'rgba(255,255,255,0.16)';
  return {
    // Body text
    '--token-heading':         '#FFFFFF',
    '--token-subheading':      'rgba(255,255,255,0.92)',
    '--token-body':            'rgba(255,255,255,0.90)',
    '--token-muted':           'rgba(255,255,255,0.66)',
    '--token-on-dark-heading': '#FFFFFF',
    '--token-on-dark-body':    'rgba(255,255,255,0.90)',
    '--token-on-dark-muted':   'rgba(255,255,255,0.66)',
    // Icons / accents — the slots that were left on the dark brand default
    '--token-eyebrow':         accent,
    '--token-icon':            accent,
    '--token-accent':          accent,
    '--token-stat-value':      '#FFFFFF',
    '--token-rating-star':     accent,
    '--token-quote':           accent,
    '--token-check':           accent,
    '--token-link':            accent,
    '--token-link-hover':      '#FFFFFF',
    '--token-divider':         'rgba(255,255,255,0.16)',
    // Cards sitting on the dark section
    '--token-card-bg':         cardBg,
    '--token-card-border':     cardBorder,
    '--token-card-heading':    '#FFFFFF',
    '--token-card-body':       'rgba(255,255,255,0.90)',
    '--token-card-muted':      'rgba(255,255,255,0.66)',
    '--token-card-icon':       accent,
    '--token-card-badge-bg':   'rgba(255,255,255,0.14)',
    '--token-card-badge-text': '#FFFFFF',
    // Price / form (so dark booking/price sections stay readable)
    '--token-price':           '#FFFFFF',
    '--token-label':           'rgba(255,255,255,0.78)',
    '--token-input-bg':        'rgba(255,255,255,0.06)',
    '--token-input-border':    'rgba(255,255,255,0.22)',
    '--token-input-text':      '#FFFFFF',
    // Buttons
    '--token-btn-bg':              btnBg,
    '--token-btn-text':            btnText,
    '--token-btn-secondary-bg':     'transparent',
    '--token-btn-secondary-text':   '#FFFFFF',
    '--token-btn-secondary-border': 'rgba(255,255,255,0.30)',
    // Badges
    '--token-badge-bg':        'rgba(255,255,255,0.14)',
    '--token-badge-text':      '#FFFFFF',
    '--token-badge-border':    'rgba(255,255,255,0.28)',
  };
}

module.exports = { darkTokens };
