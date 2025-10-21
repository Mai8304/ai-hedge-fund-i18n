import { locales, type SupportedLanguage } from '@/locales';

type TranslationRecord = Record<string, string | TranslationRecord>;

function resolveKey(dictionary: TranslationRecord, key: string): string | null {
  if (!dictionary) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
    const directValue = dictionary[key];
    if (typeof directValue === 'string') {
      return directValue;
    }
  }

  const segments = key.split('.');
  let current: any = dictionary;

  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? current : null;
}

export const translate = (key: string, language: SupportedLanguage, fallback?: string): string => {
  const primary = resolveKey(locales[language] as TranslationRecord, key);
  if (primary !== null) {
    return primary;
  }

  const fallbackValue = resolveKey(locales.EN as TranslationRecord, key);
  if (fallbackValue !== null) {
    return fallbackValue;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  return key;
};
