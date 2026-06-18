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

        // Iegūstam lietotāja alergēnu ID masīvu
        // Получаем массив ID аллергенов пользователя
        $userAllergensID = $user->allergens()->pluck('allergens.id'); // Pluck вытаскивает только ID аллергенов в виде массива

        // Ja lietotājam ir alergēni, izslēdzam bīstamās receptes
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

        // Paņemam pamata drošās receptes
        // Берем базовые безопасные рецепты
        $recipes = $this->getSafeRecipesQuery($request)->get();

        // Atzīmējam is_favorite priekšgalam (frontend)
        // Проставляем is_favorite для фронтенда
        $favoriteIds = $user->favorite_recipes()->pluck('recipes.id')->toArray(); // Идем в favorite_recipes и получем массив ID любимых рецептов
        $recipes->each(function ($recipe) use ($favoriteIds) {
            $recipe->is_favorite = in_array($recipe->id, $favoriteIds); // Бежит по кадому рецепту и ставит is_favorite в true, если ID рецепта есть в массиве любимых
        });

        return Inertia::render('recipes/index', [
            'recipes' => $recipes,
            'currentTab' => 'all'
        ]);
    }

    public function favorites(Request $request)
    {
        $user = $request->user();

        // Iegūstam tikai tās drošās receptes, kas ir piesaistītas lietotāja izlasei
        // Получаем только те безопасные рецепты, которые привязаны к избранному пользователя
        $recipes = $this->getSafeRecipesQuery($request)
            ->whereHas('favorite_recipes', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->get();

        // Tā kā šī ir cilne "Izlase", šeit visas receptes garantēti ir mīļākās
        // Так как это вкладка "Избранное", тут все рецепты гарантированно любимые
        $recipes->each(function ($recipe) {
            $recipe->is_favorite = true;
        });

        return Inertia::render('recipes/index', [
            'recipes' => $recipes,
            'currentTab' => 'favorites'
        ]);
    }

    public function history(Request $request)
    {
        $user = $request->user();

        // Iegūstam tikai drošās receptes no lietotāja skatījumu vēstures
        // Получаем только безопасные рецепты из истории просмотров пользователя
        $recipes = $this->getSafeRecipesQuery($request)
            ->whereHas('user_activities', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->get();

        // Pārbaudām, kuras receptes no vēstures atrodas arī izlasē
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
        // Pārbauda saiti tabulā: ja tā eksistē — dzēsīs, ja nē — pievienos
        // Проверяем связь в таблице: если есть — удалит, если нет — добавит
        $request->user()->favorite_recipes()->toggle($recipe->id);

        return back(); // Inertia automātiski atjauninās datus priekšgalā bez lapas pārlādes / Inertia автоматически обновит данные на фронтенде без перезагрузки
    }

    public function show(Recipe $recipe)
    {
        $recipe->load('allergens'); // Veic ātru vaicājumu datubāzē un piesaista receptei alergēnus / Делает быстрый запрос к базе и приклеивает к рецепту аллергены

        // Получаем имя текущего роута, например "recipes.show.favorites"
        $routeName = Route::currentRouteName();

        // Iegūstam pašreizējā maršruta nosaukumu, piemēram, "recipes.show.favorites"
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

        // Ierakstām vai atjauninām vēsturi datubāzē
        // Записываем или обновляем историю в базе данных
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

        // Nosakām, uz kuru tieši maršrutu pārvirzīt lietotāju
        // Определяем, на какой именно роут редиректить пользователя / тип switch case
        $routeName = match ($currentTab) {
            'favorites' => 'recipes.show.favorites',
            'history'   => 'recipes.show.history',
            default     => 'recipes.show.all',
        };

        // Inertia pati to uztvers un atvērs vajadzīgo lapu
        // Делаем редирект. Inertia сама подхватит его и откроет нужную страницу
        return redirect()->route($routeName, ['recipe' => $id]);
    }
}
