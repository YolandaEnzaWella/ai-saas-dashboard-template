import { en, type Dictionary } from "./en";

export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en };

/**
 * Returns the dictionary for a locale. Swap this for an async loader
 * (or next-intl / react-i18next) when adding real translations.
 */
export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export const t = getDictionary(defaultLocale);
export type { Dictionary };
