import { usePage } from '@inertiajs/react';
import en from '../locales/en.json';
import lv from '../locales/lv.json';
import ru from '../locales/ru.json';

const translations: Record<string, any> = { en, lv, ru };

export function useTranslate() {
    // Ieskatās līdzīgi kā Redux (state), lai paņemtu visu, kas tur ir
    const { props } = usePage(); // Заглдывает тип как в Редах(state) чтобы взять все что там есть
    
    // Izgūstam pašreizējo lietotāja valodu no Inertia koplietotajiem datiem (shared props)
    // Достаем текущий язык пользователя из shared props Inertia
    const locale = (props.locale as string) || 'en';

    // Tulkošanas funkcija. Atbalsta ligzdotas atslēgas, piemēram, 'recipes.title'
    // Функция перевода. Поддерживает вложенные ключи вроде 'recipes.title'

    // "key" ir parametrs, kuru mēs paši manuāli nodosim, izsaucot funkciju t('atslēga') komponentēs
    // "key" — это параметр, который мы сами вручную передаем при вызове функции t('ключ') в компонентах
    const t = (key: string): string => {  // <button>{t('auth.login_button')}</button>
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