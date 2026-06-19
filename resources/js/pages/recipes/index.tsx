import React, { useEffect, useMemo, useState } from 'react';
import { ChefHat, History, Heart, LayoutGrid, ShieldAlert, ArrowUpRight, Undo2 } from 'lucide-react'; import { Link, router } from '@inertiajs/react';
import RecipeHeader from '@/my_components/recipes/recipe_main/RecipeHeader';
import RecipeFilters from '@/my_components/recipes/recipe_main/RecipeFilters';
import { getRecipeGoalType, getGoalBadgeStyles } from '@/utils/recipeHelpers';
import { useTranslate } from '@/hooks/useTranslate';
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
    currentTab: 'all' | 'favorites' | 'history'; // Saņemts no RecipeController // Прилетает из RecipeController
}

export default function Index({ recipes, currentTab }: IndexProps) {
    const { t, locale } = useTranslate();

    const [searchQuery, setSearchQuery] = useState('');
    const [maxCalories, setMaxCalories] = useState<number>(1000);
    const [sortBy, setSortBy] = useState('name');

    const [selectedGoal, setSelectedGoal] = useState<string>('all');
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);

    // Izlases favorite funkcionalitātei, lai recepte uzreiz tiktu pievienota sesijā
    // Для favorite чтобы рецепт добавлялся сразу в сессию
    const [localRecipes, setLocalRecipes] = useState<Recipe[]>(recipes);

    // Masīvs, kurā tiek glabāti to kartīšu ID, kuras lietotājs ir apgriezis otrādi
    // Массив, где хранятся ID карточек, которые пользователь перевернул 
    const [flippedRecipes, setFlippedRecipes] = useState<number[]>([]);

    // Funkcija konkrētas kartītes puses pārslēgšanai
    // Ja ID jau eksistē apgriezto kartīšu masīvā — dzēšam to (kartīte atgriežas sākumpozīcijā). Ja nē — pievienojam.
    // Функция для переключения стороны конкретной карточки
    // Если ID уже есть в массиве перевернутых — удаляем его (карточка возвращается лицом). Если нет — добавляем.

    const toggleFlip = (id: number) => {
        setFlippedRecipes(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    useEffect(() => { // Mainoties datiem servera pusē, tiek atjaunināts recipes stāvoklis // при изменении на сервере изменяет recipes
        setLocalRecipes(recipes);
    }, [recipes]);

    // useMemo позволяет выполнить и заного не перерисовать так как это много занимает ресурсов
    const availableAllergens = useMemo(() => {
        const map = new Map<number, Allergen>(); // сохраняет уникальные ID алергенов
        recipes.forEach(recipe => {
            recipe.allergens?.forEach(allergen => {
                if (!map.has(allergen.id)) {
                    map.set(allergen.id, allergen);
                }
            });
        });
        return Array.from(map.values()); // Pārveido no map (vārdnīcas) uz masīvu // из map(словаря) в массив
    }, [recipes]);

    // Filtrējam un kārtojam lokālo recepšu stāvokli // Фильтруем и сортируем локальный стейт рецептов
    const filteredRecipes = localRecipes
        .filter((recipe) => {
            const matchesSearch = recipe.name_lv.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.name_en.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCalories = recipe.calories <= maxCalories;

            const matchesGoal = selectedGoal === 'all' || getRecipeGoalType(recipe) === selectedGoal;

            const matchesAllergens = selectedAllergens.length === 0 || !recipe.allergens?.some(
                (allergen) => selectedAllergens.includes(allergen.id)
            );

            return matchesSearch && matchesCalories && matchesGoal && matchesAllergens;
        })
        .sort((a, b) => {

            //!!!
            if (sortBy === 'name') return a.name_lv.localeCompare(b.name_lv);
            if (sortBy === 'cal-asc') return a.calories - b.calories;
            if (sortBy === 'cal-desc') return b.calories - a.calories;
            return 0;
        });

    // Atzīmē sirsniņu un veic POST pieprasījumu. Kļūdas gadījumā atgriež iepriekšējo stāvokli
    function toggleFavorite(id: number): void { // Устанавливаем сердечко, потом запрос Post. Если ошибка вернем обратно
        // Optimistiskais atjauninājums: nekavējoties nomaina sirsniņas stāvokli priekšgalā
        // Оптимистичный апдейт: мгновенно меняем сердечко на фронте
        setLocalRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.id === id ? { ...recipe, is_favorite: !recipe.is_favorite } : recipe
            )
        );

        // Nosūta POST pieprasījumu uz Laravel // Отправляем POST-запрос на Laravel
        router.post(`/recipes/${id}/favorite`, {}, {
            preserveScroll: true, // Страница не будет прыгать вверх при клике
            onError: () => {
                // Kļūdas gadījumā atgriež sākotnējo stāvokli (atceļ izmaiņas) // Если ошибка, откатываем стейт назад
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
            {/* Lapas augšējā galvene un navigācija // Верхний заголовок страницы */}
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
                        <span>{t('recipes.all_recipes')}</span>
                    </Link>

                    {/* Saite: Izlase (/recipes/favorites) // Ссылка: Izlase (/recipes/favorites) */}
                    <Link
                        href="/recipes/favorites"
                        className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition duration-200 focus:outline-none cursor-pointer
                        ${currentTab === 'favorites'
                                ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <Heart className={`size-3.5 ${currentTab === 'favorites' ? 'fill-indigo-600/10 dark:fill-indigo-400/10 text-indigo-600 dark:text-indigo-400' : ''}`} />
                        <span>{t('recipes.favorites')}</span>
                    </Link>
                    {/* Saite: Vēsture (/recipes/history) // Ссылка: Vēsture (/recipes/history) */}
                    <Link
                        href="/recipes/history"
                        className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition duration-200 focus:outline-none cursor-pointer
                        ${currentTab === 'history'
                                ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        <History className={`size-3.5 ${currentTab === 'history' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                        <span>{t('recipes.history')}</span>
                    </Link>
                </div>
            </div>

            {/* GALVENAIS KONTEINERS: Sadalījums Filtros un Kartītēs // ОСНОВНОЙ КОНТЕЙНЕР: Разделение на Фильтры и Карточки */}
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
                        selectedGoal={selectedGoal}
                        setSelectedGoal={setSelectedGoal}
                        availableAllergens={availableAllergens}
                        selectedAllergens={selectedAllergens}
                        setSelectedAllergens={setSelectedAllergens}
                    />
                )}

                {/* LABĀ PUSE: Recepšu kartīšu režģis // ПРАВАЯ ЧАСТЬ: Сетка с карточками рецептов */}
                <div className="flex-1 w-full">
                    {filteredRecipes.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                                {currentTab === 'all' && t('recipes.empty_filtered')}
                                {currentTab === 'favorites' && t('recipes.empty_favorites')}
                                {currentTab === 'history' && t('recipes.empty_history')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredRecipes.map((recipe: Recipe) => {
                                const goalKey = getRecipeGoalType(recipe);
                                const isFlipped = flippedRecipes.includes(recipe.id);
                                return (
                                    <div
                                        key={recipe.id}
                                        className="w-full min-h-[460px] perspective:[1000px] cursor-pointer group"
                                    >
                                        <div
                                            onClick={() => handleRecipeClick(recipe.id)}
                                            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''
                                                }`}

                                        >
                                            {/* == PRIEKŠPUSE // ЛИЦЕВАЯ СТОРОНА ==*/}
                                            <div
                                                onClick={() => handleRecipeClick(recipe.id)}
                                                className={`relative inset-0 w-full h-full [backface-visibility:hidden] flex flex-col justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${isFlipped ? 'pointer-events-none' : ''
                                                    }`}
                                            >
                                                <div className="relative w-full">
                                                    <div className="relative w-full flex flex-row items-center justify-between mb-4 gap-2">

                                                        {/* Apgriešanas pog // Кнопка переворота*/}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Не переходим на страницу рецепта
                                                                toggleFlip(recipe.id); // Переворачиваем на оборот!
                                                            }}
                                                            className="p-2 cursor-pointer bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs rounded-full shadow-xs text-neutral-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition shrink-0"
                                                            title="Skatīt aprakstu"
                                                        >
                                                            <ArrowUpRight className="size-4" />
                                                        </button>

                                                        {/* Receptes nosaukums // Заголовок рецепта */}
                                                        <div className="flex-1 min-w-0 text-center">
                                                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white block truncate text-center" title={recipe.name_lv || recipe.name_en || 'Bez nosaukuma'}>
                                                                {recipe.name_lv || recipe.name_en || 'Bez nosaukuma'}
                                                            </h2>
                                                        </div>

                                                        {/* Sirsniņas poga // Сердечко */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFavorite(recipe.id);
                                                            }}
                                                            className="p-2 cursor-pointer bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs rounded-full shadow-xs text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition shrink-0"
                                                        >
                                                            <Heart className={`size-4 transition-colors ${recipe.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                                                        </button>
                                                    </div>

                                                    {/* Fotoattēla lauks // Поле для ФОТО */}
                                                    <div className="relative w-full aspect-video mb-5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                                                        <div className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500 group-hover:scale-105 transition duration-200">
                                                            <ChefHat className="size-10 stroke-[1.5]" />
                                                            <span className="text-xs font-medium tracking-wide uppercase">Receptes foto</span>
                                                        </div>
                                                        <div className="absolute top-0 right-0 pt-2 pr-2">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${getGoalBadgeStyles(goalKey)}`}>
                                                                {t(`recipes.${goalKey}`)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Uzturvērtības un alergēnu bloks // Блок КБЖУ и Аллергены */}
                                                <div>
                                                    <div className="border-t border-neutral-100 dark:border-neutral-800/60 pt-4 mb-4">
                                                        <div className="grid grid-cols-4 gap-2 text-center">
                                                            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                                <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">{t('recipes.calories')}</span>
                                                                <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">{recipe.calories}</span>
                                                            </div>
                                                            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                                <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">{t('recipes.protein')}</span>
                                                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{recipe.proteins}</span>
                                                            </div>
                                                            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                                <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">{t('recipes.fats')}</span>
                                                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{recipe.fats}</span>
                                                            </div>
                                                            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                                                                <span className="block text-xs text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider">{t('recipes.carbs')}</span>
                                                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{recipe.carbs}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Alergēnu attēlošanas cikls // Твой блок с циклом аллергенов */}
                                                    {recipe.allergens && recipe.allergens.length > 0 && (() => {
                                                        const MAX_VISIBLE = 2;
                                                        const visibleAllergens = recipe.allergens.slice(0, MAX_VISIBLE);
                                                        const hiddenCount = recipe.allergens.length - MAX_VISIBLE;

                                                        return (
                                                            <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800/40">
                                                                {visibleAllergens.map((allergen: Allergen) => (
                                                                    <span key={allergen.id} className="inline-flex items-center gap-1.5 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-amber-200/40 dark:border-amber-900/30 shadow-2xs">
                                                                        <ShieldAlert className="size-3 text-amber-500 dark:text-amber-500 flex-shrink-0 stroke-[2.5]" />
                                                                        <span className="truncate max-w-[80px]">{allergen.name}</span>
                                                                    </span>
                                                                ))}
                                                                {hiddenCount > 0 && (
                                                                    <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md border border-neutral-200/50 dark:border-neutral-700/50 shadow-2xs">
                                                                        +{hiddenCount}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            {/* ==  AIZMUGURE // ОБОРОТНАЯ СТОРОНА == */}
                                            <div
                                                className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm z-10 ${!isFlipped ? 'pointer-events-none' : ''
                                                    }`}
                                            >
                                                <div className="flex flex-col h-full w-full">

                                                    {/* Aizmugures augšējais panelis // Верхняя панелька оборота */}
                                                    <div className="flex flex-row items-center justify-between mb-4 w-full">
                                                        {/* Кнопка "Вернуть как было" */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Aizsardzība pret nejaušu pāreju pēc saites // Защита от перехода по ссылке
                                                                toggleFlip(recipe.id); // Pagriež atpakaļ uz priekšpusi // Крутим обратно на лицо
                                                            }}
                                                            className="p-2 cursor-pointer bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-indigo-500 transition shrink-0"
                                                            title="Atgriezties"
                                                        >
                                                            {/* Undo2 ikona (noapaļota bultiņa atpakaļ)  // Иконка Undo2 (закругленная стрелка назад)*/}
                                                            <Undo2 className="size-4" />
                                                        </button>

                                                        <span className="text-xl font-bold text-neutral-500 dark:text-white  tracking-wider">{t('recipes.description_title')}</span>
                                                        <div className="w-8" /> {/* Центровщик-пустышка */}
                                                    </div>

                                                    {/* Apakšējā daļa: Visu receptes alergēnu saraksta izvade // Нижняя часть: Вывод списка всех аллергенов рецепта */}
                                                    {recipe?.allergens && (
                                                        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0 [transform:translateZ(1px)]">
                                                            <span className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                                                                {t('recipes.allergens_title')}
                                                            </span>

                                                            {recipe.allergens.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1.5 max-h-[75px] overflow-y-auto pr-0.5">
                                                                    {recipe.allergens.map((allergen: Allergen) => {
                                                                        const nameToDisplay = locale === 'lv'
                                                                            ? (allergen.name_lv || allergen.name)
                                                                            : (allergen.name || allergen.name_lv);

                                                                        return (
                                                                            <span
                                                                                key={allergen.id}
                                                                                className="inline-flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-200/40 dark:border-amber-900/40 shadow-2xs [transform:translateZ(1px)]"
                                                                            >
                                                                                <ShieldAlert className="size-3 text-amber-500 shrink-0 stroke-[2.5]" />
                                                                                <span className="inline-block [transform:translateZ(0px)]">
                                                                                    {nameToDisplay || "Неизвестно"}
                                                                                </span>
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                //Vizuāls aizvietotājs (placeholder), ja alergēnu nav
                                                                /* Красивая заглушка, если аллергенов нет */
                                                                <p className="text-[12px] text-neutral-400 dark:text-neutral-500 italic">
                                                                    {locale === 'lv' ? 'Nav alergēnu' : 'Аллергены отсутствуют'}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    );
}