import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import 'whatwg-fetch';
import './app.scss'


import GymSearch from './components/gymsearch.js';
import GymClassTable from './components/gymclasstable.js'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classes: null,
            classic: false
        }
        this.onSearch = this.onSearch.bind(this)
    }

    onSearch(e) {
        var url = __GYMCLASS_URL__ + "/search/?q=" + e
        fetch(url).then(
            function (response) {
                return response.json();
            }).then(function (res) {
                console.log(res)
                this.setState({ classes: res })
            }.bind(this));
    }


    render() {
        return (
            <div>
                <div className="container">
                    <div className="title">
                        <img src={require("./img/dumbbell.svg")} className="logo" />
                        <h1> Gym Search </h1>
                    </div>
                    <GymSearch
                        placeholder={"Search for a class"}
                        onSearch={this.onSearch}
                        classic={this.state.classic}
                        />
                    <GymClassTable
                        gymclass={this.state.classes}
                        classic={this.state.classic}
                        />
                </div>
            </div>
        )
    }
};
export default App


ReactDOM.render(
    <App />,
    document.getElementById('content')
);


