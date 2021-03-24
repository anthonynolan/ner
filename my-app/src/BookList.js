import React from 'react';
import Book from './Book';
import NetworkError from './NetworkError';
import NewBook from './NewBook';

class BookList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { networkError: false };
        this.fetchAllBooks = this.fetchAllBooks.bind(this);
    }

    fetchAllBooks() {
        console.log('fetch');
        fetch('http://localhost:5000/books')
            .then(resp => resp.json())
            .then(data => this.setState({ books: data['books'] }))
            .catch((e) => this.setState({ networkError: true }));
    }

    componentDidMount() {
        this.fetchAllBooks();
    }

    render() {
        if (this.state.networkError)
            return <NetworkError />;
        let content;
        if (this.state.books) {
            content = this.state.books.map((book) => <Book
                bookDeleted={this.fetchAllBooks}
                title={book.title}
                author={book.author}
                _id={book._id}
                _rev={book._rev}
                key={book._id} />);
        } else {
            content = <div>loading..</div>;
        }
        return <div>{content}<NewBook bookAdded={this.fetchAllBooks}/></div>;
    }
}

export default BookList;