import React, { Component } from 'react';

class App extends Component {
    render () {
        return (
            <div>
                <Election />
            </div>
        );
    }
}

class Election extends Component {

    constructor (props) {

        super(props);

        this.state = {
            newName: '',
            candidates: [
                { id: 0, name: 'John F Kennedy', votes: 0 },
                { id: 1, name: 'Richard M Nixon', votes: 0 }
            ]
        };

        this.handleNewName = this.handleNewName.bind(this);
        this.handleAddCandidate = this.handleAddCandidate.bind(this);

    }

    handleNewName (event) {
        this.setState({ newName: event.target.value });
    }

    handleAddCandidate () {

        // get the next candidate ID
        let nextID = (this.state.candidates.map(obj => {
            return obj.id;
        }).sort().reverse()[0] + 1) || 0;

        // set up the new candidate
        let newCandidate = {
            id: nextID,
            name: this.state.newName,
            votes: 0
        };

        // clear the input after adding a candidate
        this.setState({ newName: '' });

        // update candidates array
        this.setState({ candidates: [...this.state.candidates, newCandidate] });

    }

    handleDeleteCandidate (id) {

        // get the candidate(s) who won't be deleted
        let updateArray = this.state.candidates.filter(obj => {
            return obj.id !== id;
        });

        // set state.candidate to the updated array
        this.setState({ candidates: updateArray });

    }

    handleCastBallot (id) {

        // make a copy of the candidates array
        const updateArray = [...this.state.candidates];

        // get the candidate to update
        let updateCandidate = this.state.candidates.filter(obj => {
            return obj.id === id;
        })[0];

        // increment the vote
        updateCandidate.votes++;

        // set state.candidate to the updated array
        this.setState({ candidates: updateArray });

    }

    render () {
        return (
            <div>
                <div>
                    <Results candidates={this.state.candidates} />
                </div>
                <div>
                    <Vote candidates={this.state.candidates} handleCastBallot={this.handleCastBallot.bind(this)} />
                </div>
                <div>
                    <Candidates newName={this.state.newName}
                                candidates={this.state.candidates}
                                handleNewName={this.handleNewName.bind(this)}
                                handleAddCandidate={this.handleAddCandidate.bind(this)}
                                handleDeleteCandidate={this.handleDeleteCandidate.bind(this)}
                    />
                </div>
            </div>
        );
    }

}

class Results extends Component {

    render () {

        // make a local copy of candidates
        this.localCandidates = [...this.props.candidates];

        // sort candidates by vote
        this.localCandidates.sort((a, b) => {
            return b.votes - a.votes;
        });

        // tally the votes
        this.totalVotes = this.localCandidates.map(item => {
            return item.votes;
        }).reduce((previousVal, currentVal) => previousVal + currentVal, 0);

        this.candidateResults = this.localCandidates.map((candidate, index) =>
            <tr key={candidate.id}>
                <td>{index + 1}</td>
                <td>{candidate.name} ({candidate.id + 1})</td>
                <td>{candidate.votes}</td>
                <td>{this.totalVotes > 0 && ((candidate.votes / this.totalVotes) * 100).toFixed(2) + '%'}</td>
            </tr>
        );

        return (
            <div>
                <h3>Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Candidate</th>
                            <th>Votes</th>
                            <th>Proportion</th>
                        </tr>
                        {this.candidateResults}
                        <tr>
                            <td></td>
                            <td></td>
                            <td>Total</td>
                            <td>{this.totalVotes}</td>
                            <td></td>
                        </tr>
                    </thead>
                </table>
            </div>
        );

    }

}

class Vote extends Component {

    render () {

        this.candidateButtons = this.props.candidates.map(candidate =>
            <button key={candidate.id}
                    type="button"
                    onClick={this.props.handleCastBallot.bind(this, candidate.id)}
                    style={{padding: '5px', margin: '10px'}}>
                {candidate.name}
            </button>
        );

        return (
            <div>
                <div>
                    <h3>Vote</h3>
                </div>
                <div>{this.candidateButtons}</div>
            </div>
        );

    }

}

class Candidates extends Component {

    render () {

        this.candidateList = this.props.candidates.map(candidate =>
            <li key={candidate.id}
                style={{padding: '5px', margin: '10px'}}>
                {candidate.name}&nbsp;
                <button type="button" onClick={this.props.handleDeleteCandidate.bind(this, candidate.id)}>
                    Delete
                </button>
            </li>
        );

        return (
            <div>
                <div>
                    <h3>Candidates</h3>
                </div>
                <div>
                    <input placeholder="Name" value={this.props.newName} onChange={this.props.handleNewName} />
                    <button type="button" onClick={this.props.handleAddCandidate}>Add</button>
                </div>
                <div>
                    <ol>
                        {this.candidateList}
                    </ol>
                </div>
            </div>
        );

    }

}

export default App;
