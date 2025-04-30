
import '../css/index.css';
import {  ContextoCompartilhado, backendUrl } from './Main.jsx';
import {  useContext, useEffect, Fragment } from 'react';
import UsuarioForm from './UsuarioForm.jsx'

// useState de 'Aminadav Glickshtein' permite 3o parametro para obter estado atual da variavel
// fazer isso com useState padrao do react é muito complicado
import useState from 'react-usestateref'

function Datatable( props ) {

  // expressions (frases) no idioma atual e item do menu lateral que foi clicado
  let { itemMenuAtual }  = useContext(ContextoCompartilhado);  

  // colunas que serao exibidias dependendo da tabela sendo vista (_currentMenuItem)
  let columns = []

  // manipulando tabela de desenvolvedores 
  //if (getCurrentTable.current === 'itemMenuDevelopers')
  if (itemMenuAtual === 'itemMenuUsuarios')  
    columns.push({ fieldname: "id", width: "20%", title: 'Id', id: 1 },
                { fieldname: "name", width: "calc(80% - 150px)", title: 'Nome', id: 2} )

  // ultima coluna, acoes (editar, excluir, etc)
  columns.push( {name: 'actions', width: '150px', title: '', id: 3} )
  
  // registros da tabela atual (_currentMenuItem)
  let [registros, setRegistros, getRegistros] = useState(null)

  // exibe formulario de CRUD 
  let [formCrudChamado, setFormCrudChamado, getFormCrudChamado] = useState('')
  let [operacaoCrud, setOperacaoCrud, getOperacaoCrud] = useState('')
  let [idRegistroCrud, setIdRegistroCrud, getIdRegistroCrud] = useState('')


  // le registros da tabela atual
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

  useEffect( () => {
      // carrega registros da tabela atual 
      // força 1/2 segundo de parada para que usuario perceba que esta recarregando
      if ( getRegistros.current == null )    
        setTimeout(() => {
          // memoriza qual tabela atual
          fetchRegistros()    
        }, 500);

  }, [registros])

  // chama form para CRUD de alguma tabela 
  const Crud = ( operacao, registroId ) => {
    setOperacaoCrud( operacao )
    setIdRegistroCrud( registroId )
    setFormCrudChamado(true)
  }

  // fecha form de Crud
  const fecharFormCrud = event => {
    setFormCrudChamado(false)
  }

  return (
    <>
    <div className="botoesCrud">

        {/* botao= pesquisar nome */}
        <div className="CrudButton" style={{ _paddingRight:'20px' }} >
          <div style={{width: '200px', height: '100%' }}>
              { itemMenuAtual !=null && <input type='text' className='searchBox' placeholder='Pesquisar nome' /> }
          </div>
          <div className='magnifyingSearch'  >
              <img src='images/magnifying.svg' alt='' style={{ width:'20px' }}></img>
          </div>
        </div>

        {/* botao= novo registro */}
        <div className="CrudButton" style={{ paddingLeft:'20px', paddingRight:'20px', gap: '15px' }}    >
          <div><img src='images/add.svg' alt='' style={{ width:'22px' }}></img></div>
          <div><span>{ itemMenuAtual!=null && 'Novo Registro' }</span> </div>
        </div>
    </div>


    {/* looping para exibir cada coluna baseado na tabela atual */}
    <div className="DatatableHeader">
        {columns.map(function (column)  {     
          return( <div key={column.id} style={{width: column.width }}>{column.title}  </div> );                 
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
                                <div  className='actionColumn' style= {{ width: col.width}}  >
                                    <div className='actionIcon' onClick={ () => Crud('patch', registro.id) } ><img alt='' src='images/edit.svg' /></div>
                                    <div className='actionIcon' onClick={ () => Crud('delete', registro.id) }><img alt='' src='images/delete.svg' /></div>
                                    <div className='actionIcon' onClick={ () => Crud('status', registro.id) }><img alt='' src='images/activate.svg' /></div>
                                </div>  ) : 

                              (<div style={{width: col.width, paddingLeft: '5px'}}> {registro[col.fieldname]}  </div>) 
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
                setCarregando={props.setCarregando} 
            />
    }
    
  </>
  )
}

export default Datatable;
