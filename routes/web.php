<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Maršruts vietnes valodas maiņai // роут для смены языка сайта
Route::get('/locale/{locale}', function ($locale) {
    // Проверяем что передаваемый язык есть в списке разрешенных (lv, en, ru)
    if (!in_array($locale, ['lv', 'en', 'ru'])) {
        abort(400);
    }

    // Ja lietotājs ir autorizējies, saglabā izvēli datubāzē // Если пользователь вошел, то сохраняем выбор в бд
    if (Auth::check()) { // Проверяем, авторизован ли
        $user = Auth::user();
        // Pārbauda, vai user ir izveidots pēc User modeļa; ja jā, saglabā DB
        if ($user instanceof \App\Models\User) { // Проверсяем, что user создан по шаблону User, если да, то сохраняем в бд
            $user->locale = $locale;
            $user->save();
        }
    }

    // Jebkurā gadījumā dublē sesijā (viesiem un vispārējai stabilitātei)
    // В любом случае дублируем в сессию (для гостей и общей стабильности)
    Session::put('locale', $locale); // Сохраняем выбранный язык в сессию
    app()->setLocale($locale); // Iestata lietotnes valodu pašam Laravelam // Устанавливаем язык приложения на выбранный для самого ларавела

    return redirect()->back();

    // Maršruts, kas saīsina nosaukumu uz locale.change ērtākai lietošanai kodā
})->name('locale.change'); // Роут которые сокращает название на locale.change, чтобы в коде было удобнее его использовать

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard'); // Maršruti bez kontroliera

    Route::middleware(['can:access-admin'])->prefix('admin')->name('admin.')->group(function () { // Только для админов is_admin  // admin.dashboard для ссылок/редиректов

        Route::inertia('/', 'admin/dashboard')->name('dashboard');

        Route::get('/users', [UserController::class, 'index']);

        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        Route::patch('/users/{user}/toggle-block', [UserController::class, 'toggleBlock']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });


    Route::prefix('recipes')->name('recipes.')->group(function () {

        Route::get('/', function () {
            return redirect()->route('recipes.index');
        });

        Route::get('/all', [RecipeController::class, 'index'])->name('index');

        Route::get('/favorites', [RecipeController::class, 'favorites'])->name('favorites');

        Route::get('/history', [RecipeController::class, 'history'])->name('history');



        // Maršruts konkrētas receptes atvēršanai // Роут для открытия конкретного рецепта
        Route::get('/all/{recipe}', [RecipeController::class, 'show'])->name('show.all');
        Route::get('/favorites/{recipe}', [RecipeController::class, 'show'])->name('show.favorites');
        Route::get('/history/{recipe}', [RecipeController::class, 'show'])->name('show.history');

        Route::post('/{id}/view', [RecipeController::class, 'addToHistory']);

        // Maršruts pašai sirsniņai (POST pieprasījums pievienošanai/izņemšanai no izlases)
        // Роут для самого сердечка (POST-запрос для добавления/удаления из избранного)
        Route::post('/{recipe}/favorite', [RecipeController::class, 'toggleFavorite'])->name('favorite');
    });
});


require __DIR__ . '/settings.php';
