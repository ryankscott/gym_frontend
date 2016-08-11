// TODO: Fix UTCOffset(0) 

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import 'whatwg-fetch';


import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';

injectTapEventPlugin();

String.prototype.toTitleCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
} from 'material-ui/styles/colors';




var NavBar = React.createClass({
		render: function() {
				return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
                <AppBar
                    showMenuIconButton={false}
                    iconElementLeft={<IconButton><SearchIcon /></IconButton>}
                    title="Gym Search"
                    className="navBar" />
								</ MuiThemeProvider >
        );
		}
});
ReactDOM.render(<NavBar />, document.getElementById('navbar'));

//SearchBar
var SearchBar = React.createClass({
		getInitialState: function() {
        return {value: ""};
    },

    handleChange: _.debounce(function(event, index, value) {
        this.setState({value: index});
        this.props.onUserInput({filterText: index});
		}, 300),
		render: function() {
				return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
                <TextField
                    className="searchBar"
                    hintText="Search for a class"
                    onChange={this.handleChange}
                    hintStyle={{
                        fontSize: '1em',
                        fontFamily: "Lato, sans-serif"
                    }}
                />
                </ MuiThemeProvider>
				)
		}
});

// FilterableGymClassTable
var FilterableGymClassTable = React.createClass({
		getInitialState: function() {
				return {
            haveLocation: false,
            userLatitude: '',
            userLongitude: '',
						filteredGym: '',
						filterText: '',
            filterDateBefore: moment().endOf('day'), 
            filterDateAfter: moment(),
            filterTimeAfter: moment({h:0, m:0, s:0}),
            filterTimeBefore: moment({h: 23, m:59, s:59}),
            gymclass: [],
				    url: "http://localhost:9000/class/?limit=100",
        };
		},

		getClasses: function(url) {
        fetch(url).then(
						function(response) { 
						return response.json();
						}).then(function(res){
								this.filterResults(res);
						}.bind(this));
		},

		filterResults: function(response) {
		    this.setState({
				    gymclass: response
		    }); 
		},

    gotGeoLocation: function(position){
        this.setState({
            haveLocation: true,
            userLatitude: position.coords.latitude,
            userLongitude: position.coords.longitude});
    },

		componentDidMount: function() {
        navigator.geolocation.getCurrentPosition(this.gotGeoLocation,
                                                 function() {
                                                     this.setState({haveLocation: false})
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

		componentWillUnmount: function() {
			this.serverRequest.abort();
		},

    handleChange: function(input) {

        // Good luck debugging this future me
        // I'm trying to merge these two objects, input should have the things that change and state the current state
        // If we have the attribute in the state, but not in the input then copy it to the input

        // TODO: Fix the bug here when the search is empty
        for (var attrname in this.state) {
            //console.log("attribute: " + attrname + " state: " + this.state[attrname] + " input: " + input[attrname]);
            if (this.state[attrname] && !input[attrname]){
                input[attrname] = this.state[attrname];
            }
        }

        this.setState(input, function() {
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


    render: function() {
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

var TimeSelect = React.createClass({
		getInitialState:function(){
				return {value: ""};
		},

    handleChange: function(event, index, value) {
        var before, after;
        switch (value) {
        case "":
            after=moment({h:0, m:0, s:0});
            before=moment({h: 23, m:59, s:59})
            break;
        case "morning":
            after=moment({h:0, m:0, s:0});
            before=moment({h: 11, m:59, s:59})
            break;
        case "afternoon":
            after=moment({h:12, m:0, s:0});
            before=moment({h: 15, m:59, s:59})
            break;
        case "evening":
            after=moment({h:16, m:0, s:0});
            before=moment({h: 23, m:59, s:59})
            break;

        }
        this.props.onUserInput({
            filterTimeAfter: after,
            filterTimeBefore: before}
                              );
        this.setState({value: value})
    },

		render: function() {
				return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
                    <SelectField
                        className="chooser"
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{
                            fontSize: '1em',
                            fontFamily: "Lato, sans-serif"
                        }}>
								        <MenuItem value="" primaryText="All day" />
								        <MenuItem value="morning" primaryText="Morning" />
								        <MenuItem value="afternoon" primaryText="Afternoon" />
								        <MenuItem value="evening" primaryText="Evening" />
						        </SelectField>
                </MuiThemeProvider >
				)
		}
});

var DaySelect = React.createClass({
		getInitialState:function(){
				return {value: "today"};
		},

    handleChange: function(event, index, value) {
				var before, after;
				switch (value) {
				case "today":
						after = moment();
						before = moment().endOf('day');
						break;
				case "tomorrow":
						after = moment().add(1,'days').startOf('day');
						before = moment().add(1,'days').endOf('day');
						break;
				case "thisWeek":
						after = moment();
						before = moment().add(1,'weeks').endOf('day');
						break;
				}
        this.props.onUserInput({
             filterDateAfter: after,
            filterDateBefore: before}
                              );

        this.setState({value: value});

    },

		render: function() {
				return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
                    <SelectField
                        className="chooser"
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{
                            fontSize: '1em',
                            fontFamily: "Lato, sans-serif"
                        }}
                    >
								        <MenuItem value="" primaryText="Any day" />
								        <MenuItem value="today" primaryText="Today" />
								        <MenuItem value="tomorrow" primaryText="Tomorrow" />
								        <MenuItem value="thisWeek" primaryText="This week" />
						        </SelectField>
                </MuiThemeProvider >
				)
		}
});

var GymSelect = React.createClass({
	getInitialState:function(){
			return {value: ""};
	},
		gymChange:function(event, index, value){
        this.setState({value: value})
				this.props.onUserInput(
						{filteredGym: value}
				);
		},
	
		render: function() {
				return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
					          <SelectField id = "dropdown"
                                 value={this.state.value}
                                 onChange={this.gymChange}
                                 className="chooser"
                                 style={{
                                     fontSize: '1em',
                                     fontFamily: "Lato, sans-serif"
                                 }}
					          >
								        <MenuItem value="" primaryText = "Any Gym" />
								        <MenuItem value="city" primaryText="City"/>
								        <MenuItem value="britomart" primaryText="Britomart" />
								        <MenuItem value="takapuna" primaryText="Takapuna" />
								        <MenuItem value="newmarket" primaryText="Newmarket" />
						    </SelectField>
            </MuiThemeProvider >
        )
		}
});

// GymClassTable
var GymClassTable = React.createClass({ 
		render: function() {
				var rows = [];
				var currentDay = moment();
				if (this.props.gymclass != null) {
						this.props.gymclass.forEach(function(gymclass, index) {
                if (moment(gymclass.startdatetime).dayOfYear() != currentDay.dayOfYear()) {
                    currentDay = moment(gymclass.startdatetime)
                    rows.push(<GymClassDaySeparator day={currentDay.format("dddd")}/>)
                }
		            rows.push(<GymClassRow
                              gymclass={gymclass}
                              haveLocation={this.props.haveLocation}
                              userLatitude={this.props.userLatitude}
                              userLongitude={this.props.userLongitude}
                              key={index}/>);
						}.bind(this));
				} else {
						rows = [];
				}
				return (
		        <div className="listOfCards"> {rows} </div>
				);
		}
});


var GymClassDaySeparator = React.createClass({
    getInitialState:function(){
        return {};
    },
    
    render: function(props) {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()} >
                <div className="separator">
                    <p> {this.props.day}  </p>
                    <hr />
                </div>
            </MuiThemeProvider>
        )
    }
});


var GymClassRow = React.createClass({
    getInitialState: function() {
        return {
            expanded: false,
            drivingTime: ''
        };
    },

    updateDriveTime: function(t) {
           this.setState({
               drivingTime: t + " minutes drive",
               expanded: false
           });
       },

       handleExpandChange:  function() {
           if (this.state.expanded)
               { this.setState({expanded: false});
               } else {
                   var url = "http://localhost:9000/traveltime/".concat(
                       "?origin=",
                       this.props.userLatitude,
                       ",",
                       this.props.userLongitude,
                       "&destination=",
                       this.props.gymclass.latlong);

                   fetch(url).then(function(response) {
                       return response.text();
                   }).then(function(t) {
                      this.updateDriveTime(t);
                   }.bind(this));
               }
       },
		render: function() {
        return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
								    <Card
                        className="gymCard"
                        expandable={this.props.haveLocation}
                        initiallyExpanded={false}
                        onExpandChange={this.handleExpandChange}
                >
								    <CardHeader
                            titleStyle={{
                                fontSize:'1.2em',
                            }}
                            subtitleStyle={{
                                fontSize:'.8em'
                            }}
                            avatar= {<Avatar size={40} backgroundColor={pink400}>{this.props.gymclass.gym.toUpperCase().charAt(0)}</Avatar>}
                            title={this.props.gymclass.name.toLowerCase()}
                        subtitle={this.props.gymclass.gym.toLowerCase()}
                        showExpandableButton={this.props.haveLocation}
                />
                        <CardText
                            style={{
                                fontSize:'1em',
                                padding:'0px 16px 16px 16px'
                            }}
                > 
                            {this.props.gymclass.location.toLowerCase()} <br/>
                            {moment(this.props.gymclass.startdatetime).format("dddd h:mm a").toLowerCase()} <br/>
                            {moment.duration(moment(this.props.gymclass.enddatetime).diff(moment(this.props.gymclass.startdatetime))).asMinutes()} minutes
                        </CardText>
                        <CardText
                            expandable={true}
                            style={{
                                fontStyle:'italic',
                                fontSize:'0.8em',
                                padding:'0px 16px 16px 16px'
                            }}
                        >
                            <div>
                            <FontIcon className="material-icons">
                                directions_car
                            </FontIcon>
                            {this.state.drivingTime}
                            </div>
                        </CardText>
                </Card>
                </MuiThemeProvider>
        )
    }
});

ReactDOM.render(
        <FilterableGymClassTable />,
    document.getElementById('content')
);


