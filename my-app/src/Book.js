import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



class Book extends React.Component {
    constructor(props) {
        super(props);
        this.deleteBook = this.deleteBook.bind(this);
        this.editBook = this.editBook.bind(this);
    }

    deleteBook() {
        fetch(`http://localhost:5000/book/${this.props._id}/${this.props._rev}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => this.props.bookDeleted());
    }

    editBook() {
        this.props.selectBook(this.props.book);
    }


    render() {
        return (<div>
            <Typography className="book" onClick={this.editBook}>{this.props.title} By {this.props.author}</Typography>
            <Button onClick={this.deleteBook}>Delete</Button>
        </div>);
    }
}

export default Book;