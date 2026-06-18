<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'height',
    'weight',
    'gender_lv',
    'gender_en',
    'goal_lv',
    'goal_en',
    'locale'
])] // поля которые пользователь может заполнять
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_blocked' => 'boolean'
        ];
    } // Lauki, kurus lietotājs var aizpildīt / поля которые пользователь может заполнять

    public function user_activity()
    {
        return $this->belongsToMany(Recipe::class, 'user_activity')->withTimestamps();
    }

    public function favorite_recipes()
    {
        return $this->belongsToMany(Recipe::class, 'favorite_recipes')->withTimestamps();
    }

    public function allergens()
    {
        return $this->belongsToMany(Allergen::class, 'allergen_user')->withTimestamps();
    }

    public function isAdmin(): bool
    {
        // Atgriež true, ja lietotājam kolonnā "role" vērtība ir "admin"
        // Возвращает true, если у пользователя в колонке is_admin значение true
        return $this->role === 'admin';
    }
}
