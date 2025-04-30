<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UsuariosController extends Controller
{
 
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
  public function editar(Request $request) {
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
      $gravouOk = User::where('id', $request->route('id'))->update($regOK);

      return $gravouOk;
  }


  // *************************************************************************************************************
  // *************************************************************************************************************
  public function excluir(Request $request) {

      $excluitOk = User::where('id', $request->route('id'))->delete();

      return $excluitOk;
  }

  // *************************************************************************************************************
  // *************************************************************************************************************
  public function status(Request $request) {

      //$status = User::where('id', $request->route('id'))->delete();

//      $statusMudou = User::where('id', $request->route('id'))->update( ['ativo' => DB::raw('! ativo')] );

      $statusMudou = DB::statement('UPDATE users SET ativo = ! ifnull(ativo, 0) WHERE id = '.$request->route('id'));

      return $statusMudou;
  }




}
