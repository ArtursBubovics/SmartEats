// resources/js/utils/recipeHelpers.ts

interface RecipeKeyNutrition {
    calories: number;
    proteins: number;
    carbs: number;
}

export type GoalType = 'gain' | 'loss' | 'maintenance';

/**
 * Автоматически определяет категорию рецепта на основе его КБЖУ.
 * Возвращает строковый ключ цели.
 */
export const getRecipeGoalType = (recipe: RecipeKeyNutrition): GoalType => {
    const { calories, proteins, carbs } = recipe;

    // Предотвращаем деление на ноль, если калорийность не указана или равна 0
    if (!calories || calories === 0) return 'maintenance';

    const proteinKcal = proteins * 4;
    const carbsKcal = carbs * 4;

    // 1. НАБОР МАССЫ: Блюдо сытное (>=500 ккал) И (высокая общая калорийность или упор на углеводы)
    if (calories >= 500 && (calories > 600 || (carbsKcal / calories) > 0.50)) {
        return 'gain';
    }

    // 2. ПОХУДЕНИЕ: Легкое блюдо (<350 ккал) ИЛИ белок доминирует (>30% от энергии)
    if (calories < 350 || (proteinKcal / calories) > 0.30) {
        return 'loss';
    }

    return 'maintenance';
};

/**
 * Возвращает Tailwind-классы для стилизации бейджа на основе ключа цели.
 */
export const getGoalBadgeStyles = (goal: GoalType): string => {
    switch (goal) {
        case 'gain':
            return 'bg-amber-50 dark:bg-amber-950/40 text-amber-400 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
        case 'loss':
            return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-400 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
        case 'maintenance':
        default:
            return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-400 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
    }
};