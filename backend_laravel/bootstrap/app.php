<?php

// permtite APIS da aplicacao front end
// o certo seria definir somente a URL da aplicacao front end definitiva
// mas como o pessoal da AutoGestor pode executar localmente,
// eh necessario liberar acesso a qq URL de frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\Cors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        health: '/up',
    )
    //***********************************************************************************
    // permite acesso do front end que esta em outra aplicacao para validacao de logins
    //***********************************************************************************
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: ["*"]);
        $middleware->append(Cors::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
