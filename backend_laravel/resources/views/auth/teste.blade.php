

{{ 

Session::put('futuro', $nome )


 }}

<div style='color:blue;font-size:30px'>

      <div style='color:blue;font-size:30px'>
      chave atual = {{ csrf_token() }}
      user atual = {{ Session::get('teste_usuario') }}
      </div>


@if(Auth::check())  

      <div style='color:blue;font-size:30px'>
      chave = {{ csrf_token() }}
      user = {{ Auth::user()->name }}
      </div>

@else 
    <div style='color:blue;font-size:30px'>
    NAO LOGADO
    </div>
@endif



</div>