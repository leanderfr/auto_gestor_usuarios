<?php


use Illuminate\Support\Facades\Route;
Use App\Http\Controllers\AuthController;


// rotas que iniciam com /auth 
Route::group(['prefix'=>'auth'], function() {

  Route::post('registrar', [AuthController::class, 'registrar']);
  Route::post('login', [AuthController::class, 'login']);
  Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
  Route::get('forms', [AuthController::class, 'forms']);

});


?>
