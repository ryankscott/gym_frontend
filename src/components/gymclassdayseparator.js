import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var GymClassDaySeparator = React.createClass({
    getInitialState: function () {
        return {};
    },

    render: function (props) {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme() } >
                <div className="separator">
                    <p> {this.props.day}  </p>
                    <hr />
                </div>
            </MuiThemeProvider>
        )
    }
});

export default GymClassDaySeparator;
