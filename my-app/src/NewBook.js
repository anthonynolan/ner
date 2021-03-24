import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



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
        // event.preventDefault();
        if (!this.state.author && !this.state.title) { return; }

        this.saveNewBook(this.state.author, this.state.title);
        this.setState({ author: '', title: '' });

        ['author', 'title'].forEach((e) => document.getElementById(e).value = '');

    }

    render() {
        return <form>
                <TextField id="author" label="Author" onChange={this.authorChanged} />
                <TextField id="title" label="Title" onChange={this.titleChanged} />
                <Button variant="outlined" color="primary" onClick={()=>this.onSubmit()}>Save</Button>
            </form>;
    }
}

export default NewBook;