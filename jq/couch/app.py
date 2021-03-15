#! /usr/bin/env python3

import json

from cloudant.client import CouchDB
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/paragraph/<id>', methods=['GET'])
def get_par_by_id(id):
    selector = {"id": {'$eq': int(id)}}    
    doc = db.get_query_result(selector)[0][0]
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
