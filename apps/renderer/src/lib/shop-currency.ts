export const SHOP_CURRENCIES = [
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'CHF', label: 'Schweizer Franken', symbol: 'CHF' },
  { code: 'GBP', label: 'Britisches Pfund', symbol: '£' },
  { code: 'USD', label: 'US-Dollar', symbol: '$' },
  { code: 'PLN', label: 'Polnischer Złoty', symbol: 'zł' },
  { code: 'CZK', label: 'Tschechische Krone', symbol: 'Kč' },
  { code: 'DKK', label: 'Dänische Krone', symbol: 'kr.' },
  { code: 'NOK', label: 'Norwegische Krone', symbol: 'kr' },
  { code: 'SEK', label: 'Schwedische Krone', symbol: 'kr' },
  { code: 'HUF', label: 'Ungarischer Forint', symbol: 'Ft' },
  { code: 'RON', label: 'Rumänischer Leu', symbol: 'lei' },
  { code: 'BGN', label: 'Bulgarischer Lew', symbol: 'лв.' },
  { code: 'TRY', label: 'Türkische Lira', symbol: '₺' },
  { code: 'CAD', label: 'Kanadischer Dollar', symbol: 'CA$' },
  { code: 'AUD', label: 'Australischer Dollar', symbol: 'AU$' },
  { code: 'NZD', label: 'Neuseeland-Dollar', symbol: 'NZ$' },
  { code: 'JPY', label: 'Japanischer Yen', symbol: '¥' },
  { code: 'CNY', label: 'Chinesischer Renminbi', symbol: 'CN¥' },
  { code: 'AED', label: 'VAE-Dirham', symbol: 'AED' },
] as const;

const SUPPORTED_CODES = new Set<string>(SHOP_CURRENCIES.map(currency => currency.code));

export function normalizeShopCurrency(value: unknown): string {
  const normalized = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return SUPPORTED_CODES.has(normalized) ? normalized : 'EUR';
}

export function getShopCurrencySymbol(code: string): string {
  return SHOP_CURRENCIES.find(currency => currency.code === normalizeShopCurrency(code))?.symbol || '€';
}

export function formatShopMoney(cents: number, currency: unknown, locale = 'de-DE'): string {
  const safeCurrency = normalizeShopCurrency(currency);
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: safeCurrency }).format(cents / 100);
  } catch {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }
}
