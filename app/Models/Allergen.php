<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Allergen extends Model
{
    use HasFactory;

    protected $fillable = ['name_lv', 'name_en'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'allergen_user')->withTimestamps();
    }

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'allergen_recipe')->withTimestamps();
    }
}
