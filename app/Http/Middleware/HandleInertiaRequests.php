<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array // Pieeja absolūti jebkurā React komponentē / доступ абсолютно в любом React-компоненте
    {
        if ($request->user()?->locale) { // Pārbaude vai autorizējies. Iestata valodu sesijai / проверка авторизован. устанавливает язык для сессии
            app()->setLocale($request->user()->locale);
            app()->setLocale($request->user()->locale);
        }

        return [
            ...parent::share($request), // Validācijas kļūdas un cits / ошибки валидации и другое
            'name' => config('app.name'), // Papildus tas, kas zemāk / Mājaslapas nosaukums / доп то что снизу / название сайта
            'auth' => [ // инфо. пользователя
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'is_admin' => $request->user()->isAdmin(),
                ] : null,
            ],
            'locale' => $request->user()?->locale ?? app()->getLocale(),

            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
