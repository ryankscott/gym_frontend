import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GymClassRow from './gymclassrow.js'
import GymClassDaySeparator from './gymclassdayseparator.js'

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

export default GymClassTable;
