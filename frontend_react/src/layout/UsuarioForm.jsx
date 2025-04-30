
import '../css/index.css';
import {  useEffect } from 'react';
import {  backendUrl } from './Main.jsx';
import $ from 'jquery'

// useState de 'Aminadav Glickshtein' permite 3o parametro para obter estado atual da variavel
// fazer isso com useState padrao do react é muito complicado
import useState from 'react-usestateref'

import { preparaAnimacaoCarregando, mensagemRolante  } from '../js/utils.js';

function UsuarioForm( props )    {
    
    // contem o html o form atual
    let [usuario, setUsuario, getUsuario] = useState(null)

    // obtem detalhes sobre qual registro editar
    const {operacao, registroId, tabela} = props;

    //********************************************************************************************
    //********************************************************************************************
    const ajuda = () => {
      mensagemRolante('Algum texto informativo aqui...', 2000)
    }

    //********************************************************************************************
    //********************************************************************************************
    const salvarUsuario = async () => {
        props.setCarregando(true)

        fetch(`${backendUrl}/usuarios/${registroId}`, { 
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify( {name: $('#txtNome').val()} )  
        })
        .then((response) => response.json())
        .then((resposta) => {
          props.setCarregando(false)

          // deve haver um jeito mais inteligente de exibir o erro abaixo, mas sao 01:08 da manha, vai usando IF mesmo 
          let erro = ''
          if (typeof resposta.errors!='undefined') {
              if (typeof resposta.errors.name!='undefined') erro = resposta.errors.name;
          }

          if (erro!=='')  {
            mensagemRolante(erro, 3000)          
          }  
          else {
            props.fecharFormCrud()
            props.setRegistros(null)  // força reload da datatable
          }
 
        })
        .catch((error) => console.log('erro='+error))
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
            'Content-Type': 'application/json'
          },
        })
        .then((response) => response.text())
        .then((resposta) => {
          props.setCarregando(false)

          props.fecharFormCrud()
          props.setRegistros(null)  // força reload da datatable
        })
        .catch((error) => console.log('erro='+error))

    }


    //********************************************************************************************
    // carrega html do formulario
    //********************************************************************************************
    const fetchUsuario = async () =>  {
        // monta formulario
        fetch(`${backendUrl}/usuarios/${registroId}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
            setTimeout(() => {
              setUsuario(data)  

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
        preparaAnimacaoCarregando()

        // carrega dados do usuario atual
        // força 1/2 segundo de parada para que usuario perceba que esta recarregando
        if ( getUsuario.current == null )    
          props.setCarregando(true)

          setTimeout(() => {
            fetchUsuario()    
          }, 500);
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
      <div  class="flex flex-col w-[70%] max-w-[1200px] overflow-hidden pt-8 font-Roboto"  id='recordForm'>


          {/* form edicao  */}
          <div  class="flex flex-col w-full bg-white relative rounded-lg"  >

              {/* titulo e botao fechar */}
              <div id='divWINDOW_TOP'>
                
                <div id='divWINDOW_TITLE'>
                  { operacao==='post' && 'Novo Usuário' }
                  { operacao==='patch' && 'Editar Usuário' }
                  { operacao==='delete' && 'Excluir Usuário' }
                </div>

                <div class='flex flex-row '>
                    <div class='divWINDOW_BUTTON mr-2'  aria-hidden="true" onClick={ () => {ajuda()}} >
                      &nbsp;&nbsp;[ ? ]&nbsp;&nbsp;
                    </div>

                    <div class='divWINDOW_BUTTON mr-6'  onClick={props.fecharFormCrud} aria-hidden="true" >
                      &nbsp;&nbsp;[ X ]&nbsp;&nbsp;
                    </div>
                </div>
              
              </div>

              {/* campos  do formulario */}
              <div class="flex flex-col w-full h-auto pr-12 pl-6 pt-8 pb-14" >

                <div class="flex flex-row w-full gap-5">

                  <div class="flex flex-col w-full">
                    <div class="flex flex-row w-full "> 
                        <div style={{paddingTop:'3px'}} >Nome:</div>  
                        <div class='flex grow'>
                          { operacao=='delete' &&
                            <span class='span_formFieldValue' id='txtNome'>{ usuario.name }</span> }
                          { operacao!='delete' && 
                            <input 
                                type="text" 
                                autoComplete="off" 
                                maxLength='50' 
                                minLength='3' 
                                id="txtNome"                                 
                                defaultValue={ usuario.name }  
                                onFocus={(e)=>{e.target.select()}}
                                class='text_formFieldValue'  />
                          }                                
                        </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* botoes salvar/sair */}
              <div class="flex flex-row w-full justify-between px-6 border-t-[1px] border-t-gray-300 py-2">
                <button  id="btnCLOSE" class="btnCANCEL" onClick={props.fecharFormCrud} >Cancelar</button>

                { operacao=='delete' && 
                  <button  id="btnDELETE" class="btnDELETE" onClick={()=>{excluirUsuario()}} aria-hidden="true">Excluir</button> }

                { operacao!=='delete' && 
                  <button  id="btnSAVE" class="btnSAVE" onClick={()=>{salvarUsuario()}} aria-hidden="true">Salvar</button> }

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
