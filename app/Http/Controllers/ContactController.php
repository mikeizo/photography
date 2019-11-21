<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactEmail;
use Validator;

class ContactController extends Controller
{

    /**
     * Contact form handler and validation
     * @return  json
     */
    public function index(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|max:50|min:2',
            'email' => 'required|email',
            'comments' => 'nullable|max:500'
        ]);

        if($validate) {
            // Send notification email
            Mail::to(env('MAIL_TO_ADDRESS'))->send(new ContactEmail($request));
        }
    }
}
