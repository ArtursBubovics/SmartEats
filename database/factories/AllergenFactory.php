<?php

namespace Database\Factories;

use App\Models\Allergen;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Allergen>
 */
class AllergenFactory extends Factory
{

    protected $model = Allergen::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    
    public function definition(): array
    {
        $baseWord = $this->faker->unique()->word();

        return [
            'name_lv' => Str::ucfirst($baseWord) . '_LV', // ucfirst делает первую букву заглавной , а остальные символы оставляет без изменений
            'name_en' => Str::ucfirst($baseWord) . '_EN', // Str справляется и с латышскими буквами где длинная буква
        ];
    }
}
