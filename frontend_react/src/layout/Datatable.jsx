
import '../css/index.css';
import {  ContextoCompartilhado, backendUrl } from './Main.jsx';
import {  useContext, useEffect, Fragment } from 'react';
import UsuarioForm from './UsuarioForm.jsx'
import { mensagemRolante  } from '../js/utils.js';

// useState de 'Aminadav Glickshtein' permite 3o parametro para obter estado atual da variavel
// fazer isso com useState padrao do react é muito complicado
import useState from 'react-usestateref'

function Datatable( props ) {

  // expressions (frases) no idioma atual e item do menu lateral que foi clicado
  let { itemMenuAtual }  = useContext(ContextoCompartilhado);  

  // colunas que serao exibidias dependendo da tabela sendo vista (_currentMenuItem)
  let columns = []

  // manipulando tabela de usuarios
  let titulo = ''
  if (itemMenuAtual === 'itemMenuUsuarios')  {
    columns.push({ fieldname: "id", width: "5%", title: 'Id', id: 1, boolean: false },
                { fieldname: "name", width: "calc(35% - 150px)", title: 'Nome', id: 2, boolean: false} ,
                { fieldname: "administrador", width: "15%", title: 'Administrador', id: 3, boolean: true} ,
                { fieldname: "gestao_produtos", width: "15%", title: 'Produtos', id: 4, boolean: true} ,
                { fieldname: "gestao_marcas", width: "15%", title: 'Marcas', id: 5, boolean: true} ,
                { fieldname: "gestao_categorias", width: "15%", title: 'Categorias', id: 6, boolean: true} 
    )


    titulo = 'Usuários'
  }

  // ultima coluna, acoes (editar, excluir, etc)
  columns.push( {name: 'actions', width: '150px', title: '', id: 3} )
  
  // registros da tabela atual (_currentMenuItem)
  let [registros, setRegistros, getRegistros] = useState(null)

  // exibe formulario de CRUD 
  let [formCrudChamado, setFormCrudChamado, getFormCrudChamado] = useState('')
  let [operacaoCrud, setOperacaoCrud, getOperacaoCrud] = useState('')
  let [idRegistroCrud, setIdRegistroCrud, getIdRegistroCrud] = useState('')


  //********************************************************************************************  
  // le registros da tabela atual
  //********************************************************************************************
  const fetchRegistros = async () =>  {
    props.setCarregando(true)


    let resourceFetch = ''
    switch (itemMenuAtual) {
      case 'itemMenuUsuarios':
        resourceFetch = 'usuarios'
        break;
      default:
    }

    // exemplo rota:  localhost/usuarios/lista
    fetch(`${backendUrl}/${resourceFetch}/lista`, { 
      method: "GET" ,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((data) => {

      props.setCarregando(false)

      setRegistros(data)
    })
    .catch((error) => console.log('erro='+error));
  }

  //********************************************************************************************
  //********************************************************************************************
  useEffect( () => {
      // carrega registros da tabela atual 
      // força 1/2 segundo de parada para que usuario perceba que esta recarregando
      if ( getRegistros.current == null )    
        setTimeout(() => {
          // memoriza qual tabela atual
          fetchRegistros()    
        }, 500);

  }, [registros])

  //********************************************************************************************
  // chama form para CRUD de alguma tabela 
  //********************************************************************************************
  const Crud = ( operacao, registroId ) => {
    setOperacaoCrud( operacao )
    setIdRegistroCrud( registroId )
    setFormCrudChamado(true)
  }

  //********************************************************************************************
  // fecha form de Crud
  //********************************************************************************************
  const fecharFormCrud = event => {
    setFormCrudChamado(false)
  }


  //********************************************************************************************
  // muda status do usuario , ativo / inativo
  //********************************************************************************************
  const statusUsuario = async (registroId) => {

      if (props.getInfoUsuarioLogado.current.id == registroId)  {
        mensagemRolante("Você não pode alterar status do usuário atualmente logado", 3000)          
        return;
      }

      props.setCarregando(true)

      fetch(`${backendUrl}/usuarios/status/${registroId}`, { 
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json())
      .then((resposta) => {
        props.setCarregando(false)
        setTimeout(() => {
          setRegistros(null)  // força reload da datatable   
        }, 500);
        
      })
      .catch((error) => console.log('erro='+error))
  }


  return (
    <>
    <div style = {{  height: '30px', fontSize: '25px', marginBottom: '30px' }}>
      { titulo }
    </div>

    {/* looping para exibir cada coluna baseado na tabela atual */}
    <div className="DatatableHeader">
        {columns.map(function (column)  {     
          return( <div key={column.id} style={{width: column.width, fontSize: '15px' }}>{column.title}  </div> );                 
        })}
    </div>          


    {/* looping para exibir registros da tabela atual */}
    <div className="DatatableRows">
      {/* percorre os registros */}
      { registros && 
        registros.map(function (registro)  {     
              return(
                /* linha do registro  */
                <div className='DatatableRow' key={`tr${registro.id}`}  > 
                {
                /* exbe cada coluna do registro atual  */
                columns.map(function (col, j, {length}) {
                    return( 
                      <Fragment key={`frag${registro.id}${col.id}`} >
                          {/* exibe ultima, acoes (1a condicao abaixo) ou outras colunas (2a condicao abaixo) */}
                          {j===length-1 ? (
                            <>
                              {registro.ativo ? (
                                <>
                                    <div  className='actionColumn' style= {{ width: col.width}}  >
                                        <div className='actionIcon' onClick={ () => Crud('patch', registro.id) } ><img alt='' src='images/edit.svg' /></div>
                                        <div className='actionIcon' onClick={ () => Crud('delete', registro.id) }><img alt='' src='images/delete.svg' /></div>
                                        <div className='actionIcon' onClick={ () => statusUsuario(registro.id) }><img alt='' src='images/activate.svg' /></div>
                                    </div>   
                                </> 
                              ) :  (
                                  <div  className='actionColumn' style= {{ width: col.width}}  >
                                      <div className='actionIconNull'>&nbsp;</div>
                                      <div className='actionIconNull'>&nbsp;</div>
                                      <div className='actionIcon' onClick={ () => statusUsuario(registro.id) }><img alt='' src='images/activate.svg' /></div>
                                  </div>  ) 
                              }
                            </> ) : (
                                <>

                                    {col.boolean && registro[col.fieldname]==1 &&                   
                                      <div style={{width: col.width, paddingLeft: '5px'}}>Sim</div>
                                    }

                                    {col.boolean && registro[col.fieldname]==0 &&                   
                                      <div style={{width: col.width, paddingLeft: '5px'}}>-</div>
                                    } 

                                    {! col.boolean && 
                                      <div style={{width: col.width, paddingLeft: '5px'}}>{ registro[col.fieldname] }</div>
                                    } 

                                </>
                            )
                          }


                      </Fragment>
                    )
                })}
                </div>
              )
        }) }
    </div>

    {/* se a edicao de usuario foi acionada */}
    { getFormCrudChamado.current  && itemMenuAtual === 'itemMenuUsuarios' &&   
            <UsuarioForm  
                operacao={getOperacaoCrud.current} 
                registroId={getIdRegistroCrud.current}
                fecharFormCrud = {fecharFormCrud}
                setRegistros   = {setRegistros}
                getInfoUsuarioLogado = {props.getInfoUsuarioLogado}
                setCarregando={props.setCarregando} 
            />
    }
    
  </>
  )
}

export default Datatable;
