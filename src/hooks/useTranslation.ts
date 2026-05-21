import { useLocalization } from '../context/LanguageContext';

export const useTranslation = () => {
    return useLocalization();
};
