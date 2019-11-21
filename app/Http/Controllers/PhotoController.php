<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\Photo;
use Image;


class PhotoController extends Controller
{

    public function __construct()
    {
        $this->file_path = '/img/photos/';
        $this->direct_path = base_path('frontend/static/img/photos/');
    }

    /**
     * Admin Photos with categories
     * @return json
     */
    public function index(Request $request)
    {
        $category = $request->query('cat');
        $index = 0;
        $images = array();

        // Search by category
        if($category) {
            $photos = Photo::whereHas('categories', function (Builder $query) use ($category) {
                $query->where('category_id', $category);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        }
        else {
            $photos = Photo::orderBy('created_at', 'desc')->get();
        }

        // Format
        foreach($photos as $photo) {
            $images[$index] = array(
                'id'        => $photo->id,
                'filename'  => $photo->filename,
                'thumb'     => $this->file_path . 'thumbs/' . $photo->filename,
                'src'       => $this->file_path . $photo->filename,
                'title'     => $photo->title,
                'categories'=> $photo->categories
            );
            $index++;
        }

        return($images);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $files = $request->file('photos');

        // Validate form
        $messages = ["photos.max" => "Max limit of 30 files can be uploaded at one time"];
        $validate_form = $request->validate([
            'photos'=> 'required|max:30',
            'photos.*'=> 'mimes:jpeg,jpg,png,gif|max:10000',
        ], $messages);

        if($validate_form) {
            foreach($files as $file){
                $filename = $file->getClientOriginalName();

                // Create new image instance
                $photo = Image::make($file->getRealPath());

                // Upload photos
                $filename = $this->create_filename($photo, $filename);

                // Store in DB
                $photo = new Photo;
                $photo->filename = $filename;
                $photo->save();
            }
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $category_ids = array();
        $photo = Photo::find($id);

        $photo->title = $request->title;
        $photo->save();

        // Add categories
        $photo->categories()->sync($request->categories);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $photo = Photo::find($id);
        // Delete category and photo record
        $photo->categories()->detach();
        $photo->delete();

        // Remove image + thumbnail
        if(file_exists($this->direct_path . $photo->filename)){
            unlink($this->direct_path . $photo->filename);
            unlink($this->direct_path . '/thumbs/' . $photo->filename);
        }

        return($photo);
    }

    /**
     * Remove the multiple resource from storage.
     *
     * @param  array  $photos
     * @return \Illuminate\Http\Response
     */
    public function bulkDestroy(Request $request)
    {
        foreach($request->value as $photo) {
            $delete_arr[] = $photo['id'];

            // Remove image + thumbnail
            if(file_exists($this->direct_path . $photo['filename'])){
                unlink($this->direct_path . $photo['filename']);
                unlink($this->direct_path . '/thumbs/' . $photo['filename']);
            }

            // Delete category and photo record
            $photos = Photo::find($photo['id']);
            $photos->categories()->detach();
        }

        Photo::destroy($delete_arr);
    }

    /**
     * Remove the multiple resource from storage.
     *
     * @param  array  $photos
     * @return \Illuminate\Http\Response
     */
    public function bulkUpdate(Request $request)
    {
        foreach($request->photos as $value) {
           $photo = Photo::find($value['id']);
           $photo->categories()->sync($request->categories);
        }
    }

    /**
     * Upload photos
     * @param  string   $photo
     * @param  string   $filename
     */
    private function create_filename($photo, $filename)
    {
        // Format filename
        //$filename = strtolower(preg_replace('/[\W]/', '_', $filename));

        // Checking if file exsists and prevent overwrites
        if(file_exists($this->direct_path . $filename)) {
            $file_arr = explode(".", $filename);
            // Add date to new photo
            $filename = $file_arr[0] . '_' . date('ymdhisu') . '.' . $file_arr[1];
        }
        // Convert to lowercase and replace blank spaces
        $filename = strtolower(str_replace(' ', '_', $filename));

        // Resize photo
        $photo->resize(800, 1000, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // Save photo
        $photo->save($this->direct_path . $filename);

        // Resize and save thumbnail
        $photo->fit(400);
        $photo->save($this->direct_path . 'thumbs/' . $filename);

        return($filename);
    }

}
