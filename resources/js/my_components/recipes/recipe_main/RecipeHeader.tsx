import { useTranslate } from '@/hooks/useTranslate';
import React from 'react';

interface RecipeHeaderProps {
    activeTab: string;
}

export default function RecipeHeader({ activeTab }: RecipeHeaderProps) {
    const { t, locale } = useTranslate();
    const tabContent = {
        all: {
            title: t('recipes.tabs.all.title'),
            desc: t('recipes.tabs.all.desc')
        },
        favorites: {
            title: t('recipes.tabs.favorites.title'),
            desc: t('recipes.tabs.favorites.desc')
        },
        history: {
            title: t('recipes.tabs.history.title'),
            desc: t('recipes.tabs.history.desc')
        }
    };
    const currentHeader = tabContent[activeTab as keyof typeof tabContent] || tabContent.all;


    return (
        <div className="mb-8">
            <h1 className="text-3xl font-medium tracking-tight text-gray-950 dark:text-white transition-all duration-200">
                {currentHeader.title}
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-200">
                {currentHeader.desc}
            </p>
        </div>
    );
}