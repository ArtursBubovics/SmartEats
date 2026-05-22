<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Allergen;
use App\Models\Recipe;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $allergens = Allergen::factory(10)->create();
        $recipes = Recipe::factory(20)->create();
        $users = User::factory(10)->create();

        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $users->push($adminUser); // ДОБАВЛЯЕМ АДМИНА В КОЛЛЕКЦИЮ ПОЛЬЗОВАТЕЛЕЙ

        $users->each(function ($user) use ($allergens, $recipes) {

            // Привязываем от 0 до 3 случайных аллергенов к пользователю
            // allergen_user добавл текущий ид пользователя и ид аллергена который снизу выбираем рандомно из коллекции аллергенов и берем только их id
            $user->allergens()->attach(
                $allergens->random(rand(0, 3))->pluck('id')
            );

            // Добавляем от 1 до 5 случайных рецептов в "избранное" (favorite_recipes)
            // favorite_recipes добавляет текущий ид пользователя и ид рецепта который снизу выбираем рандомно из коллекции рецептов и берем только их id
            $user->favorite_recipes()->attach(
                $recipes->random(rand(1, 5))->pluck('id')
            );
        });

        // свяжем рецепты и аллергены (allergen_recipe)
        $recipes->each(function ($recipe) use ($allergens) {
            // Пусть в каждом рецепте будет от 0 до 2 аллергенов
            // allergen_recipe добавляет текущий ид рецепта и ид аллергена который снизу выбираем рандомно из коллекции аллергенов и берем только их id
            $recipe->allergens()->attach(
                $allergens->random(rand(0, 2))->pluck('id')
            );
        });
    }
}
