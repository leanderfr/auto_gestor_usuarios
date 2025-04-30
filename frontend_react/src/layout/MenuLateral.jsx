
import '../css/index.css';
import ItemMenu from './ItemMenu.jsx';
import { useContext } from 'react';
import {  ContextoCompartilhado } from './Main.jsx';



function MenuLateral( props ) {

  // expressions só poderá ser usada quando Main.jsx enviar seu conteudo diferente de 'null'
  let { setItemMenuAtual, itemMenuAtual, infoUsuarioLogado }  = useContext(ContextoCompartilhado);  

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
      { props.infoUsuarioLogado.administrador==1 && 
         <ItemMenu itemMenuAtual={itemMenuAtual} id='itemMenuUsuarios' text='Usuários' setItemMenuAtual ={props.setItemMenuAtual}  /> 
      } 

      {/* opcoes de usuario comum e suas permissoes */}
      { ! props.infoUsuarioLogado.administrador && props.infoUsuarioLogado.gestao_produtos &&   
          <ItemMenu itemMenuAtual={itemMenuAtual}  id='itemMenuProdutos' text='Produtos'  setItemMenuAtual ={props.setItemMenuAtual} /> }

      { ! props.infoUsuarioLogado.administrador && props.infoUsuarioLogado.gestao_categorias && 
          <ItemMenu itemMenuAtual={itemMenuAtual}  id='itemMenuCategorias' text='Categorias' setItemMenuAtual ={props.setItemMenuAtual} /> }

      { ! props.infoUsuarioLogado.administrador && props.infoUsuarioLogado.gestao_marcas && 
          <ItemMenu itemMenuAtual={itemMenuAtual}  id='itemMenuMarcas' text='Marcas' setItemMenuAtual ={props.setItemMenuAtual} /> }

    </>        
  );
}

export default MenuLateral;
