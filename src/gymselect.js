import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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

export default GymSelect;
