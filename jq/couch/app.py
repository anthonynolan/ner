#! /usr/bin/env python3

import json

from cloudant.client import CouchDB
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import requests

import pickle

word_to_index = pickle.load(open('../../data/word_to_index.pk', 'rb'))
pos_to_index = pickle.load(open('../../data/pos_to_index.pk', 'rb'))
index_to_pos = pickle.load(open('../../data/index_to_pos.pk', 'rb'))
winners = pickle.load(open('../../data/winners.pk', 'rb'))
UNK_WORD = '<UNK_WORD>'

app = Flask(__name__)
CORS(app)


@app.route('/paragraph/<id>', methods=['GET'])
def get_par_by_id(id):
    selector = {"id": {'$eq': int(id)}}    
    doc = db.get_query_result(selector)[0][0]
    print(doc)
    return jsonify(doc)

@app.route('/paragraph/', methods=['POST'])
def create_paragraph():
    print(request.json['content'])
    print(request.json['id'])
    doc = db.create_document({"content": request.json['content'], "id": request.json['id']})
    print(doc)
    return jsonify(doc)

@app.route('/paragraph/<id>', methods=['PUT'])
def save_modified_paragraph(id):
    selector = {"id": {'$eq': int(id)}}
    query_result = db.get_query_result(selector)[0][0]
    doc = db[query_result['_id']]
    doc['content'] = request.json['content']
    doc.save()
    return jsonify(doc)

@app.route('/pos/<id>', methods=['PUT'])
def pos_paragraph(id):
    selector = {"id": {'$eq': int(id)}}
    query_result = db.get_query_result(selector)[0][0]
    doc = db[query_result['_id']]
    tokens, parts_of_speech = run_predict_on_paragraph(doc['content'])
    results = []
    for a in zip(tokens, parts_of_speech):
        results.append(a)
    
    doc['words'] = results

    doc.save()
    return jsonify(doc)


from nltk import word_tokenize
# from utils import create_windowed_dataset, build_features_pos
import numpy as np

def create_windowed_dataset(input_dat, sequence_length, mode='train'):
    matrix = []
    for index in range(len(input_dat)):
        if index+sequence_length>len(input_dat):
            break
        if mode=='train':
            matrix.append(input_dat[index:index+sequence_length])
        else:
            matrix.append([(a, None) for a in input_dat[index:index+sequence_length]])
        index+=sequence_length
    return matrix
def build_features(matrix, mode='train'):
    transformed_matrix = []

    for row in matrix:
        features = []

        if mode=='train':
            features.append(pos_to_index[row[1][1]])
            features.append(pos_to_index[row[0][1]])
        else:
            features.append(pos_to_index[winners.get(row[1][0], 'NN')])
            features.append(pos_to_index[winners.get(row[0][0], 'NN')])
            
        features.append(word_to_index.get(row[2][0][-3:], word_to_index[UNK_WORD]))
        features.append(word_to_index.get(row[2][0][0], word_to_index[UNK_WORD]))

        features.append(word_to_index.get(row[2][0], word_to_index[UNK_WORD]))

        features.append(word_to_index.get(row[1][0], word_to_index[UNK_WORD]))

        features.append(word_to_index.get(row[1][0][-3:], word_to_index[UNK_WORD]))

        features.append(word_to_index.get(row[0][0], word_to_index[UNK_WORD]))
        features.append(word_to_index.get(row[3][0], word_to_index[UNK_WORD]))    
        features.append(word_to_index.get(row[3][0][-3:], word_to_index[UNK_WORD]))
        features.append(word_to_index.get(row[4][0], word_to_index[UNK_WORD]))
        
        if mode=='train':
            features.append(pos_to_index[row[2][1]])
        
        transformed_matrix.append(features)
    return transformed_matrix

sequence_length = 5

def run_predict_on_paragraph(par):
    tokens = word_tokenize(par)
    print(tokens)
    tokens = [token for token in tokens if token not in list(',.;()\'!?')+['--']+['\'\'']+['``']]
    predict_matrix = create_windowed_dataset(tokens,sequence_length, mode='predict')
    transformed_matrix = build_features(predict_matrix, mode='predict')
    r = requests.post(url='http://localhost:8501/v1/models/pos_checkpoint:predict', 
              data=json.dumps({"instances": transformed_matrix}))
    preds_from_serving = r.json()['predictions']

    lead_pos_tags = []
    lag_pos_tags = []

    # include the parts of speech for hte leading and following words
    for lead in range(0, (sequence_length//2)+1):
        lead_pos_tags.append(winners.get(tokens[lead].lower(), '<UNK>'))

    parts_of_speech_from_serving = [index_to_pos[a] for a in np.argmax(np.array(preds_from_serving), axis=1)]

    for lag in range(len(tokens) - (sequence_length//2), len(tokens)):
        lag_pos_tags.append(winners.get(tokens[lag].lower(), '<UNK>'))
        
    return tokens, lead_pos_tags+parts_of_speech_from_serving+lag_pos_tags

@app.route('/paragraph/<id>', methods=['DELETE'])
def delete_paragraph(id):
    selector = {"id": {'$eq': int(id)}}
    query_result = db.get_query_result(selector)[0][0]
    doc = db[query_result['_id']]
    doc.delete()
    return jsonify(doc)

if __name__=='__main__':
    client = CouchDB('admin', 'password1', url='http://127.0.0.1:5984', connect=True)  
    db = client['novel']
    app.run(debug=True)
