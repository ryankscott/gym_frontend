// TODO: Fix UTCOffset(0) 

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment'
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

injectTapEventPlugin();

String.prototype.toTitleCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

var appSearch =  function(i, props) {
}

import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
} from 'material-ui/styles/colors';



// var SearchBar = React.createClass({
// 		render: function() {
// 				return (

// 								<MuiThemeProvider muiTheme={getMuiTheme()} >
//                 <Drawer open={this.state.open}>
//                 <MenuItem>Menu Item</MenuItem>
//                 <MenuItem>Menu Item 2</MenuItem>
//                 </Drawer>
// 						</ MuiThemeProvider >
//         );
// 		}
// }) ;


var NavBar = React.createClass({
		render: function() {
				return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
                <AppBar
            showMenuIconButton={false}
            onTitleTouchTap={appSearch}
            iconElementLeft={<IconButton><SearchIcon /></IconButton>}
            title="Gym Search"
            className="navBar"
                />
								</ MuiThemeProvider >
        );
				}
}) ;
ReactDOM.render(<NavBar />, document.getElementById('navbar'));

//SearchBar
var SearchBar = React.createClass({
		getInitialState: function() {
    return {}
    },

    handleChange: _.debounce(function(event, index, value) {
		this.props.onUserInput(
				{filterText: index}
				);
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
						filteredGym: '',
						filterText: '',
						filterDay: 'today',
            filterDayBefore: '', 
						filterDayAfter: '',
						gymclass: [],
				    url: "http://localhost:9000/?limit=100"
				};
		},

		getClasses: function(url) {
				fetch(url).then(
						function(response) { 
						return response.json();
						}).then(function(res){
								this.filterResults(res)
						}.bind(this))
		},

		filterResults: function(response) {
		this.setState({
				gymclass: response,
				}) 
		},

		componentDidMount: function() {
				var url = this.state.url + "&before=" + encodeURIComponent(moment().endOf('day').format("YYYY-MM-DDTHH:mm:ssZ")) + "&after=" + encodeURIComponent(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
        console.log(url)
        this.getClasses(url);
		},	 

		componentWillUnmount: function() {
			this.serverRequest.abort();
		},

		handleDayChange: function(e) {
				var before, after = "";
				switch (e.filterDay) {
						case "today":
								after = moment().format("YYYY-MM-DDTHH:mm:ssZ");
								before = moment().endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
								break;
						case "tomorrow":
								after = moment().add(1,'days').startOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
								before = moment().add(1,'days').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
								break;
						case "thisWeek":
								after = moment().format("YYYY-MM-DDTHH:mm:ssZ");
								before = moment().add(1,'weeks').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
								break;
				}
				 this.setState({
						 filterDayAfter: after,
						 filterDayBefore: before
				 })
				 var url = this.state.url + "&gym=" + this.state.filteredGym + "&name=" + this.state.filterText + "&before=" + encodeURIComponent(before) + "&after=" + encodeURIComponent(after);
				 this.getClasses(url);
		},

		handleGymChange: function(input) {
		var url = this.state.url + "&gym=" + input.filteredGym + "&name=" + this.state.filterText + "&before=" + encodeURIComponent(this.state.filterDayBefore) + "&after=" + encodeURIComponent(this.state.filterDayAfter);
		this.setState({
				filteredGym: input.filteredGym
		});
		 this.getClasses(url);
		},

		handleTextChange: function(input) {
				this.setState({
						filterText: input.filterText
				});
				var url = this.state.url +	"&gym=" + this.state.filteredGym + "&name=" + input.filterText + "&before=" + encodeURIComponent(this.state.filterDayBefore) + "&after=" + encodeURIComponent(this.state.filterDayAfter);
				this.getClasses(url);
				},
		
		render: function() {
				return (
								<div>
								<div id="filterBar">
								<SearchBar 
										filterText={this.state.filterText}
										onUserInput={this.handleTextChange}
										/>
										<GymSelect 
												filteredGym={this.state.filteredGym}
												onUserInput={this.handleGymChange}
										/>
										 <DaySelect 
										 filterDay={this.state.filterDay}
										 onUserInput={this.handleDayChange}
								/>
								</div>
							 <div> 
								<GymClassTable
										gymclass={this.state.gymclass}
								/>
								</div>
								</div>
				)
		}
}); 

var DaySelect = React.createClass({
		getInitialState:function(){
				return {value: "today"};
		},

    handleChange: function(event, index, value) {
        this.setState({value: value})
        this.props.onUserInput({filterDay: value});
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
				var currentDay = null;
				if (this.props.gymclass != null) {
						this.props.gymclass.forEach(function(gymclass, index) {
								if (currentDay == null) {
										var currentDay = moment(gymclass.startdatetime);
								}
								rows.push(<GymClassRow gymclass={gymclass} key={index}/>);
						}.bind(this));
				} else {
						rows = [];
				}
				return (
		<div className="listOfCards"> {rows} </div>
				);
		}
});


var GymClassRow = React.createClass({
		render: function() {
				return (
								<MuiThemeProvider muiTheme={getMuiTheme()} >
								<Card className="gymCard" >
								<CardHeader
            titleStyle={{
                fontSize:'1.5em'
            }}
            subtitleStyle={{
                fontSize:'.8em'
            }}
            avatar= {<Avatar size={40} backgroundColor={pink400}>{this.props.gymclass.gym.toUpperCase().charAt(0)}</Avatar>}
            title={this.props.gymclass.name.toLowerCase()}
            subtitle={this.props.gymclass.gym.toLowerCase()}
                />
                <CardText
            style={{
                fontSize:'1em'
            }}
                >
                {this.props.gymclass.location.toLowerCase()} <br/>
                {moment(this.props.gymclass.startdatetime).utcOffset("+0").format("dddd h:mm a").toLowerCase()} <br/>
                {moment.duration(moment(this.props.gymclass.enddatetime).diff(moment(this.props.gymclass.startdatetime))).asMinutes()} minutes
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

