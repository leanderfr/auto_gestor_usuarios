

import '../css/index.css';

function ItemMenu( props ) {

  const itemMenuAcionado = (id) => {
    props.setItemMenuAtual(id)
  }


  return (
    <div 
        className={ props.itemMenuAtual===props.id ? 'ItemMenuClicado' : 'ItemMenu'  }
        onClick={() => {itemMenuAcionado(props.id) }}
      >
      {props.text}
    </div>
  );
}

export default ItemMenu;
