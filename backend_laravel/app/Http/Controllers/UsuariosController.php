<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;


class UsuariosController extends Controller implements HasMiddleware

{

  // *************************************************************************************************************
  // Middleware('auth:sanctum') define que para executar qq funcao abaixo , é necessario estar logado
  // funcoes definidas em except, nao precisa
  // *************************************************************************************************************

  public static function middleware() 
  {
    // funcoes que nao ha necessidade de ser usuario logado para executar
    return [
      new Middleware('auth:sanctum')->except(['lista', 'exibir'])
    ];
  }



  // *************************************************************************************************************
  // *************************************************************************************************************
  public function lista() {
      return  User::all();
  }

  // *************************************************************************************************************
  // *************************************************************************************************************
  public function exibir($id) {
    return User::findOrFail($id);
  }

  // *************************************************************************************************************
  // *************************************************************************************************************
  public function editar(User $usuario, Request $request) {

      // exige que seja administrator para alterar status
      if (! $request->user()->administrador) return response()->json(['result' => 'Não autorizado.'],403);

      $erros = [   
          'name' => 'Nome precisa ter entre 3 e 150 caracteres',
      ];
      $camposGravar =  [
        'name' => 'required|string|max:150|min:3',
        'administrador' => '',
        'gestao_produtos' => '',
        'gestao_categorias' => '',
        'gestao_marcas' => '',
      ];

      $regOK = $request->validate($camposGravar, $erros);
      User::where('id', $request->route('id'))->update($regOK);

      return 'Usuário alterado com sucesso.';
  }


  // *************************************************************************************************************
  // *************************************************************************************************************
  public function excluir(Request $request) {

      // exige que seja administrator para excluir usuario
      if (! $request->user()->administrador) return response()->json(['result' => 'Não autorizado.'],403);
  
      User::where('id', $request->route('id'))->delete();

      return 'Usuário excluído com sucesso.';
  }

  // *************************************************************************************************************
  // *************************************************************************************************************
  public function status(Request $request) {

      // exige que seja administrator para alterar status
      if (! $request->user()->administrador) return response()->json(['result' => 'Não autorizado.'],403);
  
      DB::statement('UPDATE users SET ativo = ! ifnull(ativo, 0) WHERE id = '.$request->route('id'));

      return 'Status alterado com sucesso.';
  }




}
