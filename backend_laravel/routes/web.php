<?php



use Illuminate\Support\Facades\Route;
Use App\Http\Controllers\AuthController;


// rotas que iniciam com /auth 
Route::group(['prefix'=>'auth'], function(){
    // verifica se ha usuario logado, se sim, retorna string com detalhes do usuario
    // se nao, retorna o formulario de login
    Route::get('/verificar', [AuthController::class, 'verificarLogado'])->name('verificarLogado');
    Route::post('/login', [AuthController::class, 'tentarLogin'])->name('tentarLogin');
});

Route::get('/register', [AuthController::class, 'showRegister'])->name('show.register');




Route::get('/register', [AuthController::class, 'showRegister'])->name('show.register');
//Route::get('/login', [AuthController::class, 'showLogin'])->name('show.login');

Route::get('/teste', [AuthController::class, 'teste'])->name('show.teste');

Route::get('/verifica', [AuthController::class, 'verifica'])->name('verifica');

Route::post('/register', [AuthController::class, 'register'])->name('register');

Route::get('/', function () {
    return view('welcome');
});

?>
