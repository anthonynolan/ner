'use strict';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentParagraphId: 0, content: null };
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

    render() {
        return (<div>
            <Button click={this.clicked.bind(this, -1)} label="Previous" />
            <Button click={this.clicked.bind(this, +1)} label="Next" />
            <CurrentParagraphIdDisplay currentParagraphId={this.state.currentParagraphId} />
            <ParagraphDisplay currentParagraphId={this.state.currentParagraphId}></ParagraphDisplay>
        </div>);
    }
}

class ParagraphDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { content: null };
    }

    doFetch() {
        fetch('http://localhost:5000/paragraph/' + this.props.currentParagraphId)
            .then(resp => resp.json())
            .then(data => this.setState({ content: data['content'] }));

    }

    componentDidMount() {
        this.doFetch();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.currentParagraphId !== this.props.currentParagraphId) {
            this.doFetch();
        }
    }

    render() {
        return <div>{this.state.content}</div>;
    }
}

const CurrentParagraphIdDisplay = (props) => <div>Current paragraph id: <span>{props.currentParagraphId}</span></div>
const Button = (props) => <button onClick={props.click}>{props.label}</button>;

ReactDOM.render(<App />, document.querySelector('#like_button_container'));