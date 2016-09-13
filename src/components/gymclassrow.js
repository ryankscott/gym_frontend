import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'whatwg-fetch';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
} from 'material-ui/styles/colors';

var GymClassRow = React.createClass({
    getInitialState: function () {
        return {
            expanded: false,
            drivingTime: ''
        };
    },

    updateDriveTime: function (t) {
        this.setState({
            drivingTime: t + " minutes drive",
            expanded: false
        });
    },

    handleExpandChange: function () {
        if (this.state.expanded) {
            this.setState({ expanded: false });
        } else {
            var url = "http://localhost:9000/traveltime/".concat(
                "?origin=",
                this.props.userLatitude,
                ",",
                this.props.userLongitude,
                "&destination=",
                this.props.gymclass.latlong);

            fetch(url).then(function (response) {
                return response.text();
            }).then(function (t) {
                this.updateDriveTime(t);
            }.bind(this));
        }
    },
    render: function () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme() } >
                <Card
                    className="gymCard"
                    expandable={this.props.haveLocation}
                    initiallyExpanded={false}
                    onExpandChange={this.handleExpandChange}
                    >
                    <CardHeader
                        titleStyle={{
                            fontSize: '1.2em',
                        }}
                        subtitleStyle={{
                            fontSize: '.8em'
                        }}
                        avatar= {<Avatar size={40} backgroundColor={pink400}>{this.props.gymclass.gym.toUpperCase().charAt(0) }</Avatar>}
                        title={this.props.gymclass.name.toLowerCase() }
                        subtitle={this.props.gymclass.gym.toLowerCase() }
                        showExpandableButton={this.props.haveLocation}
                        />
                    <CardText
                        style={{
                            fontSize: '1em',
                            padding: '0px 16px 16px 16px'
                        }}
                        >
                        {this.props.gymclass.location.toLowerCase() } <br/>
                        {moment(this.props.gymclass.startdatetime).format("dddd h:mm a").toLowerCase() } <br/>
                        {moment.duration(moment(this.props.gymclass.enddatetime).diff(moment(this.props.gymclass.startdatetime))).asMinutes() } minutes
                    </CardText>
                    <CardText
                        expandable={true}
                        style={{
                            fontStyle: 'italic',
                            fontSize: '0.8em',
                            padding: '0px 16px 16px 16px'
                        }}
                        >
                        <div>
                            <FontIcon className="material-icons">
                                directions_car
                            </FontIcon>
                            {this.state.drivingTime}
                        </div>
                    </CardText>
                </Card>
            </MuiThemeProvider>
        )
    }
});

export default GymClassRow;
