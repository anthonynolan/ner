'use strict';

class BookList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch('http://localhost:5000/books')
            .then(resp => resp.json())
            .then(data => this.setState({ books: data['books'] }));
    }

    render() {
        let content;
        if (this.state.books) {
            content = this.state.books.map((book) => <Book title={book.title} key={book._id} />);
        } else {
            content = <div>loading..</div>;
        }
        return <div>{content}</div>;
    }
}

const Book = (props) => <div>{props.title}</div>;

const NewBook = (props)=> <div>input</div>;
    


ReactDOM.render(<BookList />, document.querySelector('#books-container'));