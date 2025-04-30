<?php


use Illuminate\Support\Facades\Route;
Use App\Http\Controllers\AuthController;
Use App\Http\Controllers\UsuariosController;

// ****************************************************************************
// rotas que iniciam com /auth 
// ****************************************************************************

Route::group(['prefix'=>'auth'], function() {

  //  criacao novo usuario usando form 'Registrar'
  Route::post('registrar', [AuthController::class, 'registrar']);

  // login   
  Route::post('login', [AuthController::class, 'login']);

  // logout, so pode ser feito por pessoa logada
  //Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
  Route::post('logout', [AuthController::class, 'logout']);

  // carrega forms em formato html, o certo seria manter forms no frontend, mas gerando forms via bacnend (blade) 
  // para demonstrar que conheco laravel
  Route::get('forms', [AuthController::class, 'forms']);
});

// ****************************************************************************
// rotas que iniciam com /usuarios
// ****************************************************************************
Route::group(['prefix'=>'usuarios'], function() {

  // lista  usuarios na datatable do front
  Route::get('lista', [UsuariosController::class, 'lista']);

  // obtem registro de usuario
  Route::get('/{id}', [UsuariosController::class, 'exibir']);

  // edita usuario existente
  Route::post('/{id}', [UsuariosController::class, 'editar']);

  // excliui usuario existente
  Route::delete('/{id}', [UsuariosController::class, 'excluir']);

  // alterna status do usuario
  Route::patch('/status/{id}', [UsuariosController::class, 'status']);



});




?>
