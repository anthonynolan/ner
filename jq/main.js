var ctx;

$(document).ready(function () {
	$('textarea').on('keydown', textEntered);

	loadModel().then((results) => { 
		ctx = results;
		console.log('ready to predict') 
		console.log(tf.argMax(ctx.model.predict(tf.tensor2d([1,2,3,4,5,6,7,8,9,0,11], shape=[1,11])).arraySync()[0]).arraySync());
	});
});

const contextSize = 5;
let wordsTagged = [];

function createWindowedDataset(data){
	let windowed = [];
	for(let i = 0; i< data.length-contextSize ; i++){
		windowed[i]=data.slice(i, i+contextSize);
	}
	return windowed;
}

function textEntered() {
	
	let words = [];
	for (let word of this.value.split(' ')){
		words[words.length] = {word: word, pos: null};
	}

	if (words.length >= contextSize) {
		//Create the windowed dataset of width contextSize
		windowed = createWindowedDataset(words);
		console.log(windowed);
		//Encode each of the 11 input features from each window to produce a new array
		tags = []
		for (row of windowed){
			const features = [];

			//features.append(pos_to_index[row[1][1]])
			if (row[1].pos){
				features[features.length] = ctx['pos_to_index.json'][row[1].pos];
			}else{
				features[features.length] = ctx['pos_to_index.json'][ctx['most_common_tag_for_word.json'][row[1].word]];
			}

			//features.append(pos_to_index[row[0][1]])
			if(row[0].pos){
				features[features.length] = ctx['pos_to_index.json'][row[0].pos];
			}else{
				features[features.length] = ctx['pos_to_index.json'][ctx['most_common_tag_for_word.json'][row[0].word]];
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
			features[features.length]=ctx['word_to_index.json'][row[3].word];

			// features.append(word_to_index[row[3][0][-3:]])
			features[features.length]=ctx['word_to_index.json'][row[3].word.slice(-3,)];

			// features.append(word_to_index[row[4][0]])
			features[features.length]= ctx['word_to_index.json'][row[4].word];

			//don't need this one as it is the target
			// features.append(pos_to_index[row[2][1]])

			// while you are adding and removing features it is handy to uncommend these to keep the predict code functioning albeit it with partially dummy input.
			//features.length = 11;
			//features.fill(0, features.length);
			
			console.log('features '+features);

			tags[tags.length] = ctx['index_to_pos.json'][tf.argMax(ctx.model.predict(tf.tensor2d(features, shape=[1,11])).arraySync()[0]).arraySync()];

		}
		console.log(tags);
	}
}

async function loadModel() {
	var results = {};

	const jsonToLoad = ['word_to_index.json', 'pos_to_index.json', 'most_common_tag_for_word.json', 'index_to_pos.json'];
	for (let f of jsonToLoad){
		console.log(f);
		$.getJSON(f, (data) => {
			results[f] = data;
		});
	}

	results.model = await tf.loadGraphModel('http://127.0.0.1:8887/tfjs_model/model.json');
	return results;
}

	