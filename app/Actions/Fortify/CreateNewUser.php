<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        // Ņem visus datus no reģistrācijas formas un pārbauda tos pēc validācijas noteikumiem.
        Validator::make($input, [ // Берет все данные, которые пришли из формы регистрации и проверяет их на валидность по второму аргументу
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'locale' => ['nullable', 'string', Rule::in(['lv', 'en', 'ru'])],
        ])->validate(); 

        // Droša rezerves opcija: ja valoda ir tukša (operators ??), pēc noklusējuma iestatām 'en'
        // Безопасный фоллбек: если язык браузера пустой или не поддерживается, тогда 'en'
        $locale = $input['locale'] ?? 'en';
        if (!in_array($locale, ['lv', 'en', 'ru'])) {
            $locale = 'en';
        }

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'locale' => $locale,
        ]);
    }
}
