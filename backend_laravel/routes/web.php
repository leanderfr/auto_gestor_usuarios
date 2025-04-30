<?php



use Illuminate\Support\Facades\Route;
Use App\Http\Controllers\AuthController;



// rotas que iniciam com /auth 
Route::group(['prefix'=>'auth'], function() {

  Route::post('registrar', [AuthController::class, 'registrar']);
  Route::post('login', [AuthController::class, 'login']);
  Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
  Route::get('forms', [AuthController::class, 'forms']);
  //Route::get('verificar', [AuthController::class, 'verificarLogado'])->name('verificarLogado');



    // verifica se ha usuario logado, se sim, retorna string com detalhes do usuario
    // se nao, retorna o formulario de login
//    Route::get('/verificar', [AuthController::class, 'verificarLogado'])->name('verificarLogado');
    //Route::post('/login', [AuthController::class, 'tentarLogin'])->name('tentarLogin');
    //Route::post('/registrar', [AuthController::class, 'novoUsuario'])->name('novoUsuario');

//    Route::get('/ler/', [UsuarioController::class, 'leUsuarioLogado'])->name('leUsuarioLogado');
    //Route::get('/logar', [UsuarioController::class, 'gravaUsuarioLogado'])->name('gravaUsuarioLogado');


}   );






//Route::get('/register', [AuthController::class, 'showRegister'])->name('show.register');
//Route::get('/login', [AuthController::class, 'showLogin'])->name('show.login');

//Route::get('/teste', [AuthController::class, 'teste'])->name('show.teste');

//Route::get('/verifica', [AuthController::class, 'verifica'])->name('verifica');

//Route::post('/register', [AuthController::class, 'register'])->name('register');


?>
