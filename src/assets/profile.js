function goBack(){
	window.location.href = "../../index.html"
}

window.onbeforeunload = function(){
	return '';
};

function mark() {
	let fileLabel = document.getElementById("fileInputLabel")
	let fileInput = document.getElementById('fileInput')
	let docName = fileInput.value
	let filePath = docName.split("\\");
	let fileName = filePath.at(-1)
	
	fileLabel.innerHTML = fileName
	fileLabel.classList.toggle('fileFilled', this.files.length);
}
document.getElementById('fileInput').addEventListener('change', mark);