"use strict";
function  Cargar() {
	var id = localStorage["usuario"];
	var url = 'http://heylistenapi.azurewebsites.net/canciones/'+id;
	$.ajax({
			url: url,
			type: 'GET',
			contentType: "application/json;chartset=utf-8",
			success: function(tracks){
				$('#listaCancionesFavs').empty();
				var canciones = "";

				$.each(tracks , function ( i , track){
					$.each(track , function (i , t){
						if(t.servicio == 'sc')
							canciones += '<li class="estiloListas" cancion="'+ t.id +'"><img class="icon" src="images/sc-logo.png"/><a href="'+ t.url +'"><img src="'+ t.imagen+'" />'+t.nombre+'</a><button id="eliminar" cancion="'+ t.id +'" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-right"><i id="remove-icon" class="material-icons">remove_circle</i></button></li>';
						if(t.servicio == 'yt')
							canciones += '<li class="estiloListas" cancion="'+ t.id +'"><img class="icon" src="images/yt.ico"/><a href="'+ t.url +'"><img src="'+ t.imagen+'" />'+t.nombre+'</a><button id="eliminar" cancion="'+ t.id +'" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-right"><i id="remove-icon" class="material-icons">remove_circle</i></button></li>';
						if(t.servicio == 'sp')
							canciones += '<li class="estiloListas" cancion="'+ t.id +'"><img class="icon" src="images/spo-logo.ico"/><a href="'+ t.url +'"><img src="'+ t.imagen+'" />'+t.nombre+'</a><button id="eliminar" cancion="'+ t.id +'" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-right"><i id="remove-icon" class="material-icons">remove_circle</i></button></li>';
						$('#listaCancionesFavs').html(canciones);
					});
				});
				
      		},
      		error: function(){
      			$('#contenedorListasFavs').html('<p>No tienes ninguna canción guardada</p>');
      		}
	});
}

function Eliminar(id) {
	var url = 'http://heylistenapi.azurewebsites.net/canciones/'+id;
	console.log(url);
	$.ajax({
			url: url,
			type: 'DELETE',
			contentType: "application/json;chartset=utf-8",
			success: function(){
				console.log('success');
				$('li[cancion='+id+']').remove();
				alertify.success("Cancion eliminada");
			},
			error: function()
			{
				console.log('error');
			}
	});
}

$('ul').on('click', '#eliminar', function(event) {
		event.preventDefault();
		var id = $(this).attr('cancion');
		alertify.confirm("¿Estas seguro?", function (e) {
		    if (e) {
		      	Eliminar(id);
		    }
		});

});

$('#favorites').on('click', function()
{
	Cargar();
});

$(document).ready(function() {
  if(Cargar()){

  }
});
