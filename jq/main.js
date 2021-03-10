var ctx;
const contextSize = 5;
let wordsTagged = [];

$(document).ready(function () {
	$('textarea').on('keydown', textEntered);

	loadModel().then((results) => {
		ctx = results;
		console.log('ready to predict')
//		console.log(tf.argMax(ctx.model.predict(tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11], shape = [1, 11])).arraySync()[0]).arraySync());
	});
});

function createWindowedDataset(data) {
	let windowed = [];
	for (let i = 0; i <= data.length - contextSize; i++) {
		windowed[i] = data.slice(i, i + contextSize);
	}
	return windowed;
}

function textEntered() {
	
	let words = [];
	for (let word of this.value.split(' ')) {
		words[words.length] = { word: word, pos: null };
	}

	if (words.length >= contextSize) {
		windowed = createWindowedDataset(words);
		//Encode each of the 11 input features from each window to produce a new array
		
		for (row of windowed) {
			const features = [];

			//features.append(pos_to_index[row[1][1]])
			if (row[1].pos) {
				features[features.length] = ctx['pos_to_index.json'][row[1].pos];
			} else {
				const mostCommon = ctx['most_common_tag_for_word.json'][row[1].word];
				row[1].pos = mostCommon;
				features[features.length] = ctx['pos_to_index.json'][mostCommon];
			}

			//features.append(pos_to_index[row[0][1]])
			if (row[0].pos) {
				features[features.length] = ctx['pos_to_index.json'][row[0].pos];
			} else {
				const mostCommon = ctx['most_common_tag_for_word.json'][row[0].word];
				row[0].pos = mostCommon;
				features[features.length] = ctx['pos_to_index.json'][mostCommon];
			}

			//features.append(word_to_index[row[2][0][-3:]])
			features[features.length] = ctx['word_to_index.json'][row[2].word.slice(-3,)];

			// features.append(word_to_index[row[2][0][0]])
			features[features.length] = ctx['word_to_index.json'][row[2].word[0]];

			// features.append(word_to_index[row[2][0]])
			features[features.length] = ctx['word_to_index.json'][row[2].word];

			// features.append(word_to_index[row[1][0]])
			features[features.length] = ctx['word_to_index.json'][row[1].word];

			// features.append(word_to_index[row[1][0][-3:]])
			features[features.length] = ctx['word_to_index.json'][row[1].word.slice(-3,)];

			// features.append(word_to_index[row[0][0]])
			features[features.length] = ctx['word_to_index.json'][row[0].word];

			// features.append(word_to_index[row[3][0]])
			features[features.length] = ctx['word_to_index.json'][row[3].word];

			// features.append(word_to_index[row[3][0][-3:]])
			features[features.length] = ctx['word_to_index.json'][row[3].word.slice(-3,)];

			// features.append(word_to_index[row[4][0]])
			features[features.length] = ctx['word_to_index.json'][row[4].word];
			
			row[2].pos = ctx['index_to_pos.json'][tf.argMax(ctx.model.predict(tf.tensor2d(features, shape = [1, 11])).arraySync()[0]).arraySync()];
		}
		
	}
	
	renderWordsAndPos(words);
}

function renderWordsAndPos(words){
	$('#output').empty();
	words.forEach(element => {
		if (element.pos)
		{$('#output').append('<div><span>'+element.word+' </span><span>'+element.pos+' </span></div>');}
	});
}


async function loadModel() {
	var results = {};

	const jsonToLoad = ['word_to_index.json', 'pos_to_index.json', 'most_common_tag_for_word.json', 'index_to_pos.json'];
	for (let f of jsonToLoad) {
		$.getJSON(f, data => results[f] = data);
	}

	results.model = await tf.loadGraphModel('tfjs_pos_model/model.json');
	return results;
}

