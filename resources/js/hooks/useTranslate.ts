import { usePage } from '@inertiajs/react';
import en from '../locales/en.json';
import lv from '../locales/lv.json';
import ru from '../locales/ru.json';

const translations: Record<string, any> = { en, lv, ru };

export function useTranslate() {
    const { props } = usePage();
    
    // Достаем текущий язык пользователя из shared props Inertia
    const locale = (props.locale as string) || 'en';

    // Функция перевода. Поддерживает вложенные ключи вроде 'recipes.title'
    const t = (key: string): string => {
        const keys = key.split('.');
        let result = translations[locale];

        for (const k of keys) {
            if (result && result[k] !== undefined) {
                result = result[k];
            } else {
                // Если перевод не найден, возвращаем сам ключ как фоллбек
                return key; 
            }
        }

        return result;
    };

    return { t, locale };
}