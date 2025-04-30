
import { useRef } from 'react';
import '../css/index.css';


// props= recebe funcoes que fazem a comunicacao entre Header.jsx e Main.jsx
// se Main.jsx ainda esta carregando dados, exibe Header.jsx com campos do usuario logado em branco, pois nao logado ainda
function Header( props ) {

  // obtem usuario atualmente logado que foi passado por Main.jsx
  let { infoUsuarioLogado }  = props;  


  // useRef => ajuda a colocar efeito HOVER nos botoes
  const btnRegistrar = useRef(null);
  const btnLogin = useRef(null);
  const btnLogout = useRef(null);

  // css botoes padrao
  const btnPadrao = {
    backgroundColor: '#e6e6e6', 
    color: 'black', 
    textAlign: 'center', 
    width: '150px', 
    height: '30px', 
    borderRadius: '5px', 
    border: '2px solid transparent',
    paddingLeft: '10px',
  };




  return (
    <>

        {/* detalhes do usuario logado */}
        <div id='nomeUsuarioLogado' style={{color: 'red', fontSize: '30px'}} >{  infoUsuarioLogado.nome  } </div>


        {/* botoes novo usuario, login, logout */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', paddingRight: '20px' }}>

            {/* se nao estiver mostrando form de registro, oferece botao 'REGISTRAR-ME' */}
            { ! props.formRegistroAtivo && ! props.formRegistroAtivo &&
              <button ref={btnRegistrar} style = {btnPadrao}  
                  onMouseEnter={ () => {btnRegistrar.current.style.border ='solid 2px gray'} } 
                  onMouseLeave={ () => {btnRegistrar.current.style.border ='solid 2px transparent'} }   
                  onClick={ () => {props.exibirFormRegistro()} } >
                Novo Usuário
              </button> 
            }

            {/* se nao estiver mostrando form de login e nao houver usuario logado, oferece botao 'LOGIN' */}
            { infoUsuarioLogado.nome==='' && ! props.formLoginAtivo && 
                <button ref={btnLogin} style = {btnPadrao} 
                    onMouseEnter={ () => {btnLogin.current.style.border ='solid 2px gray'} } 
                    onMouseLeave={ () => {btnLogin.current.style.border ='solid 2px transparent'} }   
                    onClick={ () => {props.exibirFormLogin()} } >
                  Login
                </button> 
	          }

            {/* se houver usuario logado, oferece botao 'LOGOUT' */}
            { infoUsuarioLogado.nome!=='' &&  
                <button ref={btnLogout} style = {btnPadrao} 
                    onMouseEnter={ () => {btnLogout.current.style.border ='solid 2px gray'} } 
                    onMouseLeave={ () => {btnLogout.current.style.border ='solid 2px transparent'} }   
                    onClick={ () => {props.logout()} } >
                  Logout
                </button> 
            }
        </div>

    </>
  );
}

export default Header;
