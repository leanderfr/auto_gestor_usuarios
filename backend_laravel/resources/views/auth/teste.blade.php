

<div style='color:blue;font-size:30px'>
      
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