
import '../css/index.css';
import ItemMenu from './ItemMenu.jsx';
import { useContext } from 'react';
import {  ContextoCompartilhado } from './Main.jsx';



function MenuLateral() {

  // expressions só poderá ser usada quando Main.jsx enviar seu conteudo diferente de 'null'
  let { _expressions }  = useContext(ContextoCompartilhado);  

  return (

    <>
      <div className='logoAutoGestor'>
        <img src='images/logo_autogestor.svg' alt='' style={{ width: '150px', paddingTop: '10px'}} />
        <div style={{  display: 'flex', flexDirection: 'column', alignItems : 'flex-start', width: '100%' }}>
            <span >Permissões Usuário</span>
            <span >Desenvolvido por: Leander Früchting</span>
        </div>
      </div>

      { _expressions!=null && <ItemMenu id='itemMenuDevelopers' text={_expressions.developers}  /> } 
      { _expressions!=null && <ItemMenu id='itemMenuLanguages' text={_expressions.languages} /> } 
    </>        
  );
}

export default MenuLateral;
