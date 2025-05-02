# Instalando AutoGestor <br>Teste Proposto Gerente de Permissões de Usuário 

Essa aplicação foi feita em ReactJs e Laravel, front e back foram colocados no mesmo projeto mas rodam em containers diferentes, mesma URL mas cada um em sua porta. O link inicial é=<br> 
<a href="http://ec2-54-233-183-5.sa-east-1.compute.amazonaws.com:3001/" target="_blank">
    <span style='font-size:20px'>http://ec2-54-233-183-5.sa-east-1.compute.amazonaws.com:3001/</spa>
</a>

## Executando localmente:

Para clonar o projeto localmente, estando no BASH, em uma pasta com permissão para gravação, execute:

### `https://github.com/leanderfr/auto_gestor_usuarios.git`

Na sequência, entre na pasta que foi criada:

### `cd auto_gestor_usuarios`

Você verá 2 pastas, a do front e a do back end. É necessário instalar as dependências de cada uma. Para isso, execute os comandos na sequência:

### `cd frontend_react/`
### `npm install`
### `cd ..`
### `cd backend_laravel/`
### `npm install`
### `cd ..`

Agora, necessário subir (executar) a aplicação - apesar de exigir os 2 lados funcionando (front a back), o backend ja esta disponível na AWS e o front end usa, referencia internamente este backend da AWS.  Não há necessidade de subí-lo, mas seu codigo fonte esta disponivel ao clonar o projeto.

Para referenciar o backend local, é necessário alterar uma variável dentro do front, mas em princípio, não há necessidade disso.

Resumindo, subindo só o front end a aplicação já funciona localmente, para isso, entre novamente na pasta 'auto_gestor_usuarios'

### `cd auto_gestor_usuarios`

Agora suba o front end executando: 

### `./front.sh`

Nesse momento o terminal ficará bloqueado na execução do backend, é melhor assim para que nenhum processo fique sendo executado sem estar sendo notado.
Agora é necessário executar o front, abra nova janela do BASH e entre novamente na pasta 'auto_gestor_usuarios'

### `cd auto_gestor_usuarios`

Se tudo funcionou ok, agora abasta acessar o link criado localmente:

[http://127.0.0.1:3000/](http://127.0.0.1:3000/)



Crie usuário novo ou utilize como teste:

Usuário administrador:    login:   admin@a.com         senha= 111

Usuário não administrador:    login:   comum@a.com         senha= 111

OBSERVAÇÂO:  A aplicação pode parecer lenta, isso é devido ao fato de estar hospedada na categoria free-tier, da AWS, por ser gratuita, não é a melhor infraestrutura de servidores, pode apresentar lentidão, mas funciona.