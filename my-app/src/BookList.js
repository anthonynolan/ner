import React from 'react';
import Book from './Book';
import NetworkError from './NetworkError';
import NewBook from './NewBook';
import EditBook from './EditBook';

class BookList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { networkError: false , selectedBook: null};
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
    componentDidUpdate(oldProps){
        if(oldProps!==this.props){
            this.fetchAllBooks();
        }
    }

    render() {
        if (this.state.networkError)
            return <NetworkError />;
        let content;
        if (this.state.books) {
            content = this.state.books.map((book) => <Book
                bookDeleted={this.fetchAllBooks}
                selectBook={(book)=>this.setState({selectedBook: book})}
                title={book.title}
                author={book.author}
                _id={book._id}
                _rev={book._rev}
                book={book}
                key={book._id} />);
        } else {
            content = <div>loading..</div>;
        }
        let bookEditor;
        if (this.state.selectedBook){
            bookEditor = <EditBook book={this.state.selectedBook} bookAdded={this.fetchAllBooks}/>;
        }
        return <div>{content}<NewBook bookAdded={this.fetchAllBooks}/>
        {bookEditor}</div>;
    }
}

export default BookList;