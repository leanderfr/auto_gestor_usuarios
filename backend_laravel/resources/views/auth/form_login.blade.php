

 <!-- 
  ************************************************************************************************
  necessario colocar CSS puro porque o HTML sera lido/processado pelo front end (react)
  qualquer classe criada aqui no backend nao sera entendida no front
  ************************************************************************************************
-->

  <div style='width: 500px; display: flex; flex-direction: column; gap: 10px ' >

    <span style='font-weight:bold;font-size:18px;padding-bottom: 20px '>
      Login
    </span>

    <div style='display: flex; flex-direction: column; gap: 2px ' >
      <div>E-mail:</div>
      <input type='text' id='email'  style='padding: 5px ' autocomplete="off" />
      </div>

    <div style='display: flex; flex-direction: column; gap: 5px;margin-bottom: 20px; padding: 2px ' >
      <div>Senha:</div>
      <input type='password' id='password' style='padding: 5px ' autocomplete="off" />
    </div>

    <button style='background-color: #e6e6e6; color:black; text-align:center; width: 100px; height: 30px; border-radius: 5px; border: 1px solid transparent'  
        onmouseenter="this.style.border='solid 2px gray'"   
        onmouseleave="this.style.border='solid 2px transparent'"     > 
      Logar
    </button>

  </div>

