
import '../css/index.css';
import ItemMenu from './ItemMenu.jsx';
import { useContext } from 'react';
import {  ContextoCompartilhado } from './Main.jsx';



function MenuLateral( props ) {

  // expressions só poderá ser usada quando Main.jsx enviar seu conteudo diferente de 'null'
  let { _itemMenuAtual, infoUsuarioLogado }  = useContext(ContextoCompartilhado);  

  return (

    <>
      {/* logotipo AutoGestor */}
      <div className='logoAutoGestor'>
        <img src='images/logo_autogestor.svg' alt='' style={{ width: '150px', paddingTop: '10px'}} />
        <div style={{  display: 'flex', flexDirection: 'column', alignItems : 'flex-start', width: '100%' }}>
            <span >Permissões Usuário</span>
            <span >Desenvolvido por: Leander Früchting</span>
        </div>
      </div>
        

      {/* opcoes que so administrador tem */}
      { props.infoUsuarioLogado.administrador && 
         <ItemMenu id='itemMenuUsuarios' text='Usuários'  /> 
      } 

      {/* opcoes de usuario comum e suas permissoes */}
      { ! props.infoUsuarioLogado.administrador && props.infoUsuarioLogado.gestao_produtos && <ItemMenu id='itemMenuProdutos' text='Produtos' /> }
      { ! props.infoUsuarioLogado.administrador && props.infoUsuarioLogado.gestao_categorias && <ItemMenu id='itemMenuCategorias' text='Categorias' />  }
      { ! props.infoUsuarioLogado.administrador && props.infoUsuarioLogado.gestao_marcas && <ItemMenu id='itemMenuMarcas' text='Marcas' /> }

    </>        
  );
}

export default MenuLateral;
