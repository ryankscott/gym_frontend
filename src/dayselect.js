import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


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

export default DaySelect;
