
import '../css/index.css';
import {  useEffect } from 'react';
import {  backendUrl } from './Main.jsx';
import $ from 'jquery'

// useState de 'Aminadav Glickshtein' permite 3o parametro para obter estado atual da variavel
// fazer isso com useState padrao do react é muito complicado
import useState from 'react-usestateref'

import { mensagemRolante  } from '../js/utils.js';

function UsuarioForm( props )    {
    
    // contem o html o form atual
    let [usuario, setUsuario, getUsuario] = useState(null)

    // obtem detalhes sobre qual registro editar
    const {operacao, registroId} = props;

    // controla se  a flag Administrator esta ligada, caso esteja , desabilita flags Produtos, Categorias, Marcas
    let [flagAdmin, setFlagAdmin, getFlagAdmin] = useState(false)


    //********************************************************************************************
    //********************************************************************************************
    const ajuda = () => {
      mensagemRolante('Algum texto informativo aqui...', 2000)
    }

    //********************************************************************************************
    //********************************************************************************************
    const salvarUsuario = async () => {

        if (props.getInfoUsuarioLogado.current.id == registroId)  {
          mensagemRolante("Você não pode alterar o usuário atualmente logado", 3000)          
          return;
        }

        props.setCarregando(true)

        fetch(`${backendUrl}/usuarios/${registroId}`, { 
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ props.getInfoUsuarioLogado.current.token,  
          },
          body: JSON.stringify( {
            name: $('#txtNome').val(),
            administrador: $("#chkAdministrador").is(':checked'),
            gestao_produtos: $("#chkProdutos").is(':checked'),
            gestao_marcas: $("#chkMarcas").is(':checked'),
            gestao_categorias: $("#chkCategorias").is(':checked'),
          } )  
        })
        .then((response) => {
          props.setCarregando(false)

          if (!response.ok) {
            throw new Error(`Erro ao excluir usuário, código erro= ${response.status}`);
          }
          return response.text(); 
        })  
        .then((resposta) => {
          mensagemRolante(resposta, 2000);
          
          props.fecharFormCrud()
          props.setRegistros(null)  // força reload da datatable
 
        })
        .catch((error) => mensagemRolante(error, 2000));
    }

    //********************************************************************************************
    //********************************************************************************************

    const flagAdminMudou = (e) => {
      // qddo chega aqui, e.target.checked ja esta com vlr novo
      setFlagAdmin( e.target.checked );                           

      if ( e.target.checked ) {
        $('#chkProdutos').prop("checked", false);
        $('#chkMarcas').prop("checked", false);
        $('#chkCategorias').prop("checked", false);
        $('#chkProdutos').prop("disabled", true);
        $('#chkMarcas').prop("disabled", true);
        $('#chkCategorias').prop("disabled", true);
      } else {
        $('#chkProdutos').prop("disabled", false);
        $('#chkMarcas').prop("disabled", false);
        $('#chkCategorias').prop("disabled", false);
      }

    }


    //********************************************************************************************
    //********************************************************************************************
    const excluirUsuario = async () => {

        if (props.getInfoUsuarioLogado.current.id == registroId)  {
         mensagemRolante("Você não pode excluir o usuário atualmente logado", 3000)          
          return;
        }
        props.setCarregando(true)

        fetch(`${backendUrl}/usuarios/${registroId}`, { 
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ props.getInfoUsuarioLogado.current.token,
          },
        })
        .then((response) => {
            props.setCarregando(false)

            if (!response.ok) {
              throw new Error(`Erro ao excluir usuário, código erro= ${response.status}`);
            }
            return response.text(); 
        })

        .then((resposta) => {          
          mensagemRolante(resposta, 2000);

          props.fecharFormCrud()
          props.setRegistros(null)  // força reload da datatable

        })
        .catch((error) => mensagemRolante(error, 2000));


    }

    //********************************************************************************************
    // carrega html do formulario
    //********************************************************************************************
    const fetchUsuario = async () =>  {
        // monta formulario
        fetch(`${backendUrl}/usuarios/${registroId}`, { method: "GET" })
        .then((response) => response.json())
        .then((usuario) => {
            setTimeout(() => {
              setUsuario(usuario)  
              setFlagAdmin(usuario.administrador)  
              
              setTimeout(() => {
                $('#txtNome').focus()
              }, 10);

            }, 500);

          props.setCarregando(false)
          
        })
        .catch((error) => console.log('erro='+error));
    }

    //********************************************************************************************
    //********************************************************************************************
    useEffect( () => {

        // form foi chamado para delete, status ou edit
        if (operacao!=='post')  {
            // carrega dados do usuario atual
            // força 1/2 segundo de parada para que usuario perceba que esta recarregando
            if ( getUsuario.current == null )    
              props.setCarregando(true)

              setTimeout(() => {  
                fetchUsuario()    
              }, 500);
        }

        // form foi chamado para novo registro (post)
        if (operacao==='post')  {
            setUsuario({})
            setTimeout(() => {
              props.setCarregando(false)
            }, 500);
            setTimeout(() => {
              $('#txtNome').focus()
            }, 10);

        }

              


    }, [] )

    //********************************************************************************************
    // fecha form de Crud
    //********************************************************************************************
    const fecharFormCrud = event => {
      // so fecha se clicou no backdrop
      if (event.target === event.currentTarget) props.fecharFormCrud()
    }

    return(

    <>
    { usuario && 
      <div className='panoFundoCinza'  onClick={fecharFormCrud}>     

      {/* container do form edicao */}
      <div  className="flex flex-col w-[70%] max-w-[1200px] overflow-hidden pt-8 font-Roboto"  id='recordForm'>


          {/* form edicao  */}
          <div  className="flex flex-col w-full bg-white relative rounded-lg"  >

              {/* titulo e botao fechar */}
              <div id='divWINDOW_TOP'>
                
                <div id='divWINDOW_TITLE'>
                  { operacao==='post' && 'Novo Usuário' }
                  { operacao==='patch' && 'Editar Usuário' }
                  { operacao==='delete' && 'Excluir Usuário' }
                </div>

                <div className='flex flex-row'>
                    <div className='divWINDOW_BUTTON mr-2'  aria-hidden="true" onClick={ () => {ajuda()}} >
                      &nbsp;&nbsp;[ ? ]&nbsp;&nbsp;
                    </div>

                    <div className='divWINDOW_BUTTON mr-6'  onClick={props.fecharFormCrud} aria-hidden="true" >
                      &nbsp;&nbsp;[ X ]&nbsp;&nbsp;
                    </div>
                </div>
              
              </div>

              {/* campos  do formulario */}
              <div className="flex flex-col w-full h-auto pr-12 pl-6 pt-8 pb-8" >

                <div className="flex flex-row w-full gap-5">

                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full "> 
                        <div style={{paddingTop:'3px'}} >Nome:</div>  
                        <div className='flex grow'>
                          { operacao=='delete' &&
                            <span className='span_formFieldValue' id='txtNome'>{ usuario.name }</span> }
                          { operacao!='delete' && 
                            <input 
                                type="text" 
                                autoComplete="off" 
                                maxLength='50' 
                                minLength='3' 
                                id="txtNome"                                 
                                defaultValue={ usuario.name }  
                                onFocus={(e)=>{e.target.select()}}
                                className='text_formFieldValue'  />
                          }                                
                        </div>
                    </div>
                  </div>

                </div>

                <div className="flex flex-row w-full gap-5 mt-3">
                  <div className="flex flex-row w-full "> 
                    <div style={{paddingTop:'3px'}} >Email:</div>  
                    <div className='flex grow'> 
                        <span className='span_formFieldValue' >{ usuario.email }</span>
                    </div>
                  </div>
                </div>

                <div style = {{  display: 'flex', flexDirection: 'column', gap: '20px' , marginTop: '40px',  width: '100%' }}>
                    <div style = {{  display: 'flex', flexDirection: 'row',  gap: '30px', width: '100%' }}>
                        <span style={{  paddingTop: '7px', width: '200px' }}>Administrador</span>
                        <label htmlFor="chkAdministrador" className="switch_prettier"  >

                          <input id="chkAdministrador" type="checkbox"  defaultChecked={usuario.administrador} 
                            onChange={ (e) => flagAdminMudou(e) }  />

                          <span className="slider_prettier round"></span>
                        </label>
                    </div>

                    <hr /> 


                    <div style = {{  display: 'flex', flexDirection: 'row', gap: '30px', width: '100%' }}
                        className={ flagAdmin ? 'fadeText' : '' }>
                        <span style={{  paddingTop: '7px', width: '200px' }}>Gestão de Produtos</span>
                        <label htmlFor="chkProdutos" className="switch_prettier"  >
                          <input id="chkProdutos" type="checkbox" 
                                defaultChecked= { usuario.gestao_produtos && ! flagAdmin }  
                                disabled= { flagAdmin } />
                          <span className="slider_prettier round"></span>
                        </label>
                    </div>

                    <div style = {{  display: 'flex', flexDirection: 'row',  gap: '30px', width: '100%' }} 
                          className={ flagAdmin ? 'fadeText' : '' }>

                        <span style={{  paddingTop: '7px', width: '200px' }}>Gestão de Marcas</span>
                        <label htmlFor="chkMarcas" className="switch_prettier"  >
                          <input id="chkMarcas" type="checkbox"  
                              defaultChecked= { usuario.gestao_marcas && ! flagAdmin }  
                              disabled= { flagAdmin } />
                          <span className="slider_prettier round"></span>
                        </label>
                    </div>

                    <div style = {{  display: 'flex', flexDirection: 'row',  gap: '30px', width: '100%' }}
                          className={ flagAdmin ? 'fadeText' : '' }>
                        <span style={{  paddingTop: '7px', width: '200px' }}>Gestão de Categorias</span>
                        <label htmlFor="chkCategorias" className="switch_prettier"  >
                          <input id="chkCategorias" type="checkbox" 
                            defaultChecked= { usuario.gestao_categorias && ! flagAdmin } 
                            disabled= { flagAdmin } />
                          <span className="slider_prettier round"></span>
                        </label>
                    </div>


              </div>



              </div>

              {/* botoes salvar/sair */}
              <div className="flex flex-row w-full justify-between px-6 border-t-[1px] border-t-gray-300 py-2">
                <button  id="btnCLOSE" className="btnCANCEL" onClick={props.fecharFormCrud} >Cancelar</button>

                { operacao=='delete' && 
                  <button  id="btnDELETE" className="btnDELETE" onClick={()=>{excluirUsuario()}} aria-hidden="true">Excluir</button> }

                { operacao!=='delete' && 
                  <button  id="btnSAVE" className="btnSAVE" onClick={()=>{salvarUsuario()}} aria-hidden="true">Salvar</button> }

              </div>


          </div> 

      </div> 

      {/* fim pano cinza */}
      </div>   

      }

</>
)  
}

export default UsuarioForm;
