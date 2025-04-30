
import '../css/index.css';
import {  useEffect } from 'react';
import {  backendUrl } from './Main.jsx';

// useState de 'Aminadav Glickshtein' permite 3o parametro para obter estado atual da variavel
// fazer isso com useState padrao do react é muito complicado
import useState from 'react-usestateref'

import { preparaAnimacaoCarregando  } from '../js/utils.js';


function UsuarioForm( props )    {
    
    // contem o html o form atual
    let [usuario, setUsuario, getUsuario] = useState(null)

    // obtem detalhes sobre qual registro editar
    const {operacao, recordId, tabela} = props;


    // carrega html do formulario
    const fetchUsuario = async () =>  {
        // monta formulario
        fetch(`${backendUrl}/usuarios/${recordId}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
            setTimeout(() => {
            setUsuario(data)  
            }, 500);

          props.setCarregando(false)
        })
        .catch((error) => console.log('erro='+error));
    }

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

    // fecha form de Crud
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
                  { operacao=='post' && 'Novo Usuário' }
                  { operacao=='patch' && 'Editar Usuário' }
                  { operacao=='delete' && 'Excluir Usuário' }
                </div>

                <div class='flex flex-row '>
                    <div class='divWINDOW_BUTTON mr-2'  aria-hidden="true" >
                      &nbsp;&nbsp;[ ? ]&nbsp;&nbsp;
                    </div>

                    <div class='divWINDOW_BUTTON mr-6'  onClick={props.fecharFormCrud} aria-hidden="true" >
                      &nbsp;&nbsp;[ X ]&nbsp;&nbsp;
                    </div>
                </div>
              
              </div>

              {/* campos  do formulario */}
              <div class="flex flex-col w-full h-auto  px-4 mt-6" >

                <div class="flex flex-row w-full gap-5">

                  <div class="flex flex-col w-1/2">
                    <div class="flex flex-col w-full"> 
                        <div>Nome:</div>  
                        <div>
                          { operacao=='delete' &&
                            <span class='span_formFieldValue' id='txtName'>&nbsp;</span> }
                          { operacao!=='delete' && 
                            <input 
                                type="text" 
                                autocomplete="off" 
                                maxlength='50' 
                                minlength='3' 
                                id="txtNome" 
                                defaultValue={ usuario.name }  
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
                  <button  id="btnDELETE" class="btnDELETE" onClick={()=>{}} aria-hidden="true">Excluir</button> }

                { operacao!=='delete' && 
                  <button  id="btnSAVE" class="btnSAVE" onClick={()=>{}} aria-hidden="true">Salvar</button> }

              </div>


          </div> 

      </div> 












            <div className='crudForm'>

                <div className='flex flex-col px-3'>
                  <label htmlFor='txtName'>Nome:</label>
                  <input name='txtName'  />
                </div>

            </div>
        </div>


      }

</>
)  
}

export default UsuarioForm;
