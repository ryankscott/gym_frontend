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
		if (this.props.gymclass != null) {
			this.props.gymclass.forEach(function (gymclass, index) {
				rows.push(
					<div key={index} className={classNames('gym-class-table-row', { 'classic': this.props.classic })}>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}> {toTitleCase(gymclass.gym)} </div>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}> {toTitleCase(gymclass.name)}</div>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}>
							{gymclass.location}</div>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}>
							{moment(gymclass.startdatetime).format("dddd h:mm a")} </div>
						<div className={classNames('gym-class-table-cell', { 'classic': this.props.classic })}>
							{moment.duration(moment(gymclass.enddatetime).diff(moment(gymclass.startdatetime))).asMinutes()} minutes </div>
					</div>
				)
			}.bind(this))
		}
		return (
			<div className="gym-class-table-wrapper">
			<div className={classNames('gym-class-table', { 'classic': this.props.classic }, { 'hidden': !this.props.gymclass })}>
				<div className={'gym-class-table-row'}>
					<div className={classNames('gym-class-table-cell', 'header', { 'classic': this.props.classic })}>Gym</div>
					<div className={classNames('gym-class-table-cell', 'header', { 'classic': this.props.classic })}>Class</div>
					<div className={classNames('gym-class-table-cell', 'header', { 'classic': this.props.classic })}>Location</div>
					<div className={classNames('gym-class-table-cell', 'header', { 'classic': this.props.classic })}>Start Time</div>
					<div className={classNames('gym-class-table-cell', 'header', { 'classic': this.props.classic })}>Duration</div>
				</div>
				{rows}
			</div>
			</div>
		);
	}
};

export default GymClassTable;


