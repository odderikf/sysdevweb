let form = document.querySelector("#setning");
let button = document.querySelector("#sendSetning");cd
let content = document.querySelector("#content");
let url = //"http://bigdata.stud.iie.ntnu.no/sentiment/webresources/sentiment?api-key=Happy!!!";

function handleJson(json){
	console.log(json)
	content.className = "happy" + json.value;
}

form.addEventListener( 'keyup', e => {if(e.key == "Enter") fetchMood(null)} )

button.addEventListener("click", fetchMood);

function fetchMood(){
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		},
		body: JSON.stringify({ sentence: form.value })
	})
	.then(response => response.json())
	.then(handleJson);
}
