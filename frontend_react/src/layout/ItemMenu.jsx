

import '../css/index.css';

function ItemMenu( {setItemMenuAtual, itemMenuAtual, text, id} ) {
  return (
    <div 
        className={ itemMenuAtual===id ? 'ItemMenuClicado' : 'ItemMenu'  }
        onClick={() => {console.log('lll'); setItemMenuAtual(id) }}
      >
      {text}
    </div>
  );
}

export default ItemMenu;
