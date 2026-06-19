import React from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';

interface Allergen {
    id: number;
    name_lv?: string;
    name?: string;
}

interface RecipeFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    maxCalories: number;
    setMaxCalories: (value: number) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    selectedGoal: string;
    setSelectedGoal: (value: string) => void;

    // Jaunie rekvizīti alergēniem / Новые пропсы для аллергенов
    availableAllergens: Allergen[];
    selectedAllergens: number[]; // Alergēnu ID masīvs, kurus nepieciešams izslēgt / Массив ID аллергенов, которые надо исключить
    setSelectedAllergens: (ids: number[]) => void;
}


export default function RecipeFilters({
    searchQuery,
    setSearchQuery,
    maxCalories,
    setMaxCalories,
    sortBy,
    setSortBy,
    selectedGoal,
    setSelectedGoal,
    availableAllergens = [],
    selectedAllergens = [],
    setSelectedAllergens
}: RecipeFiltersProps) {
    const locale = (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('lv')) ? 'lv' : 'en';

    return (
        <div className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                <SlidersHorizontal className="size-4 text-indigo-500" />
                <span>{locale === 'lv' ? 'Filtri' : 'Filters'}</span>
            </div>

            {/* Filtrs 1: Meklēšana pēc nosaukuma / Фильтр 1: Поиск по названию */}
            <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    {locale === 'lv' ? 'Meklēt recepti' : 'Search Recipes'}
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ievadiet nosaukumu..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition"
                    />
                    <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
                </div>
            </div>

            {/* Filtrs 2: Maksimālās kalorijas / Фильтр 2: Максимум калорий */}
            <div className="mb-4 transition-all duration-200">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        {locale === 'lv' ? 'Maks. Kalorijas' : 'Max Calories'}
                    </label>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded">
                        {maxCalories} kcal
                    </span>
                </div>
                <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={maxCalories}
                    onChange={(e) => setMaxCalories(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
            </div>


            {/* Filtrs 3: Kārtošana / Фильтр 3: Сортировка */}
            <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    {locale === 'lv' ? 'Kārtot pēc' : 'Sort by'}
                </label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
                >
                    <option value="name">Nosaukuma (A-Z)</option>
                    <option value="cal-asc">Kalorijām (Pieaugoši)</option>
                    <option value="cal-desc">Kalorijām (Dilstoši)</option>
                </select>
            </div>

            {/* Filtrs 4: Fitnesa mērķis (Tā pati izvēlne, kuru mēs pievienojām) / Фильтр 3: Фитнес-цель (Тот самый селект, который мы добавили) */}
            <div className="mb-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    {locale === 'lv' ? 'Mērķis' : 'Goal'}
                </label>
                <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                    <option value="all">{locale === 'lv' ? 'Visi mērķi' : 'All Goals'}</option>
                    <option value="gain">{locale === 'lv' ? 'Masas palielināšana' : 'Weight Gain'}</option>
                    <option value="maintenance">{locale === 'lv' ? 'Svara saglabāšana' : 'Weight Maintenance'}</option>
                    <option value="loss">{locale === 'lv' ? 'Svara samazināšana' : 'Weight Loss'}</option>
                </select>
            </div>

            {/* Filtrs 5: Alergēni / Фильтр 4: Аллергены */}
            <div className="mt-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    {locale === 'lv' ? 'Izvairīties No Alergēniem' : 'Avoid Allergens'}
                </label>
                <div className="max-h-[110px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">                    
                    {availableAllergens.map((allergen) => (
                    <div key={allergen.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`allergen-${allergen.id}`}
                            checked={selectedAllergens.includes(allergen.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedAllergens([...selectedAllergens, allergen.id]);
                                } else {
                                    setSelectedAllergens(selectedAllergens.filter((id) => id !== allergen.id));
                                }
                            }}
                            className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-neutral-300 rounded"
                        />
                        <label htmlFor={`allergen-${allergen.id}`} className="block text-sm text-neutral-700 dark:text-neutral-300">
                            {allergen.name_lv || allergen.name}
                        </label>
                    </div>
                ))}
                </div>
            </div>

        </div>
    );
}