import React, { useEffect, useState } from 'react';
import { ChefHat, History, Heart, LayoutGrid, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import RecipeHeader from '@/my_components/recipes/recipe_main/RecipeHeader';
import RecipeFilters from '@/my_components/recipes/recipe_main/RecipeFilters';

interface Allergen {
    id: number;
    name_lv?: string;
    name?: string;
}

interface Recipe {
    is_favorite: boolean;
    id: number;
    name_lv: string;
    name_en: string;
    description_lv: string;
    description_en: string;
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
    allergens?: Allergen[];
}

interface IndexProps {
    recipes: Recipe[];
    currentTab: 'all' | 'favorites' | 'history'; // Прилетает из RecipeController
}

export default function Index({ recipes, currentTab }: IndexProps) {

    const [searchQuery, setSearchQuery] = useState('');
    const [maxCalories, setMaxCalories] = useState<number>(1000);
    const [sortBy, setSortBy] = useState('name');

    const [localRecipes, setLocalRecipes] = useState<Recipe[]>(recipes);

    useEffect(() => {
        setLocalRecipes(recipes);
    }, [recipes]);

    const locale = (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('lv')) ? 'lv' : 'en';

    // Фильтруем и сортируем локальный стейт рецептов
    const filteredRecipes = localRecipes
        .filter((recipe) => {
            const matchesSearch = recipe.name_lv.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.name_en.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCalories = recipe.calories <= maxCalories;

            return matchesSearch && matchesCalories;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name_lv.localeCompare(b.name_lv);
            if (sortBy === 'cal-asc') return a.calories - b.calories;
            if (sortBy === 'cal-desc') return b.calories - a.calories;
            return 0;
        });

    function toggleFavorite(id: number): void {
        // 1. Оптимистичный апдейт: мгновенно меняем сердечко на фронте
        setLocalRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.id === id ? { ...recipe, is_favorite: !recipe.is_favorite } : recipe
            )
        );

        // 2. Отправляем POST-запрос на Laravel
        router.post(`/recipes/${id}/favorite`, {}, {
            preserveScroll: true, // Страница не будет прыгать вверх при клике
            onError: () => {
                // Если ошибка, откатываем стейт назад
                setLocalRecipes(prevRecipes =>
                    prevRecipes.map(recipe =>
                        recipe.id === id ? { ...recipe, is_favorite: !recipe.is_favorite } : recipe
                    )
                );
            }
        });
    }

    const handleRecipeClick = (recipeId: number) => {
        router.post(`/recipes/${recipeId}/view`, {
            tab: currentTab
        });
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 w-full max-w-none">
            {/* Верхний заголовок страницы */}
            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <RecipeHeader activeTab={currentTab} />
                <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
                    {/* Ссылка: Visi recepti (/recipes/all) */}
                    <Link
                        href="/recipes/all"
                        className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition duration-200 focus:outline-none cursor-pointer
                        ${currentTab === 'all'
                                ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <LayoutGrid className={`size-3.5 ${currentTab === 'all' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                        <span>Visi recepti</span>
                    </Link>

                    {/* Ссылка: Izlase (/recipes/favorites) */}
                    <Link
                        href="/recipes/favorites"
                        className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition duration-200 focus:outline-none cursor-pointer
                        ${currentTab === 'favorites'
                                ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <Heart className={`size-3.5 ${currentTab === 'favorites' ? 'fill-indigo-600/10 dark:fill-indigo-400/10 text-indigo-600 dark:text-indigo-400' : ''}`} />
                        <span>Izlase</span>
                    </Link>
                    {/* Ссылка: Vēsture (/recipes/history) */}
                    <Link
                        href="/recipes/history"
                        className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition duration-200 focus:outline-none cursor-pointer
                        ${currentTab === 'history'
                                ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <History className={`size-3.5 ${currentTab === 'history' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                        <span>Vēsture</span>
                    </Link>
                </div>
            </div>

            {/* ОСНОВНОЙ КОНТЕЙНЕР: Разделение на Фильтры и Карточки */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* ЛЕВАЯ ПАНЕЛЬ: Фильтры */}
                {currentTab === 'all' && (
                    <RecipeFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        maxCalories={maxCalories}
                        setMaxCalories={setMaxCalories}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                )}

                {/* ПРАВАЯ ЧАСТЬ: Сетка с карточками рецептов */}
                <div className="flex-1 w-full">
                    {filteredRecipes.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                                {currentTab === 'all' && 'Netika rasta neviena recepte ar šādiem filtriem.'}
                                {currentTab === 'favorites' && 'Jums vēl nav saglabātu recepšu.'}
                                {currentTab === 'history' && 'Skatīšanās vēsture ir tukša.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredRecipes.map((recipe: Recipe) => (
                                <div
                                    onClick={() => handleRecipeClick(recipe.id)}
                                    key={recipe.id}
                                    className="flex flex-col cursor-pointer justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative group"
                                >
                                    <div className="relative w-full">
                                        <div className="relative w-full flex flex-row items-center justify-between mb-4 gap-2">
                                            {/* Кнопка открытия рецепта (Стрелочка) */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Останавливаем всплытие
                                                }}
                                                className="p-2 cursor-pointer bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs rounded-full shadow-xs text-neutral-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition shrink-0"
                                                title="Skatīt recepti"
                                            >
                                                <ArrowUpRight className="size-4" />
                                            </button>

                                            {/* Заголовок рецепта с ограничением ширины */}
                                            <div className="flex-1 min-w-0 text-center">
                                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white block truncate text-center" title={recipe.name_lv || recipe.name_en || 'Bez nosaukuma'}>
                                                    {recipe.name_lv || recipe.name_en || 'Bez nosaukuma'}
                                                </h2>
                                            </div>

                                            {/* Кнопка добавления в избранное (Сердечко) */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Останавливаем всплытие, чтобы не триггерить div
                                                    toggleFavorite(recipe.id);
                                                }}
                                                className="p-2 cursor-pointer bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs rounded-full shadow-xs text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition shrink-0"
                                            >
                                                <Heart className={`size-4 transition-colors ${recipe.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                                            </button>
                                        </div>
                                        {/* Кнопка открытия рецепта (Стрелочка) */}


                                        {/* Поле для ФОТО по центру */}
                                        <div className="relative w-full aspect-video mb-5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                                            <div className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500 group-hover:scale-105 transition duration-200">
                                                <ChefHat className="size-10 stroke-[1.5]" />
                                                <span className="text-xs font-medium tracking-wide uppercase">Receptes foto</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Блок КБЖУ и Аллергены */}
                                    <div>
                                        <div className="border-t border-neutral-100 dark:border-neutral-800/60 pt-4 mb-4">
                                            <div className="grid grid-cols-4 gap-2 text-center">
                                                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                    <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">Kcal</span>
                                                    <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">{recipe.calories}</span>
                                                </div>
                                                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                    <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">Olbalt.</span>
                                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{recipe.proteins}g</span>
                                                </div>
                                                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                    <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">Tauki</span>
                                                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{recipe.fats}g</span>
                                                </div>
                                                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                    <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">Ogļh.</span>
                                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{recipe.carbs}g</span>
                                                </div>
                                            </div>
                                        </div>

                                        {recipe.allergens && recipe.allergens.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800/40">
                                                {recipe.allergens.map((allergen: Allergen) => (
                                                    <span
                                                        key={allergen.id}
                                                        className="inline-flex items-center gap-1.5 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-amber-200/40 dark:border-amber-900/30 shadow-2xs transition-colors duration-150"
                                                    >
                                                        <ShieldAlert className="size-3 text-amber-500 dark:text-amber-500 flex-shrink-0 stroke-[2.5]" />
                                                        <span>
                                                            {locale === 'lv' ? allergen.name_lv : allergen.name}
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}