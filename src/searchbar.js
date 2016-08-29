import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import _ from 'lodash';
import React, { Component } from 'react';

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

export default SearchBar;
