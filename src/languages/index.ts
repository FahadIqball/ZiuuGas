import { storage } from '../utils/storage';
import en from './en.json';
import es from './es.json';
import pt from './pt.json';

export type TxKeyPath = keyof typeof en;

const translations: Record<string, any> = {
  en,
  es,
  pt,
};

export const t = (key: TxKeyPath): string => {
  const currentLang = storage.getString('APP_LANGUAGE') || 'en';
  return translations[currentLang]?.[key] || translations['en']?.[key] || key;
};
