import React from 'react';
import Typography from '@material-ui/core/Typography';




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
        return <Typography className="book" onClick={this.deleteBook}>{this.props.title} By {this.props.author}</Typography>;
    }
}

export default Book;