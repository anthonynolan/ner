$(document).ready(function () {
	
	var ctx;
	
	$('textarea').on('keydown', textEntered);
	
	loadModel().then((results) => { 
		ctx = results;
		console.log('ready to predict') 
		console.log(tf.argMax(ctx.model.predict(tf.tensor2d([1,2,3,4,5,6,7,8,9,0,11], shape=[1,11])).arraySync()[0]).arraySync());
	});
});

const contextSize = 5;
let wordsTagged = [];

function textEntered() {
	let words = this.value.split(' ');

	if (words.length >= contextSize) {
		//Create the windowed dataset of width contextSize
		//Encode each of the 11 input features from each window to produce a new array

		//const features = []
		// features.append(pos_to_index[row[1][1]])
		// features.append(pos_to_index[row[0][1]])
		// features.append(word_to_index[row[2][0][-3:]])
		// features.append(word_to_index[row[2][0][0]])
		// features.append(word_to_index[row[2][0]])
		// features.append(word_to_index[row[1][0]])
		// features.append(word_to_index[row[1][0][-3:]])
		// features.append(word_to_index[row[0][0]])
		// features.append(word_to_index[row[3][0]])
		// features.append(word_to_index[row[3][0][-3:]])
		// features.append(word_to_index[row[4][0]])
		// features.append(pos_to_index[row[2][1]])


		//Run predict with each of the arrays
		//decode the responses and output the pairs.

		wordsTagged = [];
		for (word of words) {
			wordsTagged[wordsTagged.length] = { "POS": "POS", "word": word };
		}
		console.log(wordsTagged);
	
	}
}

async function loadModel() {
	var results = {};

	$.getJSON('word_to_index.json', (data) => {
		results.wordToIndex = data;
	});

	$.getJSON('pos_to_index.json', (data) => {
		results.posToIndex = data;
	});

	results.model = await tf.loadGraphModel('http://127.0.0.1:8887/tfjs_model/model.json');

	return results;
}

	