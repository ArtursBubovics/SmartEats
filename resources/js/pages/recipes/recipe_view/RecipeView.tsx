import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ChefHat, Clock, ShieldAlert, Scale } from 'lucide-react';
import { getGoalBadgeStyles, getRecipeGoalType } from '@/utils/recipeHelpers';

// Описываем типы данных, которые прилетают из Laravel
interface Allergen {
    id: number;
    name: string;
    name_lv: string;
}

interface Recipe {
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

interface Props {
    recipe: Recipe;
    locale: 'lv' | 'en';
    fromTab: 'all' | 'favorites' | 'history';
}

export default function RecipeView({ recipe, locale = 'lv', fromTab = 'all' }: Props) {
    // Определяем локализованное имя и описание
    const recipeName = locale === 'lv' ? recipe.name_lv : recipe.name_en;
    const recipeDescription = locale === 'lv' ? recipe.description_lv : recipe.description_en;

    const translations = {
        lv: {
            maintenance: 'Svara saglabāšana',
            gain: 'Masas palielināšana',
            loss: 'Svara samazināšana',
            calories: 'Kalorijas',
            proteins: 'Olbaltumvielas',
            fats: 'Tauki',
            carbs: 'Ogļhidrāti',
            nutrients: 'Uzturvērtība',
            stepsAndIngredients: 'Apraksts un sastāvdaļas',
            noSteps: 'Apraksts un sastāvdaļas vēl nav pievienoti.',
            backFavorites: 'Atpakaļ uz izlasi',
            backHistory: 'Atpakaļ uz vēsturi',
            backAll: 'Atpakaļ pie receptēm',
            photo: 'Receptes foto'
        },
        en: {
            maintenance: 'Weight Maintenance',
            gain: 'Weight Gain',
            loss: 'Weight Loss',
            calories: 'Calories',
            proteins: 'Proteins',
            fats: 'Fats',
            carbs: 'Carbs',
            nutrients: 'Nutrition Facts',
            stepsAndIngredients: 'Description & Ingredients',
            noSteps: 'Description and ingredients have not been added yet.',
            backFavorites: 'Back to favorites',
            backHistory: 'Back to history',
            backAll: 'Back to recipes',
            photo: 'Recipe photo'
        }
    };

    const t = translations[locale];

    const goalKey = getRecipeGoalType(recipe);

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
            <Head title={recipeName || 'Recipe'} />

            {/* Кнопка назад */}
            <div className="mb-6">
                <Link
                    href={`/recipes/${fromTab}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition"
                >
                    <ArrowLeft className="size-4" />
                    <span>
                        {fromTab === 'favorites' && t.backFavorites}
                        {fromTab === 'history' && t.backHistory}
                        {fromTab === 'all' && t.backAll}
                    </span>
                </Link>
            </div>

            {/* ОСНОВНАЯ КАРТОЧКА РЕЦЕПТА */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">

                {/* ВЕРХНЯЯ ЧАСТЬ: Название и Заглушка Фото */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                    {/* Фото по центру/слева */}
                    <div className="md:col-span-1 relative aspect-video md:aspect-square rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                        <div className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500">
                            <ChefHat className="size-12 stroke-[1.5]" />
                            <span className="text-xs font-medium tracking-wide uppercase">{t.photo}</span>
                        </div>
                    </div>

                    {/* Название, Динамическая Цель и Аллергены */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="space-y-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${getGoalBadgeStyles(goalKey)}`}>
                                {t[goalKey]}                            
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
                                {recipeName || 'Bez nosaukuma'}
                            </h1>
                        </div>

                        {/* Блок Аллергенов */}
                        {recipe.allergens && recipe.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {recipe.allergens.map((allergen) => (
                                    <span
                                        key={allergen.id}
                                        className="inline-flex items-center gap-1.5 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-200/40 dark:border-amber-900/30 shadow-2xs"
                                    >
                                        <ShieldAlert className="size-3 text-amber-500 flex-shrink-0 stroke-[2.5]" />
                                        <span>{locale === 'lv' ? allergen.name_lv : allergen.name}</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-neutral-100 dark:border-neutral-800/60" />

                {/* ПАНЕЛЬ КБЖУ (Энергетическая ценность) */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                        <Scale className="size-3.5" />
                        {t.nutrients}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/40">
                            <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-bold tracking-wider">{t.calories}</span>
                            <span className="text-xl font-black text-neutral-800 dark:text-white">{recipe.calories} <span className="text-xs font-normal text-neutral-500">kcal</span></span>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/40">
                            <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-bold tracking-wider">{t.proteins}</span>
                            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{recipe.proteins}g</span>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/40">
                            <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-bold tracking-wider">{t.fats}</span>
                            <span className="text-lg font-black text-amber-600 dark:text-amber-400">{recipe.fats}g</span>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/40">
                            <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-bold tracking-wider">{t.carbs}</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{recipe.carbs}g</span>
                        </div>
                    </div>
                </div>

                <hr className="border-neutral-100 dark:border-neutral-800/60" />

                {/* НИЖНЯЯ ЧАСТЬ: ОБЩЕЕ ОКНО ДЛЯ ОПИСАНИЯ И ИНГРЕДИЕНТОВ */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                        <Clock className="size-4 text-emerald-500" />
                        <span>{t.stepsAndIngredients}</span>
                    </h3>

                    <div className="p-5 md:p-6 bg-neutral-50 dark:bg-neutral-800/20 rounded-xl border border-neutral-100 dark:border-neutral-800 text-base text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed font-normal">
                        {recipeDescription || t.noSteps}
                    </div>
                </div>

            </div>
        </div>
    );
}