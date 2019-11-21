<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Category;

class CategoriesController extends Controller
{

    /**
     * Categories list
     * @return  json
     */
    public function index()
    {
        $categories = Category::orderBy('name')->get();
        return ($categories);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function store(Request $request)
    {
        $input = $request->all();

        // Validate form
        $validate_form = $request->validate([
            'name'  => 'required|max:25|min:3',
            'color' => 'required|max:25'
        ]);

        if($validate_form) {
            Category::create($input);
        }
    }

    /**
     * Show the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     */
    public function show(Request $request, $id)
    {
        $category = Category::find($id);
        return $category;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        $input = $request->all();
        $category->update($input['form']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     */
    public function destroy($id)
    {
        $category = Category::find($id);
        $category->photos()->detach();
        $category->delete();
    }

    /**
     * Sort order of categories
     * @param  Request $request [description]
     */
    public function sort(Request $request)
    {
        $order = $request->input('order');

        foreach ($order as $key => $value) {
            $category = Category::find($value);
            $category->weight = $key;
            $category->save();
        }
        die();
    }
}
