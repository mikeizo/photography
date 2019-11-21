<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Image;
use Validator;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->direct_path = base_path('frontend/static/img/');
    }

    /**
     * Settings
     *
     * @return json
     */
    public function index()
    {
        $settings = DB::table('settings')->where('id', 1)->first();
        return(response()->json($settings));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // Validate form
        $validate_form = $request->validate([
            'title'       => 'required|max:50|min:2',
            'subtitle'    => 'required|max:100|min:5',
            'about'       => 'required|max:1500|min:5',
            'home_photo'  => 'mimes:jpeg,jpg,png,gif|max:10000',
            'about_photo' => 'mimes:jpeg,jpg,png,gif|max:10000',
        ]);

        if($validate_form) {
            $input = $request->all();
            $settings = DB::table('settings')->where('id', 1)->first();

            if(isset($input['home_photo'])) {
                $photo = Image::make($input['home_photo']->getRealPath());

                // Delete old photo
                unlink($this->direct_path . $settings->home_photo);

                // Upload new home_photo
                $home_photo = 'home-' . date('Ymdhis') .'.jpg';
                $photo->save($this->direct_path . $home_photo);

                // Update database
                DB::table('settings')->updateOrInsert(
                    ['id' => 1],['home_photo' => $home_photo]
                );
            }
            if(isset($input['about_photo'])) {
                $photo = Image::make($input['about_photo']->getRealPath());

                // Delete old photo
                unlink($this->direct_path . $settings->about_photo);

                // Upload about_photo
                $about_photo = 'about-' . date('Ymdhis') .'.jpg';
                $photo->save($this->direct_path . $about_photo);

                // Update database
                DB::table('settings')->updateOrInsert(
                    ['id' => 1],['about_photo' => $about_photo]
                );
            }

            // Update database
            DB::table('settings')->updateOrInsert(
                ['id' => 1],
                [
                    'title'      => $input['title'],
                    'subtitle'   => $input['subtitle'],
                    'about'      => $input['about'],
                    'tags'       => $input['tags']
                ]
            );

        }
    }
}
