<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecipeController extends Controller
{
    private function getSafeRecipesQuery(Request $request)
    {
        $query = Recipe::with('allergens');
        $user = $request->user();

        // Получаем массив ID аллергенов пользователя
        $userAllergensID = $user->allergens()->pluck('allergens.id');

        // Если у пользователя есть аллергены, исключаем опасные рецепты
        if ($userAllergensID->isNotEmpty()) {
            $query->whereDoesntHave('allergens', function ($q) use ($userAllergensID) {
                $q->whereIn('allergens.id', $userAllergensID);
            });
        }

        return $query;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        // Берем базовые безопасные рецепты
        $recipes = $this->getSafeRecipesQuery($request)->get();

        // Проставляем is_favorite для фронтенда
        // (Позже заменим это на чистый SQL через withExists, когда настроим связь в модели)
        $favoriteIds = $user->favorite_recipes()->pluck('recipes.id')->toArray();
        $recipes->each(function ($recipe) use ($favoriteIds) {
            $recipe->is_favorite = in_array($recipe->id, $favoriteIds);
        });

        return Inertia::render('recipes/index', [
            'recipes' => $recipes,
            'currentTab' => 'all'
        ]);
    }

    // 2. ИЗБРАННЫЕ РЕЦЕПТЫ
    public function favorites(Request $request)
    {
        $user = $request->user();

        // Получаем только те безопасные рецепты, которые привязаны к избранному пользователя
        $recipes = $this->getSafeRecipesQuery($request)
            ->whereHas('favorite_recipes', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->get();

        // Так как это вкладка "Избранное", тут все рецепты гарантированно любимые
        $recipes->each(function ($recipe) {
            $recipe->is_favorite = true;
        });

        return Inertia::render('recipes/index', [
            'recipes' => $recipes,
            'currentTab' => 'favorites'
        ]);
    }

    // 3. ИСТОРИЯ ПРОСМОТРОВ
    public function history(Request $request)
    {
        $user = $request->user();

        // Получаем только безопасные рецепты из истории просмотров пользователя
        $recipes = $this->getSafeRecipesQuery($request)
            ->whereHas('user_activities', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->get();

        // Проверяем, какие из истории также находятся в избранном
        $favoriteIds = $user->favorite_recipes()->pluck('recipes.id')->toArray();
        $recipes->each(function ($recipe) use ($favoriteIds) {
            $recipe->is_favorite = in_array($recipe->id, $favoriteIds);
        });

        return Inertia::render('recipes/index', [
            'recipes' => $recipes,
            'currentTab' => 'history'
        ]);
    }

    public function toggleFavorite(Request $request, Recipe $recipe)
    {
        // Проверяем связь в pivot-таблице: если есть — удалит, если нет — добавит
        $request->user()->favorite_recipes()->toggle($recipe->id);

        return back(); // Inertia автоматически обновит данные на фронтенде без перезагрузки
    }

    public function show(Recipe $recipe)
    {
        $recipe->load('allergens');

        // Получаем имя текущего роута, например "recipes.show.favorites"
        $routeName = Route::currentRouteName();

        // Достаем последнее слово (all, favorites или history)
        $fromTab = str($routeName)->afterLast('.');

        return Inertia::render('recipes/recipe_view/RecipeView', [
            'recipe' => $recipe,
            'locale' => app()->getLocale(),
            'fromTab' => $fromTab
        ]);
    }

    public function addToHistory(Request $request, $id)
    {
        $userId = Auth::id();
        $currentTab = $request->input('tab', 'all'); // получаем 'all', 'favorites' или 'history'

        // 1. Записываем или обновляем историю в базе данных
        if ($userId) {
            DB::table('user_activities')->updateOrInsert(
                [
                    'user_id'   => $userId,
                    'recipe_id' => $id
                ],
                [
                    // created_at запишется только при первой вставке
                    'created_at' => now(),
                    // updated_at будет обновляться при каждом клике/просмотре
                    'updated_at' => now(),
                ]
            );
        }

        // 2. Определяем, на какой именно роут редиректить пользователя
        $routeName = match ($currentTab) {
            'favorites' => 'recipes.show.favorites',
            'history'   => 'recipes.show.history',
            default     => 'recipes.show.all',
        };

        // 3. Делаем редирект. Inertia сама подхватит его и откроет нужную страницу
        return redirect()->route($routeName, ['recipe' => $id]);
    }
}
