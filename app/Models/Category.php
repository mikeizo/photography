<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $guarded = ['id'];

    public function photos()
    {
        return $this->belongsToMany('App\Models\Photo', 'categories_photos');
    }
}
