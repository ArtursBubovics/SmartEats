import React from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';

interface RecipeFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    maxCalories: number;
    setMaxCalories: (value: number) => void;
    sortBy: string;
    setSortBy: (value: string) => void;}

export default function RecipeFilters({
    searchQuery,
    setSearchQuery,
    maxCalories,
    setMaxCalories,
    sortBy,
    setSortBy
}: RecipeFiltersProps) {
    return (
        <div className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                <SlidersHorizontal className="size-4 text-indigo-500" />
                <span>Filtri</span>
            </div>

            {/* Фильтр 1: Поиск по названию */}
            <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    Meklēt recepti
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

            {/* Фильтр 2: Максимум калорий */}
            <div className="mb-5 transition-all duration-200">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        Maks. Kalorijas
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


            {/* Фильтр 3: Сортировка */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    Kārtot pēc
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
        </div>
    );
}