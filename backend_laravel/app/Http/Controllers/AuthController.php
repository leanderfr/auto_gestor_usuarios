<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class AuthController extends Controller implements HasMiddleware
{

  // *************************************************************************************************************
  // Middleware('auth:sanctum') define que para executar qq funcao abaixo , é necessario estar logado
  // funcoes definidas em except, nao precisa
  // *************************************************************************************************************

  public static function middleware() 
  {
    return [
      new Middleware('auth:sanctum')->except(['index', 'login', 'logout', 'forms', 'registrar'])
    ];
  }

  // *************************************************************************************************************
  // *************************************************************************************************************

  public function registrar(Request $request) {
      $erros = [   
          'email.required' => 'Preencha o email',
          'email.email' => 'Email não está em um formato correto',
          'email.unique' => 'Email já cadastrado, use o formulário de login',
          'email' => 'Email precisa ter entre 3 e 150 caracteres',
          'password.min' => 'A senha precisa ter entre 3 e 50 caracteres',
          'password.max' => 'A senha precisa ter entre 3 e 50 caracteres',
          'password.required' => 'Preencha a senha',
          'password.confirmed' => 'A senha não confirma',
          'name' => 'Nome precisa ter entre 3 e 150 caracteres',
      ];
      $verificar =  [
        'name' => 'required|string|max:150|min:3',
        'email' => 'required|string|max:150|min:3',
        'email' => 'required|email|string|unique:users|max:150', 
        'password' => 'required|string|min:3|max:50|confirmed'
      ];

      $regOK = $request->validate($verificar, $erros);
      $usuario = User::create($regOK);

      // cria token que sera enviado pelo front a cada requisicao do usuario criado
      $token = $usuario->createToken($request->name);
 
      // devolve token para react usa lo nas requisicoes que exigem usuario logado
      return [
        'token' => $token->plainTextToken,
        'usuario' => $usuario,
      ]; 
  }

  // *************************************************************************************************************
  // *************************************************************************************************************

  public function login(Request $request) {
      $erros = [   
          'email.required' => 'Preencha o email',
          'email.exists' => 'Não há usuário cadastrado com este email',
          'password.required' => 'Preencha a senha',
      ];
      $verificar =  [
        'email' => 'required|email|string|exists:users', 
        'password' => 'required|string'
      ];
      $request->validate($verificar, $erros);

      $usuario = User::where('email', $request->email)->first();

      // verifica usuario existe com o email e senha ok
      if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
        return( [
          'erro' => 'Erro ao autenticar'
        ]);
      }

      // cria token que sera enviado pelo front a cada requisicao do usuario logado
      $token = $usuario->createToken($usuario->name);
 
      // devolve token para react usa lo nas requisicoes que exigem usuario logado
      return [
        'token' => $token->plainTextToken,
        'usuario' => $usuario,
      ]; 



  }

  // *************************************************************************************************************
  // *************************************************************************************************************

  public function logout(Request $request) {    
    $request->user()->tokens()->delete();

    return( 'Você foi deslogado com sucesso!' );  
  }

  // *************************************************************************************************************
  // administrador estara alterando usuario, nao exige senha nesse momento
  // *************************************************************************************************************
  public function update(Request $request, User $user) {    

      // regra para que somente administrator altere usuario
      Gate::authorize('alterarUsuario', $user);
      $erros = [   
          'email.required' => 'Preencha o email',
          'email.email' => 'Email não está em um formato correto',
          'email.unique' => 'Email já cadastrado, use o formulário de login',
          'email' => 'Email precisa ter entre 3 e 150 caracteres',
      ];
      $verificar =  [
        'email' => 'required|string|max:150|min:3',
        'email' => 'required|email|string|unique:users|max:150', 
        'password' => 'required|string|min:3|max:50|confirmed'
      ];


      return( [
          'erro' => 'Você foi deslogado'
        ]);
  }

  // *************************************************************************************************************
  // obtem html dos forms de login e registro (novo usuario)  
  // fazendo isso para provar que conheco Blade, o certo seria ter estes forms no front
  // *************************************************************************************************************

  public function forms(Request $request) {    

      // concatena HTML dos forms login e registro (novo usuario)
      $htmlFormLogin = view('auth.form_login')->render();
      $htmlFormRegistro = view('auth.form_novo_usuario')->render();

      // quem separa as informacoes é a string '|||'
      return response("$htmlFormLogin|||$htmlFormRegistro", 200)
        ->header('Content-Type', 'text/plain');

  }






}
