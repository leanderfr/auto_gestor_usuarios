
import { useState, useContext } from 'react';
import '../css/index.css';
import {  ContextoCompartilhado } from './Main.jsx';


// props= recebe funcoes que fazem a comunicacao entre Header.jsx e Main.jsx
// se Main.jsx ainda esta carregando dados, exibe Header.jsx com campos do usuario logado em branco, pois nao logado ainda
function Header( props ) {

  // obtem usuario atualmente logado que foi passado por Main.jsx
  let { nomeUsuarioAtual, tokenUsuarioAtual }  = props;  

/*
  // usuario pediu para se deslogar, invoca funcao de Main.jsx que faz isso 
  const changeBackend = ( backend ) => {
    setCurrentBackend(backend)   // muda visualmente
    setTimeout(() => {
      props.onChangeBackend( backend );  
    }, 100);
    
  };
*/


  return (
    <>

    <div className='color: red, fontSize: 30px'>{ nomeUsuarioAtual  } </div>

    </>
  );
}

export default Header;
