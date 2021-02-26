$(document).ready(function() {
	console.log('ready');
	$('textarea').on('keydown', textEntered);
	$('#loadModel').on('click', loadModel);
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

async function loadModel(){
	
	const model = await tf.loadGraphModel('http://127.0.0.1:8887/tfjs_model/model.json');
	console.log(model);
	model.execute(tf.tensor2d([1,2,3], shape=[1,3]))

}