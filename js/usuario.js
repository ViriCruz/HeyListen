"use strict";
function Actualizar() {
	var id = localStorage["usuario"];
	var url = 'http://heylisten20151203051142.azurewebsites.net/api/usuarios/'+id;
	var formulario = {};
	formulario.UsuarioID = id;
	formulario.username = $('#username').val();
	formulario.password = $('#password').val();
	formulario.email = $('#email').val();
	var data = JSON.stringify(formulario);
	$.ajax({
		url: url,
		type: 'PUT',
		data: data,
		contentType: "application/json;chartset=utf-8",
		statusCode: {
			204: function () {
				alertify.success("Informacion Actualizada");
			},
			400: function () {
				alertify.error("Ocurrio un error");
			}
		}
	});
}

function  Cargar() {
	var id = localStorage["usuario"];
	var url = 'http://heylisten20151203051142.azurewebsites.net/api/usuarios/'+id;
	$.ajax({
		url: url,
		type: 'GET',
		contentType: "application/json;chartset=utf-8",
		success: function(usuario){
			$('#username').val(usuario.username);
			$('#password').val(usuario.password);
			$('#email').val(usuario.email);
		},
	});
}

$.fn.serializeObject = function()
{
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};


var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
$("#btnActualizar").click(function (event){
	event.preventDefault();
	if( $("#username").val() == "" ){
		$("#username").focus().after(alertify.error("Ingresa un nombre de usuario"));
		return false;
	}else if( $("#email").val() == "" || !emailreg.test($("#email").val()) ){
		$("#email").focus().after(alertify.error("Ingresa un correo valido"));
		return false;
	}else if( $("#password").val() == ""){
		$("#password").focus().after(alertify.error("Ingresa una contraseña"));
		return false;
	}else if ($('#password').val() != $('#password2').val()) {
		$("#password2").focus().after(alertify.error("Las contraseñas no coinciden"));
		return false;
	}
	Actualizar();

});

$(document).ready(function() {
	Cargar();
});
