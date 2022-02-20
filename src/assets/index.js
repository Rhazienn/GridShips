window.onload = function(){
	$('#cadastro').submit(function(e){
		e.preventDefault();
		if($('#password').val() === $('#passwordConfirm').val()){
			$.ajax({
				url: 'src/backend/cadastro.php',
				type: 'post',
				data: $('#cadastro').serialize(),
				success:function(data){
					dados = JSON.parse(data)
					if(dados.msg){
						alert(dados.msg)
						$('#close').click();
					}
				}
			});
		} else {
			alert("As senhas não coincidem!")
		}
	});

	$('#login').submit(function(e){
		e.preventDefault();
		$.ajax({
			url: 'src/backend/login.php',
			type: 'post',
			data: {
				username:$('#name').val(),
				password:$('#pass').val()
			},
			success:function(data){
				dados = JSON.parse(data)
				if(dados.msg){
					alert(dados.msg)
					$('#close').click();
				}
			}
		});
	});
}

function play(){
	window.location.href = "src/views/game_converted.html"
}
function stats(){
	window.location.href = "src/views/profile.html"
}