import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';

var Spinner = React.createClass({
    render: function () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme() } >
                <CircularProgress
                    className="spinner"
                    />
            </MuiThemeProvider >
        )
    }
});

export default Spinner;
