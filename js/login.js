"use strict";
function Entrar(username,password){
	var url = 'http://heylistenapi.azurewebsites.net/usuarios';
	$.ajax({
		url: url,
		type: 'GET',
		contentType: "application/json; charset=utf-8",
		success: function(usuarios){
			$.each(usuarios, function(i , usuario)
			{
				$.each(usuario , function(i , u){
					if(username == u.nombre && password == u.contrasena)
					{
						localStorage["usuario"] = u.id;
						window.location.href = "canciones.html";
						console.log(localStorage["usuario"]);
					}else{
						alertify.error("Contraseña o Usuario incorrecto");
					}
				});
				
			});
		},
		error: function(error){
			console.log('error - ' + error);
		}
	});

}

$('#entrar').click(function(event) {
	event.preventDefault();
	var username = $('#username').val();
	var password = $('#password').val();
	if (username != '' && password != '') {
		Entrar(username,password);
	}else {
		alertify.error("Rellena todos los campos");
	}

});
$(document).ready(function() {
	if (localStorage["usuario"]) {
		window.location.href = "lista.html";
	}
});
