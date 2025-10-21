import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { locales, type SupportedLanguage } from '@/locales';

type LanguageCode = SupportedLanguage;

type TranslationParams = Record<string, string | number>;

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'ai-hedge-fund.language';
const AVAILABLE_LANGUAGES = Object.keys(locales) as SupportedLanguage[];
const DEFAULT_LANGUAGE: LanguageCode = 'EN';
const FALLBACK_DICTIONARY = locales[DEFAULT_LANGUAGE];

function resolveLanguage(code: string | null | undefined): LanguageCode {
  if (!code) return DEFAULT_LANGUAGE;
  const upper = code.toUpperCase();
  return AVAILABLE_LANGUAGES.includes(upper as SupportedLanguage)
    ? (upper as LanguageCode)
    : DEFAULT_LANGUAGE;
}

function loadInitialLanguage(): LanguageCode {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return resolveLanguage(stored);
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token) => {
    const value = params[token];
    return value !== undefined ? String(value) : '';
  });
}

function createTranslator(language: LanguageCode) {
  const dictionary = locales[language] ?? FALLBACK_DICTIONARY;

  return (key: string, params?: TranslationParams) => {
    const value = dictionary[key] ?? FALLBACK_DICTIONARY[key];
    if (!value) {
      return key;
    }
    return interpolate(value, params);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => loadInitialLanguage());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguage = (next: LanguageCode) => {
    const resolved = resolveLanguage(next);
    setLanguageState(resolved);
  };

  const translator = useMemo(() => createTranslator(language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translator,
    }),
    [language, translator],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const SUPPORTED_LANGUAGES = AVAILABLE_LANGUAGES;

export function useTranslation() {
  const { t, language, setLanguage } = useLanguage();
  return { t, language, setLanguage };
}
