<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\RecipeController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // если пользователь перешел /dashboard 
    Route::inertia('dashboard', 'dashboard')->name('dashboard');


    // Сработает RecipeController
    // Отрабатывает RecipeController и отфильтрует рецепты, оставив только безопасные
    // Попросит Inertia открыть React-компонент, который находится по пути recipes/index (внутри папки с фронтендом), и автоматически передаст туда этот список рецептов
    Route::prefix('recipes')->name('recipes.')->group(function () {

        // 1. Авто-редирект: если зайти просто на smarteats.test/recipes, перекинет на /recipes/all
        Route::get('/', function () {
            return redirect()->route('recipes.index');
        });

        // 2. Все рецепты (Твой изначальный роут, теперь доступен по адресу /recipes/all)
        Route::get('/all', [RecipeController::class, 'index'])->name('index');

        // 3. Избранные рецепты (Доступен по адресу /recipes/favorites)
        Route::get('/favorites', [RecipeController::class, 'favorites'])->name('favorites');

        // 4. История просмотров (Доступен по адресу /recipes/history)
        Route::get('/history', [RecipeController::class, 'history'])->name('history');



        // Роут для открытия конкретного рецепта
        Route::get('/all/{recipe}', [RecipeController::class, 'show'])->name('show.all');
        Route::get('/favorites/{recipe}', [RecipeController::class, 'show'])->name('show.favorites');
        Route::get('/history/{recipe}', [RecipeController::class, 'show'])->name('show.history');

        // 5. Роут для самого сердечка (POST-запрос для добавления/удаления из избранного)
        Route::post('/{recipe}/favorite', [RecipeController::class, 'toggleFavorite'])->name('favorite');
    });
});


require __DIR__ . '/settings.php';
