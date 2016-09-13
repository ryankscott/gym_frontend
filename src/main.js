import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import 'whatwg-fetch';


import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import SearchBar from './components/searchbar.js';
import TimeSelect from './components/timeselect.js';
import DaySelect from './components/dayselect.js';
import GymSelect from './components/gymselect.js';
import GymClassDaySeparator from './components/gymclassdayseparator.js';
import GymClassTable from './components/gymclasstable.js';
import NavBar from './components/navbar.js';
import Spinner from './components/spinner.js';


injectTapEventPlugin();

String.prototype.toTitleCase = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

ReactDOM.render(<NavBar />, document.getElementById('navbar'));


// FilterableGymClassTable
var FilterableGymClassTable = React.createClass({
    getInitialState: function () {
        return {
            haveLocation: false,
            userLatitude: '',
            userLongitude: '',
            filteredGym: '',
            filterText: '',
            filterDateBefore: moment().endOf('day'),
            filterDateAfter: moment(),
            filterTimeAfter: moment({ h: 0, m: 0, s: 0 }),
            filterTimeBefore: moment({ h: 23, m: 59, s: 59 }),
            gymclass: [],
            url: process.env.API_URL + "class/?limit=100",
            spinning: true
        };
    },

    getClasses: function (url) {
        fetch(url).then(
            function (response) {
                return response.json();
            }).then(function (res) {
                this.filterResults(res);
            }.bind(this));
    },

    filterResults: function (response) {
        this.setState({
            spinning: false,
            gymclass: response
        });
        console.log(this.state.spinning)
    },

    gotGeoLocation: function (position) {
        this.setState({
            haveLocation: true,
            userLatitude: position.coords.latitude,
            userLongitude: position.coords.longitude
        });
    },

    componentDidMount: function () {
        navigator.geolocation.getCurrentPosition(this.gotGeoLocation,
            function () {
                this.setState({ haveLocation: false })
            }.bind(this))

        var url = this.state.url.concat("&gym=",
            this.state.filteredGym,
            "&name=",
            this.state.filterText,
            "&before=",
            encodeURIComponent(this.state.filterDateBefore.format("YYYY-MM-DDTHH:mm:ssZ")),
            "&after=",
            encodeURIComponent(this.state.filterDateAfter.format("YYYY-MM-DDTHH:mm:ssZ")));
        this.getClasses(url);
    },

    componentWillUnmount: function () {
        this.serverRequest.abort();
    },

    handleChange: function (input) {

        // Good luck debugging this future me
        // I'm trying to merge these two objects, input should have the things that change and state the current state
        // If we have the attribute in the state, but not in the input then copy it to the input
        for (var attrname in this.state) {
            if (this.state[attrname] && (!input[attrname] && input[attrname] != "")) {
                input[attrname] = this.state[attrname];
            }
        }

        this.setState(input, function () {
            // Prepare the datetime
            var beforeDateTime = moment({
                'year': this.state.filterDateBefore.year(),
                'month': this.state.filterDateBefore.month(),
                'day': this.state.filterDateBefore.date(),
                'hour': this.state.filterTimeBefore.hour(),
                'minute': this.state.filterTimeBefore.minute(),
                'second': this.state.filterTimeBefore.second()
            });

            var afterDateTime = moment({
                'year': this.state.filterDateAfter.year(),
                'month': this.state.filterDateAfter.month(),
                'day': this.state.filterDateAfter.date(),
                'hour': this.state.filterTimeAfter.hour(),
                'minute': this.state.filterTimeAfter.minute(),
                'second': this.state.filterTimeAfter.second()
            });


            var url = this.state.url.concat("&gym=",
                this.state.filteredGym,
                "&name=",
                this.state.filterText,
                "&before=",
                encodeURIComponent(beforeDateTime.format("YYYY-MM-DDTHH:mm:ssZ")),
                "&after=",
                encodeURIComponent(afterDateTime.format("YYYY-MM-DDTHH:mm:ssZ")));
            this.getClasses(url);
        });
    },


    render: function () {
        return (
            <div>
                <div id="filterBar">
                    <SearchBar
                        filterText={this.state.filterText}
                        onUserInput={this.handleChange}
                        />
                    <GymSelect
                        filteredGym={this.state.filteredGym}
                        onUserInput={this.handleChange}
                        />
                    <DaySelect
                        value={this.state.value}
                        filterDateBefore={this.state.filterDateBefore}
                        filterDateAfter={this.state.filterDateAfter}
                        onUserInput={this.handleChange}
                        />
                    <TimeSelect
                        filterTimeBefore={this.state.filterTimeBefore}
                        filterTimeAfter={this.state.filterTimeAfter}
                        onUserInput={this.handleChange}
                        />
                </div>
                <div className="spinner">
                    {this.state.spinning ? <Spinner/> : null}
                </div>
                <div>
                    <GymClassTable
                        gymclass={this.state.gymclass}
                        haveLocation={this.state.haveLocation}
                        userLatitude={this.state.userLatitude}
                        userLongitude={this.state.userLongitude}
                        />
                </div>
            </div>
        )
    }
});



ReactDOM.render(
    <FilterableGymClassTable />,
    document.getElementById('content')
);


