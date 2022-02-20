function goBack(){
	window.location.href = "../../index.html"
}

window.onload = function(){
	$.ajax({
		url:"../backend/profile.php",
		method: "POST",
		data:{
			user: 1
		},
		success: function(data){
			if(data){
				dados = JSON.parse(data)
				$('#shots').html(dados.disparos)
				$('#hits').html(dados.acertos)
				$('#miss').html(dados.erros)
				$('#hitPercentage').html(dados.taxaDeAcerto+"%")
				$('#user').html(dados.nome)
				$('#status').html(dados.status)
			}
		}
	})
}

window.onbeforeunload = function(){
	return '';
};

//CUT
// function mark() {
// 	let fileLabel = document.getElementById("fileInputLabel")
// 	let fileInput = document.getElementById('fileInput')
// 	let docName = fileInput.value
// 	let filePath = docName.split("\\");
// 	let fileName = filePath.at(-1)
	
// 	fileLabel.innerHTML = fileName
// 	fileLabel.classList.toggle('fileFilled', this.files.length);
// }
// document.getElementById('fileInput').addEventListener('change', mark);