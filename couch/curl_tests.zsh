# Paragraph


curl -X POST localhost:5000/paragraph/ -d '{"id": 1, "content": "By Anto Nolan"}' -H "Content-Type: application/json"
curl -X GET localhost:5000/paragraph/1
curl -X DELETE localhost:5000/paragraph/1
curl -X PUT localhost:5000/paragraph/1 -d '{"content": "By Anto Nolan2"}' -H "Content-Type: application/json"

# Book

curl -X POST localhost:5000/book/ -d '{"author": "Anto Nolan", "title": "The right stuff"}' -H "Content-Type: application/json"
curl -X GET localhost:5000/book/986e82e4dc9b35d67a1c24e345014571
curl -X DELETE localhost:5000/book/986e82e4dc9b35d67a1c24e345013bb6/1-21acdf705d381db21363b42540320381
curl -X PUT localhost:5000/book/986e82e4dc9b35d67a1c24e345014571/1-21acdf705d381db21363b42540320381 -d '{"author": "By Anto Nolan2", "title": "New title"}' -H "Content-Type: application/json"

# All Books
curl -X GET localhost:5000/books
