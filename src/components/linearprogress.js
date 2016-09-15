import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from 'material-ui/LinearProgress';

var LineProgress = React.createClass({
    render: function () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme() } >
                <LinearProgress />
            </MuiThemeProvider >
        )
    }
});

export default LineProgress;
