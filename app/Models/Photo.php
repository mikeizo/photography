<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Photo extends Model
{
    public function categories()
    {
        return $this->belongsToMany('App\Models\Category', 'categories_photos')->orderBy('name');
    }

    /*
    public static function findByCategory($query, $id)
    {
        return $query->whereHas('categories', function ($query) use ($id){
            $query->where('category_id', $id);
        });
    }
    */
}
