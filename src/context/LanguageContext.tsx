import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { storage } from '../utils/storage';
import en from '../languages/en.json';
import es from '../languages/es.json';
import pt from '../languages/pt.json';

export type LocaleType = 'en' | 'es' | 'pt';
export type TxKeyPath = keyof typeof en;

const translations: Record<LocaleType, any> = {
    en,
    es,
    pt,
};

interface LanguageContextType {
    locale: LocaleType;
    changeLanguage: (lang: LocaleType) => void;
    t: (key: TxKeyPath) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<LocaleType>(
        (storage.getString('APP_LANGUAGE') as LocaleType) || 'en'
    );

    const changeLanguage = (lang: LocaleType) => {
        storage.set('APP_LANGUAGE', lang);
        setLocale(lang);
    };

    const t = (key: TxKeyPath): string => {
        return translations[locale]?.[key] || translations['en']?.[key] || key;
    };

    const value = useMemo(() => ({
        locale,
        changeLanguage,
        t,
    }), [locale]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LanguageProvider');
    }
    return context;
};
