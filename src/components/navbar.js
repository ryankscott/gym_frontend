import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import navbar from './navbar.scss'


class NavBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div className={classNames('navbar', { 'classic': this.props.classic })}>
                <h1 className={classNames({'classic': this.props.classic})}> </h1>
            </div>
        );
    }
};

export default NavBar;
