import en from './en.json';

const translations: { [key: string]: any } = {
  en,
};

export const t = (key: keyof typeof en): string => {
  return translations.en[key] || key;
};
