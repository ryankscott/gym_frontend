import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import classNames from 'classnames';
import gymclasstable from './gymclasstable.scss'


//TODO: No classes found

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}


class GymClassTable extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		var rows = [];
		var spacer;
		var dayFormat = "dddd"
		var width  = window.innerWidth || documentElement.clientWidth || body.clientWidth;
		if (width < 1000) {
			dayFormat = "ddd"
			spacer = <br/>
		}
		if (this.props.gymclass != null) {
			this.props.gymclass.forEach(function (gymclass, index) {
				rows.push(
					<div key={index} className={classNames('gym-class-table-row', { 'classic': this.props.classic })}>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}> {toTitleCase(gymclass.gym)} </div>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}> {toTitleCase(gymclass.name)}</div>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}>
							{gymclass.location}</div>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}>
							{moment(gymclass.startdatetime).format(dayFormat)} {spacer}
							{moment(gymclass.startdatetime).format("h:mm a")} </div>
					</div>
				)
			}.bind(this))
		}
		return (
			<div className="gym-class-table-wrapper">
			<div className={classNames('gym-class-table', { 'classic': this.props.classic })}>
				<div className={classNames('gym-class-table-row header', { 'hidden': (this.props.gymclass == null) || (this.props.gymclass.length == 0) })}>
					<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic }, { 'hidden': (this.props.gymclass == null) || (this.props.gymclass.length == 0)})}>Gym</div>
					<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic }, { 'hidden': (this.props.gymclass == null) || (this.props.gymclass.length == 0)})}>Class</div>
					<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic }, { 'hidden': (this.props.gymclass == null) || (this.props.gymclass.length == 0)})}>Location</div>
					<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic }, { 'hidden': (this.props.gymclass == null) || (this.props.gymclass.length == 0)})}>Start Time</div>
				</div>
				{rows}
			</div>
			<div className={classNames('no-class-text-container', {'hidden': (this.props.gymclass == null) || (this.props.gymclass != null && this.props.gymclass.length > 0) })}>
				<p className={classNames('no-class-text', {'hidden': (this.props.gymclass == null) || (this.props.gymclass != null && this.props.gymclass.length > 0) })}> No classes found ☹️ </p>
			</div>
			</div>
		);
	}
};

export default GymClassTable;


