<?php

namespace Database\Factories;

use App\Models\Recipe;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Recipe>
 */
class RecipeFactory extends Factory
{

    protected $model = Recipe::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $goals = [
            ['lv' => 'Samazināt svaru', 'en' => 'weight_loss'],
            ['lv' => 'Palielināt muskuļu masu', 'en' => 'mass_gain'],
            ['lv' => 'Uzturēt formu', 'en' => 'maintenance']
        ];

        $calories = $this->faker->numberBetween(150, 1000);
        $proteins = $this->faker->numberBetween(10, 100);
        $fats = $this->faker->numberBetween(5, 30);
        $carbs = $this->faker->numberBetween(10, 80);

        //$randomGoal = $this->faker->randomElement($goals);

        return [
            /** Šeit aizpildām laukus ar nejaušiem vārdiem / ТУТ ЗАПОЛНЯЕМ ПОЛЯ РАНДОМНЫЕМИ СЛОВАМИ */
            // ucfirst padara pirmo burtu lielo, bet pārējos simbolus atstāj bez izmaiņām / ucfirst делает первую букву заглавной , а остальные символы оставляет без изменений
            'name_lv' => 'Maltīte ' . Str::ucfirst($this->faker->word()),
            // Str tiek galā arī ar latviešu burtiem ar garumzīmēm / Str справляется и с латышскими буквами где длинная буква
            'name_en' => 'Meal ' . Str::ucfirst($this->faker->word()),

            /** Šeit ģenerējam aprakstu, kas būs jēgpilns, 150 simboli / ТУТ ГЕНЕРИРУЕМ ОПИСАНИЕ, КОТОРОЕ БУДЕТ ОСМЫСЛЕННЫМ  150 СИМВОЛОВ */
            'description_lv' => 'Šī ir ' . $this->faker->word() . ' maltīte. ' . $this->faker->realText(150),
            'description_en' => 'This is ' . $this->faker->word() . ' meal. ' . $this->faker->realText(150),

            'calories' => $calories,
            'proteins' => $proteins,
            'fats' => $fats,
            'carbs' => $carbs
        ];
    }
}
