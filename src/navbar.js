import React from 'react';
import ReactDOM from 'react-dom';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';


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

export default NavBar;
