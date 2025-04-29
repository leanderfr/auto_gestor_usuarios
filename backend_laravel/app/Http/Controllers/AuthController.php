<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    
    // ****************************************************************************************
    // verifica se ha usuario logado e retorna seus dados
    // alem disso, retorna o HTML do form de login e de registro  (novo usuario)
    // para que o frontend tenha disponivel caso precise
    // ****************************************************************************************
    public function verificarLogado  () {
      $detalhesUsuario = '';
      if (Auth::check()) { 
        $detalhesUsuario = Auth::user()->name . ';' . csrf_token() ;
      }

      // concatena HTML dos forms login e registro (novo usuario)
      $htmlFormLogin = view('auth.form_login')->render();
      $htmlFormRegistro = view('auth.form_novo_usuario')->render();

      // quem separa as informacoes é a string '|||'
      return response($detalhesUsuario . '|||'. $htmlFormLogin . '|||' . $htmlFormRegistro, 200)
        ->header('Content-Type', 'text/plain');

    }


    // ****************************************************************************************
    // tenta login baseado no email e senha recebidos do front
    // ****************************************************************************************
    public function tentarLogin ()  {
        return view('auth.teste');
    }



    // ****************************************************************************************
    // verifica se informacao enviada pelo front ok e caso positivo, registra novo usuario
    // ****************************************************************************************
    public function novoUsuario  (Request $request) {

      $erros = [
          'email' => 'Email não está em um formato correto',
          'nome' => 'Nome precisa ter entre 3 e 150 caracteres',
          'senha.min' => 'A senha precisa ter entre 3 e 50 caracteres',
          'senha.max' => 'A senha precisa ter entre 3 e 50 caracteres',
          'senha.required' => 'Preencha a senha',
          'senha.confirmed' => 'A senha não confirma',
      ];
      $verificar =  [
        'nome' => 'required|string|max:150|min:3',
        'email' => 'required|email|string|unique:users|max:150',
        'senha' => 'required|string|min:3|max:50|confirmed'
      ];

      $regUsuarioTestado = $request->validate($verificar, $erros);

      $novoUsuario = User::create( $regUsuarioTestado );

      Auth::login( $novoUsuario );

      // quem separa as informacoes é a string '|||'
      return response($regUsuarioTestado .'--'. $novoUsuario, 200)
        ->header('Content-Type', 'text/plain');


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
