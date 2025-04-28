
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

import { preparaAnimacaoCarregando, stringEhJson  } from '../js/utils.js';

export const ContextoCompartilhado = createContext();

//export const backendUrl = 'http://ec2-54-94-203-105.sa-east-1.compute.amazonaws.com:8071'
export const backendUrl = 'http://localhost:8000'

function Main() {

  // controla item do menu lateral (MenuLateral) atualmente clicado
  let [itemMenuAtual, setItemMenuAtual] = useState('')

  // controla exibicao da animacao 'carregando...'
  let [carregando, setCarregando] = useState(true)

  // controla info do usuario atualmente logado
  let [nomeUsuarioAtual, setNomeUsuarioAtual] = useState('')
  let [tokenUsuarioAtual, setTokenUsuarioAtual] = useState('')

  // controla se é necessario exibir a tela de login
  let [oferecerFormLogin, setOferecerFormLogin] = useState(false)

  // controla o HTML da tela de login que é recebido do backend
  let [htmlFormLogin, setHtmlFormLogin] = useState('')

 const divLogin = useRef(null); 


  // *****************************************************************************
  // codigo que sera executado apos HTML ter sido carregado
  // *****************************************************************************
  useEffect( () => {      
      preparaAnimacaoCarregando()  
  
      // verifica se ha usuario logado
      if ( nomeUsuarioAtual.current == null )    
        setTimeout(() => {
          fetchUsuarioAtual()    
        }, 500);
  }, [nomeUsuarioAtual])


  // *****************************************************************************
  // codigo que sera executado apos form login for exibido
  // *****************************************************************************
  useEffect( () => {      
    //$(divLogin.current).find("button").off('click');

    $(divLogin.current).find("button").off('click').click(function (event) {
      login()
    });

    //$('#loginNome').focus();    
  }, [htmlFormLogin])



  // *****************************************************************************
  const login = async () =>  { 
      //event.preventDefault();

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
  }


  // *****************************************************************************
  // busca no backend se ha usuario logado
  // *****************************************************************************
  const fetchUsuarioAtual = async () =>  {
    fetch(`${backendUrl}/auth/verificar`)
    .then((response) => {
        const contentType = response.headers.get("Content-Type")

        // se usuario logado, backend enviou sua info em formato JSON
        if (contentType && contentType.includes("application/json")) return response.json()

        // caso contrario, backend enviou o HTML do form de login
        if (contentType && contentType.includes("text/html")) return response.text()
    })
    .then((data) => {

      if (stringEhJson(data)) console.log('usu logado')
      else {
        // nao ha usuario logado, backend enviou html do form de login 
        // o backend nao sabe qual URI do frontend, substituindo abaixo
        data = data.replace('@frontendUri', window.location.href.slice(0, -1))   // remove ultimo '/'

        setHtmlFormLogin(data)
        setOferecerFormLogin(true)        

         
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
                {/* se esta carregando expressoes ainda, carrega Header sem dados, só parte visual */}
                { carregando && 
                  <Header  /> }

                {/* se ja verificou usuario atual, carrega Header com exibindo seus dados */}
                { nomeUsuarioAtual && 
                  <Header nomeUsuarioAtual={nomeUsuarioAtual}
                  //  onChangeLanguage={changeLanguageAndReload}                 
                  /> }

              </div>

              {/* se usuario nao logado ainda, mostra form de login que foi obtido do backend laravel */}
              { oferecerFormLogin && <div className='formLogin' ref={divLogin} dangerouslySetInnerHTML={{__html: htmlFormLogin}}></div> }

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
