
import { useEffect, createContext, useRef  } from 'react';

// useState de 'Aminadav Glickshtein' permite 3o parametro para obter estado atual da variavel
// fazer isso com useState padrao do react é muito complicado
import useState from 'react-usestateref'
import '../css/index.css';

import Header from './Header';
//import Datatable from './Datatable';
import MenuLateral from './MenuLateral.jsx';

import $ from 'jquery'

import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.min.css';

import { preparaAnimacaoCarregando, stringEhJson, mensagemRolante  } from '../js/utils.js';

export const ContextoCompartilhado = createContext();

//export const backendUrl = 'http://ec2-54-94-203-105.sa-east-1.compute.amazonaws.com:8071'
export const backendUrl = 'http://localhost:8000'

function Main() {

  // controla item do menu lateral (MenuLateral) atualmente clicado
  let [itemMenuAtual, setItemMenuAtual] = useState('')

  // controla exibicao da animacao 'carregando...'
  let [carregando, setCarregando] = useState(true)

  // controla info do usuario atualmente logado (se alguem estiver logado, claro)
  let [infoUsuarioLogado, setInfoUsuarioLogado, getInfoUsuarioLogado] = useState('')

  // controla se o form de login deve ser exibido, isso vai ocorrer qdo usuario nao logado
  let [mostrarFormLogin, setMostrarFormLogin, getMostrarFormLogin] = useState(false)
  // controla o HTML da tela de login que é recebido do backend
  let [htmlFormLogin, setHtmlFormLogin] = useState('')

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
  
      // verifica se ha usuario logado
      if ( infoUsuarioLogado.current == null )    
        setTimeout(() => {
          fetchUsuarioLogado()    
        }, 500);
  }, [infoUsuarioLogado])


  // *****************************************************************************
  // codigo que sera executado apos form login ser exibido ou ocultado
  // *****************************************************************************
  useEffect( () => {       

    // se o form de login foi exibido, faz as configuracoes jscript necessarias
    if (! getMostrarFormLogin.current) return

    // prepara botao 'login' do form de login para que dispare dados do usuario para o back
    $(divLogin.current).find("button").off('click').click(function (event) {

        fetch(`${backendUrl}/auth/login`,  {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({a: 7, str: 'Some string: &=&'})
        })
        .then(res => res.json()) 
        .then(res => console.log(res))
        .catch((error) => console.log('erro='+error));  
    });

    $('#loginEmail').focus();    
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
            nome: $('#nome').val(),
            email: $('#email').val(),
          })

          let body = JSON.stringify( {
              name: $('#nome').val(),
              email: $('#email').val(),
              password: $('#senha').val(),
              password_confirmation: $('#senha_confirmation').val(),
          })
              
          setCarregando(true)

          let erro = ''

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

console.log('resp1='+JSON.stringify(resposta))

                // deve haver um jeito mais inteligente de exibir o erro abaixo, mas sao 01:08 da manha, vai usando IF mesmo 
                erro = ''
                if (typeof resposta.errors!='undefined') {
                    if (typeof resposta.errors.nome!='undefined') erro = resposta.errors.nome;
                    if (typeof resposta.errors.senha!='undefined') erro = resposta.errors.senha;
                    if (typeof resposta.errors.email!='undefined') erro = resposta.errors.email;
                }
        
                if (erro!=='')  {
                  mensagemRolante(erro, 2000)
                
                  // deu erro ao submeter, recupera ultimos valores digitados
                  // isso ocorre porque qq alteracao visual na tela (exemplo: setCarregando)
                  // o react esquece valores
                  setTimeout(() => {
                      //$('#nome').val( getValoresFormRegistro.current.nome )
                      //$('#email').val( getValoresFormRegistro.current.email )                 
                  }, 100);
                }  
                else {
                  setInfoUsuarioLogado( resposta.nome )
                }

              })
              .catch((error) => console.log('erro='+error));  
              setCarregando(false)

              // zera os campos do form registro (novo usuario), caso seja usado de novo
              if (erro==='')
                  setTimeout(() => {
                      $('#nome').val('')
                      $('#email').val('')                 
                  }, 100);

              // refaz jscript ativo do form registro, pois o react destroy ao atualizar a tela
              setTimeout(() => {
                prepararFormRegistro()  
              }, 1000);
            

          }, 100);

      });

      $('#nome').focus();    
  }

  // ***************************************************************************************
  // caso usuario tenha pedido para se registrar clicando no botao REGISTRAR (Header)
  //  a funcao abaixo sera executada
   // ***************************************************************************************  
  const exibirFormRegistro = () => {
    setMostrarFormLogin(false);
    setMostrarFormRegistro(true);
  }


  // ***************************************************************************************
  // caso usuario tenha pedido para se logar clicando no botao LOGIN (Header)
  //  a funcao abaixo sera executada
  // ***************************************************************************************  
  const exibirFormLogin = () => {
    setMostrarFormRegistro(false);
    setMostrarFormLogin(true);
  }



  // *****************************************************************************
  // busca no backend se ha usuario logado e junto com isso,
  // obtem o HTML do form de login e form de registro (novo usuario)
  // para deixar amarzenado caso precise
  // *****************************************************************************
  const fetchUsuarioLogado = async () =>  {
    fetch(`${backendUrl}/auth/verificar`)
    .then((response) => {
        return response.text()
    })
    .then((data) => {

      if (stringEhJson(data)) {
        console.log('usu logado')
      }
      else {
        // backend enviou info usuario logado (caso exista)|||html form login|||html form registro
        let info = data.split('|||')   // separador das informacoes = |||

        // memoriza HTML dos forms registro/login  caso precise usa los
        setInfoUsuarioLogado( info[0])   // se nao ha usuario logado, a string vai vir em branco
        setHtmlFormLogin( info[1] )
        setHtmlFormRegistro( info[2] ) 

        // ja comeca exibindo fomr login caso usaurio nao logado
        if (getInfoUsuarioLogado.current==='') setMostrarFormLogin(true)
         
        setCarregando(false);  // oculta animacao 'carregando...'
      }
    })
    .catch((error) => console.log('erro='+error));
  }
  
  return (    
    <>

    <div className="Conteudo">


      {/* context => compartilha item do menu atualmente clicado */}
      <ContextoCompartilhado.Provider 
        value={{ 
            _itemMenuAtual: itemMenuAtual  }}  >

          {/* barra lateral esquerda */}
          <div className='MenuLateral'>
                <MenuLateral  />
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
                      exibirFormRegistro={exibirFormRegistro}   
                      exibirFormLogin={exibirFormLogin}                     /> 
                }

              </div>

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

    </>



  );
}

export default Main;
