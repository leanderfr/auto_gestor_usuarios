<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Users;
use Illuminate\Auth\Access\Response;

class UsersPolicy
{
    public function alterarUsuario(User $user): Response
    {
        return $user->administrador === true
          ? Response::allow() 
          : Response::deny();
    }
}
