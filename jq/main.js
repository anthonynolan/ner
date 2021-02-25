$(document).ready(function() {
	console.log('ready');
	$('textarea').on('keydown', textEntered)
});

const contextSize = 2;
let wordsTagged = [];

function textEntered(){
	let words = this.value.split(' ');
	
	if (words.length>=contextSize){		
		tagWords(words);
	}
}

function tagWords(words){
	wordsTagged = [];
	for (word of words){
		wordsTagged[wordsTagged.length] = {word: "POS"};
	}
	console.log(wordsTagged);
}
