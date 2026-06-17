import React from 'react';

interface RecipeHeaderProps {
    activeTab: string;
}

const tabContent = {
    all: {
        title: 'Pieejamās receptes',
        desc: 'Droša pārtika, kas atlasīta, balstoties uz Jūsu veselības profilu.'
    },
    favorites: {
        title: 'Jūsu izlases receptes',
        desc: 'Šeit ir apkopoti Jūsu saglabātie un iecienītākie ēdieni ātrai piekļuvei.'
    },
    history: {
        title: 'Skatīšanās vēsture',
        desc: 'Nesen aplūkotās receptes, lai Jūs viegli varētu tās atrast vēlreiz.'
    }
};

export default function RecipeHeader({ activeTab }: RecipeHeaderProps) {
    const currentHeader = tabContent[activeTab as keyof typeof tabContent] || tabContent.all;

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white transition-all duration-200">
                {currentHeader.title}
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-200">
                {currentHeader.desc}
            </p>
        </div>
    );
}