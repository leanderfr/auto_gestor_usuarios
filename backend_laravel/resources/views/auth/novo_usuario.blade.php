

 <!-- 
  ************************************************************************************************
  necessario colocar CSS puro porque o HTML sera lido/processado pelo front end (react)
  qualquer classe criada aqui no backend nao sera entendida no front

  o certo seria concentrar formularios e css no front, e transferir somente json para o front, 
  mas estou gerando form no back  para demonstrar que conheco laravel/blade
  ************************************************************************************************
-->

  <div style='width: 500px; display: flex; flex-direction: column; gap: 10px; ' >

    <span style='font-weight:bold;font-size:18px;padding-bottom: 20px '>
      Novo Usuário
    </span>

    <div style='display: flex; flex-direction: column; gap: 2px ' >
      <div>Nome:</div>
      <input type='text' id='name'  style='padding: 5px' autocomplete="off"  />
    </div>

    <div style='display: flex; flex-direction: column; gap: 5px;padding-bottom: 20px; padding: 2px ' >
      <div>E-mail:</div>
      <input type='text' id='email' style='padding: 5px ' autocomplete="off"  />
    </div>

    <div style='display: flex; flex-direction: column; gap: 5px;padding-bottom: 20px; padding: 2px ' >
      <div>Senha:</div>
      <input type='password' id='password' style='padding: 5px ' autocomplete="off" />
    </div>

    <div style='display: flex; flex-direction: column; gap: 5px;; padding: 2px ' >
      <div>Confirme a Senha:</div>
      <input type='password' id='password_confirmation' style='padding: 5px ' autocomplete="off" />
    </div>

    <!-- as classes abaixo estao disponivel no .CSS do front -->
    <div style = "display: flex; flex-direction: row; gap: 20px; width: 100%; margin-bottom: 20px">
        <span style='  padding-top: 7px; width: 120px; '>Administrador</span>
        <label for="chkAdministrador" class="switch_prettier"  >
          <input id="chkAdministrador" type="checkbox"   />
          <span class="slider_prettier round"></span>
        </label>
    </div>



    <button style='background-color: #e6e6e6; color:black; text-align:center; width: 100px; height: 30px; border-radius: 5px; border: 1px solid transparent'  
        onmouseenter="this.style.border='solid 2px gray'"   
        onmouseleave="this.style.border='solid 2px transparent'"         > 
      Registrar
    </button>


  </div>

