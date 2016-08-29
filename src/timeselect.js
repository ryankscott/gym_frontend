import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
export default TimeSelect;
