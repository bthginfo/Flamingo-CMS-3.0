export const SUPPORTED_I18N_LOCALES = ['de', 'en', 'fr', 'es', 'it', 'nl', 'pt', 'pl', 'tr', 'ru'] as const;
export const I18N_SWITCHER_STYLES = ['dropdown', 'flags', 'text'] as const;
export const I18N_SWITCHER_POSITIONS = ['nav-right', 'nav-left', 'footer'] as const;

type I18nSettingsInput = {
  locales: string[];
  defaultLocale: string;
  switcherStyle: string;
  switcherPosition: string;
};

export type ValidatedI18nSettings = {
  locales: string[];
  defaultLocale: string;
  switcherStyle: typeof I18N_SWITCHER_STYLES[number];
  switcherPosition: typeof I18N_SWITCHER_POSITIONS[number];
};

export function validateI18nSettings(input: I18nSettingsInput, maxLanguages: number):
  | { value: ValidatedI18nSettings; error?: never }
  | { value?: never; error: string } {
  const supported = new Set<string>(SUPPORTED_I18N_LOCALES);
  const locales = [...new Set(input.locales.map(locale => locale.trim().toLowerCase()).filter(Boolean))];
  const limit = Number.isInteger(maxLanguages) ? Math.max(1, maxLanguages) : 1;

  if (locales.length === 0) return { error: 'Mindestens eine Sprache muss aktiv bleiben.' };
  if (locales.length > limit) return { error: `Für dieses Paket sind höchstens ${limit} Sprachen freigeschaltet.` };
  if (locales.some(locale => !supported.has(locale))) return { error: 'Mindestens eine ausgewählte Sprache wird nicht unterstützt.' };

  const defaultLocale = input.defaultLocale.trim().toLowerCase();
  if (!locales.includes(defaultLocale)) return { error: 'Die Standardsprache muss zu den aktiven Sprachen gehören.' };
  if (!I18N_SWITCHER_STYLES.includes(input.switcherStyle as typeof I18N_SWITCHER_STYLES[number])) {
    return { error: 'Ungültige Darstellung des Sprachschalters.' };
  }
  if (!I18N_SWITCHER_POSITIONS.includes(input.switcherPosition as typeof I18N_SWITCHER_POSITIONS[number])) {
    return { error: 'Ungültige Position des Sprachschalters.' };
  }

  return {
    value: {
      locales,
      defaultLocale,
      switcherStyle: input.switcherStyle as ValidatedI18nSettings['switcherStyle'],
      switcherPosition: input.switcherPosition as ValidatedI18nSettings['switcherPosition'],
    },
  };
}
