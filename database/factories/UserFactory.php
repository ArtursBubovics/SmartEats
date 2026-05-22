<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $goals = [
            [
                'lv' => 'Samazināt svaru',
                'en' => 'Weight loss'
            ],
            [
                'lv' => 'Palielināt muskuļu masu',
                'en' => 'Mass gain'
            ],
            [
                'lv' => 'Uzturēt formu',
                'en' => 'Maintenance'
            ]
        ];

        $randomGoal = fake()->randomElement($goals);
        
        // Случайный пол
        $isMale = fake()->boolean();

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,

            'height' => fake()->numberBetween(155, 195),
            'weight' => fake()->numberBetween(50, 110),
            'gender_lv' => $isMale ? 'Vīrietis' : 'Sieviete',
            'gender_en' => $isMale ? 'Male' : 'Female',
            'goal_lv' => $randomGoal['lv'],
            'goal_en' => $randomGoal['en'],
            'role' => 'user', // по умолчанию все обычные пользователи
            'is_blocked' => false,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
