"use strict";
// Soundcloud next token
var next_href= "";
// li de la lista que contiene todas las canciones
var canciones = "";

var bottom = false;

// Youtube next token
var nextPageToken = "";

var baseUrl = 'http://api.soundcloud.com/tracks.json?client_id=a6c32f43a9c86c747d79943a65c389e5';
var baseUrlYt = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyALOIAA9DP1cGxWMAmQYxFXX65lf6lfsbY';


function  BuscarSoundCloud(urlCompleta, ul) {
	var url = urlCompleta;
	
	$.ajax({
			url: url,
			type: 'GET',
			contentType: "application/json;chartset=utf-8",
			success: function(tracks){
				
				var img = "";
				next_href = tracks.next_href;
				console.log(bottom);
				
				if(bottom == false){
					$(ul).empty();
					canciones = "";
				}
				$.each(tracks, function(i , track)
				{
					$.each(track , function( i , t){
						if(t.artwork_url == null)
						{
							img = './images/ftyt.png';
						}
						else{
							img = t.artwork_url;
						}
						canciones += '<li class="estiloListas"><img class="icon" src="images/sc-logo.png"/><a href="'+ t.permalink_url +'"><img id="img-cancion" src="'+ img +'" />'+t.title+'</a><button id="guardar" img="'+t.artwork_url+'" cancion="'+ t.title +'" url="'+ t.permalink_url +'" servicio="sc" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-right"><i class="material-icons">add</i></button></li>';
					});
					$(ul).append(canciones);
				});
			},
      		error: function(){
      			console.log('error');
      		}
	});
}

function  BuscarYoutube(urlCompleta , ul) {
	$.ajax({
			url: urlCompleta,
			type: 'GET',
			contentType: "application/json;chartset=utf-8",
			success: function(tracks){
				console.log(tracks);
				nextPageToken = tracks.nextPageToken;

				if(bottom == false){
					ul.empty();
					canciones = "";	
				}
				
				$.each(tracks.items, function(i , track)
				{
					canciones +='<li class="estiloListas"><img class="icon" src="images/yt.ico"/><a href="https://www.youtube.com/watch?v='+ track.id.videoId +'"><img id="img-cancion" src="'+track.snippet.thumbnails.medium.url+'" />'+track.snippet.title+'</a><button id="guardar" img="'+track.snippet.thumbnails.medium.url+'" cancion="'+ track.snippet.title +'" url="https://www.youtube.com/watch?v='+ track.id.videoId +'" servicio="yt" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-right"><i class="material-icons">add</i></button></li>';
				});
				ul.html(canciones);
      },
	});
}

function  BuscarSpotify(texto) {
	var url = 'https://api.spotify.com/v1/search?q='+ texto +'&type=track&market=MX&limit=10';
	$.ajax({
			url: url,
			type: 'GET',
			contentType: "application/json;chartset=utf-8",
			success: function(tracks){
				$('#listaCancionesSP').empty();
				var canciones = "";
				$.each(tracks.tracks.items, function(i , track)
				{
					
					canciones +=	'<li class="estiloListas"><img class="icon" src="images/spo-logo.ico"/><a href="'+ track.external_urls.spotify+'"><img id="img-cancion" src="'+track.album.images[1].url+'" />'+ track.name +'</a><button id="guardar" img="'+track.album.images[1].url+'" cancion="'+ track.name +'" url="'+ track.external_urls.spotify +'" servicio="sp" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-right"><i class="material-icons">add</i></button></li>';
				});
				$('#listaCancionesSP').html(canciones);
      },
	});
}

function Guardar(urlSong,titulo,powerBy,urlImg) {
	var url = 'http://heylistenapi.azurewebsites.net/canciones';
	var usuario = localStorage["usuario"];
	var data = {
		nombre : titulo,
		url : urlSong,
		idUsuario : usuario,
		servicio : powerBy,
		imagen : urlImg
		}
	$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: "application/json;chartset=utf-8",
			success: function()
			{
				alertify.success("Cancion guardada.");
			},
			error: function()
			{
				alertify.error("No se pudo guardar.");
			}
	});
}

$('ul').on('click', '#guardar', function(event) {
	event.preventDefault();
	var urlSong = $(this).attr('url');
	var powerBy = $(this).attr('servicio');
	var titulo = $(this).attr('cancion').substring(0,50);
	var urlImg = $("#img-cancion").attr('src');
	Guardar( urlSong , titulo , powerBy , urlImg );
});

$('main').scroll(function(){
	var heightMain = $('main').scrollTop() + $('main').height();
	var texto = $('#expando1').val();
   if(heightMain == $('.page-content').height()) {
       bottom = true;
       var ul = $('#canciones');
       BuscarSoundCloud(next_href , ul);

       var urlYT = baseUrlYt+'&maxResults=10&part=snippet&type=video&q='+texto+'&pageToken='+nextPageToken;
       BuscarYoutube(urlYT , ul);
   }
});


$(document).on('keyup', '#expando1', function() {
  	var texto = $('#expando1').val();
  	$('#canciones').empty();
	if (texto != "") {
		bottom = false;

		// Busqueda en souncloud
		var url = baseUrl + '&q='+texto+'&limit=10&linked_partitioning=5';
		var ulSC = $('#listaCancionesSC');
		BuscarSoundCloud(url , ulSC);

		// Busqueda en youtube
		var urlYT = baseUrlYt+'&maxResults=10&part=snippet&type=video&q='+texto;
		var ulYT = $('#listaCancionesYT');
		BuscarYoutube(urlYT, ulYT);
		BuscarSpotify(texto);
	}

	
	
});

$(document).ready(function(){
	 var texto = $('#expando1').val();
	 if(texto != ""){
	 	var url = baseUrl + '&q='+texto+'&limit=10&linked_partitioning=5';
		var ulSC = $('#listaCancionesSC');
	 	BuscarSoundCloud(baseUrl , ulSC);
		BuscarYoutube(texto);
		BuscarSpotify(texto);
	 }
});