import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



class EditBook extends React.Component {

    constructor(props) {
        super(props)
        console.log(props.book);
        this.state = { author: props.book.author, title: props.book.title };
        this.authorChanged = this.authorChanged.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.saveExistingBook = this.saveExistingBook.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    saveExistingBook() {
        fetch(`http://localhost:5000/book/${this.props.book._id}/${this.props.book._rev}`, {
            method: 'PUT',
            body: JSON.stringify({ author: this.state.author ? this.state.author : '', title: this.state.title ? this.state.title : '' }),
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
        // event.preventDefault();
        if (!this.state.author && !this.state.title) { return; }

        this.saveExistingBook(this.state.author, this.state.title);
        this.setState({ author: '', title: '' });

        ['author_edit', 'title_edit'].forEach((e) => document.getElementById(e).value = '');

    }

    render() {

        return <form>
            <TextField id="author_edit" label="Author" value={this.state.author} onChange={this.authorChanged} />
            <TextField id="title_edit" label="Title" value={this.state.title} onChange={this.titleChanged} />
            <Button variant="outlined" color="primary" onClick={() => this.onSubmit()}>Save</Button>
        </form>;
    }
}

export default EditBook;