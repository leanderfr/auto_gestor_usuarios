
import { useEffect, createContext  } from 'react';

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

  let [carregando, setCarregando] = useState(true)

  let [nomeUsuarioAtual, setNomeUsuarioAtual] = useState('')
  let [tokenUsuarioAtual, setTokenUsuarioAtual] = useState('')

  let [oferecerFormLogin, setOferecerFormLogin] = useState(false)
  let [htmlFormLogin, setHtmlFormLogin] = useState('')


  // verifica se ha usuario logado atualmente
  const fetchUsuarioAtual = async () =>  {
    fetch(`${backendUrl}/auth/verificar`)
    .then((response) => {
        const contentType = response.headers.get("Content-Type")

        if (contentType && contentType.includes("application/json")) return response.json()
        if (contentType && contentType.includes("text/html")) return response.text()
    })
    .then((data) => {

      if (stringEhJson(data)) console.log('usu logado')
      else {
        setHtmlFormLogin(data)
        setOferecerFormLogin(true)
      }

    })
    .catch((error) => console.log('erro='+error));

      setTimeout(() => {
        setCarregando(false);
        }, 1000);
  }

  useEffect( () => {      
      preparaAnimacaoCarregando()  
  
      // verifica se ha usuario logado
      if ( nomeUsuarioAtual.current == null )    
        setTimeout(() => {
          fetchUsuarioAtual()    
        }, 500);
  }, [nomeUsuarioAtual])


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

              {/* se usuario nao logado ainda, oferece form de login que foi obtido do backend laravel */}
              { oferecerFormLogin && <div className='formLogin' dangerouslySetInnerHTML={{__html: htmlFormLogin}}></div> }

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
