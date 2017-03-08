function onDragOver(e){
	e.stopPropagation();
	e.preventDefault();
}

function onFilesDropped(e){
	e.stopPropagation();
	e.preventDefault();
	var files = e.dataTransfer.files;
	var total = 0;
	document.getElementById('input4').files = files;

	document.getElementById('filedrop').innerHTML="";

	for (var i = 0; i < files.length; i++){
		var fileinfo = '<p><img src="img/fileimg.png" alt="">'+ files[i].name;
		document.getElementById('filedrop').innerHTML += fileinfo;
	}
	document.getElementById('filedrop').innerHTML += '<p style="font-size :12px">Total of ' + files.length + " files";
	document.getElementById("outfiledrop").style.fontSize = "8px";
	document.getElementById("filedrop").style.textAlign="";
	document.getElementById("filedrop").style.paddingTop="";
}

function onFileChange(e){
	var files = document.getElementById('input4').files;
	var total = 0;

	document.getElementById('filedrop').innerHTML="";

	for (var i = 0; i < files.length; i++){
		var fileinfo = '<p><img src="img/fileimg.png" alt="">'+ files[i].name;
		document.getElementById('filedrop').innerHTML += fileinfo;
	}
	document.getElementById('filedrop').innerHTML += '<p style="font-size :12px">Total of ' + files.length + " files";
	document.getElementById("outfiledrop").style.fontSize = "8px";
	document.getElementById("filedrop").style.textAlign="";
	document.getElementById("filedrop").style.paddingTop="";
}

function init(){
	document.getElementById("filedrop").addEventListener("drop", onFilesDropped);
	document.getElementById("filedrop").addEventListener("dragover", onDragOver);
	document.getElementById("input4").addEventListener("change",onFileChange);
}

window.addEventListener("load", init);