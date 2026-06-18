import { usePage } from '@inertiajs/react';
import en from '../locales/en.json';
import lv from '../locales/lv.json';
import ru from '../locales/ru.json';

const translations: Record<string, any> = { en, lv, ru };

export function useTranslate() {
    const { props } = usePage();
    
    // Izgūstam pašreizējo lietotāja valodu no Inertia koplietotajiem datiem (shared props)
    // Достаем текущий язык пользователя из shared props Inertia
    const locale = (props.locale as string) || 'en';

    // Tulkošanas funkcija. Atbalsta ligzdotas atslēgas, piemēram, 'recipes.title'
    // Функция перевода. Поддерживает вложенные ключи вроде 'recipes.title'
    const t = (key: string): string => {
        const keys = key.split('.');
        let result = translations[locale];

        for (const k of keys) {
            if (result && result[k] !== undefined) {
                result = result[k];
            } else {
                // Ja tulkojums nav atrasts, atgriežam pašu atslēgu kā rezerves variantu
                // Если перевод не найден, возвращаем сам ключ
                return key; 
            }
        }

        return result;
    };

    return { t, locale };
}