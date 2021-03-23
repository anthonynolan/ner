'use strict';

class BookList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.fetchAllBooks = this.fetchAllBooks.bind(this);
    }

    fetchAllBooks() {
        console.log('fetch');
        fetch('http://localhost:5000/books')
            .then(resp => resp.json())
            .then(data => this.setState({ books: data['books'] }));
    }

    componentDidMount() {
        this.fetchAllBooks();
    }

    render() {
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
        return <div>{content}<NewBook bookAdded={this.fetchAllBooks} /></div>;
    }
}

class Book extends React.Component {
    constructor(props) {
        super(props);
        this.deleteBook = this.deleteBook.bind(this);
    }
    deleteBook() {
        console.log(this);
        fetch(`http://localhost:5000/book/${this.props._id}/${this.props._rev}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => this.props.bookDeleted());
    }
    render() {
        return <div className="book" onClick={this.deleteBook}>{this.props.title} By {this.props.author}</div>;
    }
}

class NewBook extends React.Component {

    constructor(props) {
        super(props)
        this.state = { author: '', title: '' };
        this.authorChanged = this.authorChanged.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.saveNewBook = this.saveNewBook.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    saveNewBook() {
        fetch('http://localhost:5000/book/', {
            method: 'POST',
            body: JSON.stringify({ author: this.state.author, title: this.state.title }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => this.props.bookAdded());
    }

    authorChanged(event) {
        console.log(event.target.value);
        this.setState({ author: event.target.value });
    }

    titleChanged(event) {
        console.log(event.target.value);
        this.setState({ title: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();
        if (!this.state.author && !this.state.title) { return; }

        this.saveNewBook(this.state.author, this.state.title);
        this.setState({ author: '', title: '' });

        ['author', 'title'].forEach((e) => document.getElementById(e).value = '');

    }

    render() {
        return <div>
            <form onSubmit={this.onSubmit}>
                <div>
                    <label htmlFor="author">Author</label>
                    <input type="text" id="author" onChange={this.authorChanged} />
                </div>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" onChange={this.titleChanged} />
                </div>
                <input type="submit" value="Save" />
            </form>
        </div>;
    }
}

ReactDOM.render(<BookList />, document.querySelector('#books-container'));