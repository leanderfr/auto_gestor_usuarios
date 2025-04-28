<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    

    // ****************************************************************************************
    // verifica se ha usuario logado
    // ****************************************************************************************
    public function verificarLogado  () {
      if (Auth::check()) { 
        $detalhesUsuario = Auth::user()->name . ';' . csrf_token() ;

        return response($detalhesUsuario, 200)
			    ->header('Content-Type', 'text/plain');
      }

      else {
        return view('auth.form_login');
      }
    }


    // ****************************************************************************************
    // tenta login baseado no email e senha recebidos do front
    // ****************************************************************************************
    public function tentarLogin  () {

        return view('auth.teste');
    }








    public function showRegister() {
      return view('auth.register');
    }

    public function showLogin() {
      return view('auth.login');
    }

    public function teste() {
      return view('auth.teste');
    }


    public function register(Request $request) {

//dd('ljkdsljkdsljk');

      $validated = $request->validate( [
        'name' => 'required|string',
        'email' => 'required|email',
        'password' => 'required|string'
      ]);
      
     
       $user = User::create($validated);
        Auth::login($user);


      return view('auth.teste');
    }

    public function verifica(Request $request) {
      if (Auth::check()) 
        dd('logado!!!');
      else 
        dd('NAO logado!!!');
    }


}
