
import { useEffect, createContext, useRef  } from 'react';

// useState de 'Aminadav Glickshtein' permite 3o parametro para obter estado atual da variavel
// fazer isso com useState padrao do react é muito complicado
import useState from 'react-usestateref'
import '../css/index.css';

import Header from './Header';
import Datatable from './Datatable';
import MenuLateral from './MenuLateral.jsx';

import $ from 'jquery'

import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.min.css';

import { preparaAnimacaoCarregando, mensagemRolante  } from '../js/utils.js';

export const ContextoCompartilhado = createContext();

//export const backendUrl = 'http://ec2-54-94-203-105.sa-east-1.compute.amazonaws.com:8071'
export const backendUrl = 'http://localhost:8000'

function Main() {

  // controla item do menu lateral (MenuLateral) atualmente clicado
  let [itemMenuAtual, setItemMenuAtual, getItemMenuAtual] = useState('')

  // controla exibicao da animacao 'carregando...'
  let [carregando, setCarregando] = useState(true)

  // controla detalhes do usuario logado
  let [infoUsuarioLogado, setInfoUsuarioLogado, getInfoUsuarioLogado] = useState( 
    {
      nome: '',
      token: '',
      administrador: '',
      gestao_categorias: '',
      gestao_marcas: '',
      gestao_produtos: ''
    }
  )


  // controla se o form de login deve ser exibido, isso vai ocorrer qdo usuario nao logado
  let [mostrarFormLogin, setMostrarFormLogin, getMostrarFormLogin] = useState(false)
  // controla o HTML da tela de login que é recebido do backend
  let [htmlFormLogin, setHtmlFormLogin] = useState('')
  // memoriza valor atual de cada campo no fomr de login para em caso de erro ao submter form
  let [valoresFormLogin, setValoresFormLogin, getValoresFormLogin] = useState( {email: ''} )


   // controla se o form de registro (novo usuario) deve ser exibido, isso vai ocorrer qdo usuario pediu para se registrar clicando no botao REGISTRAR ME (Header)
  let [mostrarFormRegistro, setMostrarFormRegistro, getMostrarFormRegistro] = useState(false)
  // controla o HTML da tela de registro (novo usuario) que é recebido do backend
  let [htmlFormRegistro, setHtmlFormRegistro] = useState('')
  // memoriza valor atual de cada campo no fomr de registro (novo usuario) para em caso de erro ao submter form
  let [valoresFormRegistro, setValoresFormRegistro, getValoresFormRegistro] = useState( {nome: '', email: ''} )


  // ponteiro para a DIV do form login, para poder monitorar o botao 'submit'
  const divLogin = useRef(null); 

  // ponteiro para a DIV do form registro, para poder monitorar o botao 'submit'
  const divRegistro = useRef(null); 

  // *****************************************************************************
  // codigo que sera executado apos HTML (Main.jsx) ter sido carregado
  // *****************************************************************************
  useEffect( () => {      
      preparaAnimacaoCarregando()  
  
      // busca HTML que vai compor o form de login e de registro (novo usuario)
      // o ideal seria criar um componente React para esses forms, mas como objetivo aqui é mostrar
      // que conheco Laravel, os forms serao enviados pelo Blade (backend)
      setTimeout(() => {
        buscarFormsUsuario()    
      }, 500);
  }, [])


setTimeout(() => {
  //setItemMenuAtual('itemMenuProdutos')
}, 5000);

// *****************************************************************************
// codigo que sera executado apos HTML (Main.jsx) ter sido carregado
// *****************************************************************************
  
const prepararFormLogin = () => {
    // prepara botao 'login' do form de login para que dispare dados do usuario para o back
    $(divLogin.current).find("button").off('click').click(function (event) {

        // memoriza campos digitados caso dê erro
        // necessario fazer isso porque o html vem do backend
        // caso o form fosse montado aqui no front, nao seria necessario
        setValoresFormLogin( { 
          email: $('#email').val(),
        })

        setCarregando(true)
        fetch(`${backendUrl}/auth/login`,  {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: $('#email').val(), password: $('#password').val()}) 
        })
        .then(resposta => resposta.json())  
        .then(resposta => {

            setCarregando(false)

            //jeito tosco de testar a resposta, mas sao 3 da manha e preciso terminar antes das 8 !!
            // tivesse mais tmpo faria diferente
            if  (typeof resposta.usuario=='undefined') { 
              mensagemRolante('Usuário não existe ou senha incorreta', 2000)  // erro

              // devolve campos do form login que o React limpou
              setTimeout(() => {
                  $('#email').val( getValoresFormLogin.current.email )                 
              }, 100);

            }
            else {   
                setItemMenuAtual('')

                // memoriza detalhes do usuario recem logado
                // temporariamente, para o React
                setInfoUsuarioLogado( { 
                  nome:  resposta.usuario.name,
                  token:  resposta.token,
                  administrador:  resposta.usuario.administrador,
                  gestao_categorias:  resposta.usuario.gestao_categorias,
                  gestao_marcas:  resposta.usuario.gestao_marcas,
                  gestao_produtos:  resposta.usuario.gestao_produtos,
                })

                // de forma persistente, no navegador
                localStorage.setItem("infoUsuarioLogado", JSON.stringify(getInfoUsuarioLogado.current) )

                // fehca form login
                setMostrarFormLogin(false)
            }
            // refaz jscript ativo do form registro, pois o react destroy ao atualizar a tela
            setTimeout(() => {
              prepararFormLogin()   
            }, 1000);
        })
        .catch((error) => console.log('erro='+error));  
    });

    $('#email').focus();    


}

  // *****************************************************************************
  // codigo que sera executado apos form login ser exibido ou ocultado
  // *****************************************************************************
  useEffect( () => {       

    // se o form de login foi exibido, faz as configuracoes jscript necessarias
    if (! getMostrarFormLogin.current) return

    prepararFormLogin()

  }, [mostrarFormLogin])


  // *******************************************************************************************************************************************
  // dependendo do valor atual da variavle 'carregando', o React remove/adiciona a div (divCarregando) que exibe a animacao de 'processando... '
  // ao pedir para React reexibir a DIV, necessario recriar a parte jscript da animacao usando 'preparaAnimacaoCarregando()'
  // *******************************************************************************************************************************************

  useEffect( () => {       
    preparaAnimacaoCarregando()
  }, [carregando])



  // *****************************************************************************
  // codigo que sera executado apos form de novo usuario ser exibido ou ocultado
  // *****************************************************************************
  useEffect( () => {       

    // se o form de registro (novo usuario) foi exibido, faz as configuracoes jscript necessarias
    if (! getMostrarFormRegistro.current ) return 

    prepararFormRegistro()

  }, [mostrarFormRegistro])

  // **************************************************************************************************
  // prepara clique no botao 'REGISTRAR' e outros detalhes do form REGISTRAR (novo usuario)
  // **************************************************************************************************
  const prepararFormRegistro = () => {

      // prepara botao 'registrar' do form de registro (novo usuario) para que dispare dados do novo usuario para o back
      $(divRegistro.current).find("button").off('click').click(function (event) {
          // memoriza campos digitados caso dê erro
          // necessario fazer isso porque o html vem do backend
          // caso o form fosse montado aqui no front, nao seria necessario
          setValoresFormRegistro( { 
            nome: $('#name').val(),
            email: $('#email').val(),
          })

          let body = JSON.stringify( {
              name: $('#name').val(),
              email: $('#email').val(),
              password: $('#password').val(),
              password_confirmation: $('#password_confirmation').val(),
          })
              
          setCarregando(true)

          let erro = ''

          setItemMenuAtual('')

          // necessario dar algusn milisegunos para que a animacao 'carregando... '  seja exibida
          setTimeout(() => {
              // chama rota para registrar novo usuario passando os campos definidos por ele/ela
              fetch(`${backendUrl}/auth/registrar`,  {
                method: 'POST',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: body
              })
              .then(res => res.json()) 
              .then(resposta => {
                // deve haver um jeito mais inteligente de exibir o erro abaixo, mas sao 01:08 da manha, vai usando IF mesmo 
                erro = ''
                if (typeof resposta.errors!='undefined') {
                    if (typeof resposta.errors.name!='undefined') erro = resposta.errors.name;
                    if (typeof resposta.errors.password!='undefined') erro = resposta.errors.password;
                    if (typeof resposta.errors.email!='undefined') erro = resposta.errors.email;
                }
        
                setCarregando(false)

                if (erro!=='')  {
                  mensagemRolante(erro, 3000)
                
                  // deu erro ao submeter, recupera ultimos valores digitados
                  // isso ocorre porque qq alteracao visual na tela (exemplo: setCarregando)
                  // o react esquece valores
                  setTimeout(() => {
                      $('#name').val( getValoresFormRegistro.current.nome )
                      $('#email').val( getValoresFormRegistro.current.email )                 
                  }, 100);
                }  
                else {
                  // memoriza detalhes do usuario recem logado
                  // temporariamente, para o React
                  setInfoUsuarioLogado( { 
                    nome:  resposta.usuario.name,
                    token:  resposta.token,
                    administrador:  resposta.usuario.administrador,
                    gestao_categorias:  resposta.usuario.gestao_categorias,
                    gestao_marcas:  resposta.usuario.gestao_marcas,
                    gestao_produtos:  resposta.usuario.gestao_produtos,
                  })

                  // de forma persistente, no navegador
                  localStorage.setItem("infoUsuarioLogado", JSON.stringify(getInfoUsuarioLogado.current) )
                  // fecha forms
                  setMostrarFormRegistro(false)
                  setMostrarFormLogin(false)
                }

                // zera os campos do form registro (novo usuario), caso seja usado de novo
                if (erro==='')
                    setTimeout(() => {
                        $('#name').val('')
                        $('#email').val('')                 
                    }, 100);

                // refaz jscript ativo do form registro, pois o react destroy ao atualizar a tela
                setTimeout(() => {
                  prepararFormRegistro()  
                }, 1000);


              })
              .catch((error) => console.log('erro='+error));  
            

          }, 100);

      });

      $('#name').focus();    
  }

  // ***************************************************************************************
  // usuario pediu para se cadastrar
  // ***************************************************************************************  
  const exibirFormRegistro = () => {
    setMostrarFormLogin(false);
    setMostrarFormRegistro(true);
  }


  // ***************************************************************************************
    // usuario pediu para se logar ou app abriu sem usuario logado 
  // ***************************************************************************************  
  const exibirFormLogin = () => {
    setMostrarFormRegistro(false);
    setMostrarFormLogin(true);
  }

  // ***************************************************************************************
  // usuario pediu para se deslogar
   // ***************************************************************************************  
  const logout = () => {

    setCarregando(true)

    fetch(`${backendUrl}/auth/logout`,  {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ getInfoUsuarioLogado.current.token,
      },
    })
    .then(res => res.text()) 
    .then(res => {
        setCarregando(false)
      // maneira tosca de testar a resposta, mas preciso entregar a app, se eu tivesse tempo testaria diferente
      mensagemRolante(res, 3000) 

      if  (res.indexOf('deslogado com sucesso')!=-1) {
        localStorage.removeItem("infoUsuarioLogado")

        setItemMenuAtual('')
        setInfoUsuarioLogado( { 
          nome:  '',
          token:  '',
          administrador:  '',
          gestao_categorias:  '',
          gestao_marcas:  '',
          gestao_produtos:  '',
        })

        // deslogou exibe form de login automaticamente
        setMostrarFormLogin(true)
        setMostrarFormRegistro(false)
      }
  
    })
    .catch((error) => console.log('erro='+error));  
  }



  // *****************************************************************************
  // busca no backend se ha usuario logado e junto com isso,
  // obtem o HTML do form de login e form de registro (novo usuario)
  // para deixar amarzenado caso precise
  // *****************************************************************************

  const buscarFormsUsuario = async () =>  {
    fetch(`${backendUrl}/auth/forms`, {
      method: 'get',
    })
    .then((response) => {
        return response.text()
    })
    .then((data) => {

      // backend enviou forms usuario nessa sequencia, separados por |||:   html form login|||html form registro
      let info = data.split('|||')   

      // memoriza HTML dos forms registro/login  caso precise usa los
      setHtmlFormLogin( info[0] )
      setHtmlFormRegistro( info[1] ) 

      // se nao ha usuario logado registrado no storage do navegador, ja começa exibindo form de login
      if ( localStorage.getItem("infoUsuarioLogado")==null ) {    
          setMostrarFormLogin(true)
          setMostrarFormRegistro(false)
      }
      // ha usuario logado registrado no browser, memoriza seus dados
      else {
          setInfoUsuarioLogado( JSON.parse( localStorage.getItem("infoUsuarioLogado") ) )  
      }
        
      setCarregando(false);  // oculta animacao 'carregando...'
    })
    .catch((error) => console.log('erro='+error));
  }
  
  return (    
    <>


    <div className="Conteudo">


      {/* context => compartilha item do menu atualmente clicado */}
      <ContextoCompartilhado.Provider 
        value={{ 
            itemMenuAtual: itemMenuAtual  }}  >
 
          {/* barra lateral esquerda */}
          <div className='MenuLateral'>
                <MenuLateral  
                    infoUsuarioLogado={infoUsuarioLogado}  
                    setItemMenuAtual ={setItemMenuAtual}
                />
          </div>

          {/* header e datatable */}
          <div className="Main">

              <div className='Header'>
                {/* se nao ha usuario logado, carrega Header com os botoes Registrar e Login  */}
                { ! carregando && 
                  <Header 
                      infoUsuarioLogado={infoUsuarioLogado} 
                      formRegistroAtivo={mostrarFormRegistro}   
                      formLoginAtivo={mostrarFormLogin}                    
                      logout={logout}   
                      exibirFormRegistro={exibirFormRegistro}   
                      exibirFormLogin={exibirFormLogin}                     /> 
                }
              </div>

              { ! mostrarFormLogin && ! mostrarFormRegistro && itemMenuAtual!='' &&
                  <div className='Datatable'>
                    <Datatable  setCarregando={setCarregando}  /> 
                  </div>
              }

              {/* se usuario nao logado ainda, mostra form de login que foi obtido do backend laravel */}
              { mostrarFormLogin && <div className='formLogin' ref={divLogin} dangerouslySetInnerHTML={{__html: htmlFormLogin}}></div> }

              {/* se usuario pediu para se registrar, mostra form de registro (novo usuario) que foi obtido do backend laravel */}
              { mostrarFormRegistro && <div className='formRegistro' ref={divRegistro} dangerouslySetInnerHTML={{__html: htmlFormRegistro}}></div> }

          </div>

      </ContextoCompartilhado.Provider>

    </div>    

    {/* animacao 'carregando...' */}
    { carregando && 
        <div className='backdropTransparent' style={{ visibility: carregando ? 'visible' : 'hidden' }} >
          <div id='divCarregando' >&nbsp;</div>
        </div>
    }

    <div id="msgRolanteErros" >
      &nbsp;ddd
    </div>


    </>



  );
}

export default Main;


