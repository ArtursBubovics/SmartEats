<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([  // Atļautie lauki masveida aizpildīšanai / разрешенные поля для массового заполнения
    'name_lv',
    'name_en',
    'description_lv',
    'description_en',
    'calories',
    'proteins',
    'fats',
    'carbs',
    'goal_type'
])]
class Recipe extends Model
{
    use HasFactory;

    public function allergens()
    {
        return $this->belongsToMany(Allergen::class, 'allergen_recipe')->withTimestamps();
    }

    public function user_activities()
    {
        return $this->belongsToMany(User::class, 'user_activities')->withTimestamps();
    }

    public function favorite_recipes()
    {
        return $this->belongsToMany(User::class, 'favorite_recipes')->withTimestamps();
    }
}
