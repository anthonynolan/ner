'use strict';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentParagraphId: 0, content: null };
    }

    setParagraphId = (event) => {
        this.setState({ currentParagraphId: event.target.value });
    }

    clicked = (arg) => {
        let current = this.state.currentParagraphId;
        if (arg < 0) {
            if (current <= 0) return;
            current--;
        } else {
            current++;
        }
        this.setState({ currentParagraphId: current });
    }

    doFetch = ()=> {
        fetch('http://localhost:5000/paragraph/' + this.state.currentParagraphId)
            .then(resp => resp.json())
            .then(data => this.setState({ content: data['content'] }));
    }

    pos = () => {
        fetch('http://localhost:5000/pos/' + this.state.currentParagraphId, { method: 'PUT' })
            .then(resp => resp.json())
            .then(data => this.setState({ content: data['content'] }));
    }

    render() {
        return (<div>
            <Button click={this.clicked.bind(this, -1)} label="Previous" />
            <Button click={this.clicked.bind(this, +1)} label="Next" />
            <Button click={this.pos} label="POS Tag this paragraph" />
            <ParagraphIdDisplay currentParagraphId={this.state.currentParagraphId} changer={this.setParagraphId} />
            <ParagraphDisplay currentParagraphId={this.state.currentParagraphId} content={this.state.content} doFetch={this.doFetch}/>
        </div>);
    }
}

class ParagraphDisplay extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { content: null };
    }

    // doFetch() {
    //     fetch('http://localhost:5000/paragraph/' + this.props.currentParagraphId)
    //         .then(resp => resp.json())
    //         .then(data => this.setState({ content: data['content'] }));

    // }

    componentDidMount() {
        this.props.doFetch();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.currentParagraphId !== this.props.currentParagraphId) {
            this.props.doFetch();
        }
    }

    render() {
        return <div>{this.props.content}</div>;
    }
}

const ParagraphIdDisplay = (props) => <div>Current paragraph id:
    <input type="text" value={props.currentParagraphId} onChange={props.changer} />
</div>

const Button = (props) => <button onClick={props.click}>{props.label}</button>;

ReactDOM.render(<App />, document.querySelector('#like_button_container'));