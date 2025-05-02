# Instalando Teste Proposto por AutoGestor
# Gerente de Permissões de Usuário 

Essa aplicação foi feita em ReactJs e Laravel, front e back foram colocados no mesmo projeto mas rodam em containers diferentes, mesma URL mas cada um em sua porta. O link inicial é=<br>  
<a href="http://ec2-54-233-183-5.sa-east-1.compute.amazonaws.com:3001/" target="_blank">
    <span style='font-size:20px'>http://ec2-54-233-183-5.sa-east-1.compute.amazonaws.com:3001/</span>
</a>

## Executando localmente:

Para clonar o projeto localmente, estando no BASH, em uma pasta com permissão para gravação, execute:

### `https://github.com/leanderfr/auto_gestor_usuarios.git`

Na sequência, entre na pasta que foi criada:

### `cd auto_gestor_usuarios`

Você verá 2 pastas, a do front e a do back end. Em princípio é necessário instalar as dependências só do front (explicação mais abaixo). 
Para isso, execute os comandos na sequência:

### `cd frontend_react/`
### `npm install`
### `cd ..`

Os 3 comandos abaixo não são necessários, isso porque:

Apesar de exigir os 2 lados funcionando (front a back), o backend ja esta containerizado na AWS e o front end usa, referencia internamente o backend da AWS.  

Não há necessidade de executá-lo localmente, mas seu código fonte esta disponível na pasta 'backend_laravel' ao clonar o projeto.

Se você fizer questão de executar o back localmente, será necessário referenciá-lo no front, caso faça questão disso, altere no arquivo:

./auto_gestor_usuarios/frontend_react/src/layout/Main.jsx   

a linha:

export const backendUrl = 'http://ec2-54-233-183-5.sa-east-1.compute.amazonaws.com:8001'

para:

export const backendUrl = 'http://127.0.0.1:8000'

Comandos OPCIONAIS para executar back localmente: 

### `cd backend_laravel/`
### `npm install`
### `cd ..`

Quanto à base de dados, apesar dos scripts SQL estarem disponíveis no projeto, não é preciso fazer o migrate, a base já está na internet e com registros exemplo criados.

Subindo só o front end a aplicação já funciona localmente, se você executou 'cd ..' por último, já deve estar na pasta do projeto. Basta executar o front end agora, digitando:

### `./front.sh`

Se tudo funcionou até aqui, agora abasta abrir o navegador e acessar o link criado localmente:

[http://127.0.0.1:3000/](http://127.0.0.1:3000/)
<br><br><br>
Para testar a aplicação, crie usuário novo ou utilize para teste usuários já criados:

Usuário administrador:    login:   admin@a.com         senha= 111

Usuário não administrador:    login:   comum@a.com         senha= 111
<br><br>
### Observação:  
A aplicação pode parecer lenta, isso é devido ao fato de estar hospedada na categoria free-tier, da AWS, por ser gratuita, não é a melhor infraestrutura de servidores, pode apresentar lentidão, mas funciona.  (A base de dados também está na AWS RDS)