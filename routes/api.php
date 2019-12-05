<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('settings', 'SettingsController@index');
Route::get('photos', 'PhotoController@index');
Route::get('categories', 'CategoriesController@index');
Route::post('contact', 'ContactController@index');

// Admin
Route::middleware(['auth:api', 'isAdmin:api'])->prefix('admin')->group(function () {
    Route::resource('photos', 'PhotoController')->only(['store', 'update', 'destroy']);
    Route::resource('categories', 'CategoriesController')->only(['store', 'show', 'update', 'destroy']);
    Route::post('update-categories', 'PhotoController@bulkUpdate');
    Route::post('delete-photos', 'PhotoController@bulkDestroy');
    Route::post('settings', 'SettingsController@update');
});

// Authorization
Route::middleware('api')->prefix('auth')->group(function () {
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('user', 'AuthController@user');
    // Route::post('register', 'AuthController@register');
});
