import en from './en.json';
import zh from './zh.json';
import ja from './ja.json';
import ko from './ko.json';
import ar from './ar.json';
import fr from './fr.json';
import de from './de.json';

export const locales = {
  EN: en,
  CN: zh,
  JA: ja,
  KO: ko,
  AR: ar,
  FR: fr,
  DE: de,
} as const;

export type SupportedLanguage = keyof typeof locales;
