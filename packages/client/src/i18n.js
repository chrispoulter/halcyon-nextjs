import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setLocale } from 'yup';

import enGB from './locales/en-GB.json';
import zhCN from './locales/zh-CN.json';

const resources = {
    'en-GB': enGB,
    'zh-CN': zhCN
};

const initializeValidation = () => {
    setLocale({
        mixed: {
            required: i18n.t('validation:required'),
            oneOf: i18n.t('validation:oneOf')
        },
        string: {
            email: i18n.t('validation:email'),
            min: i18n.t('validation:min'),
            max: i18n.t('validation:max')
        }
    });
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init(
        {
            resources,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false
            }
        },
        initializeValidation
    );

i18n.on('languageChanged', initializeValidation);
