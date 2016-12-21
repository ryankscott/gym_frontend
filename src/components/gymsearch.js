import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import gymsearch from './gymsearch.scss';
import _ from 'lodash';


// TODO
// - Proptypes

class GymSearch extends Component {
	constructor(props) {
		super(props)
		this.state = this.initialState = {
			value: '',
		}
		this.onChange = this.onChange.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
		this.search = _.debounce(this.props.onSearch, 250)
		this.search = this.search.bind(this)
		this.normaliseInput = this.normaliseInput.bind(this)
}

	normaliseInput(input) {
		return input.toLowerCase().trim();
	}

	onKeyDown(e) {
		const key = e.which || e.keyCode;
		if (key == 13) {
			this.props.onSearch(this.normaliseInput(this.state.value));
			this.setState({
				isFocused: false
			})
		}
	}

	componentDidMount() {
		if (this.props.autoFocus) {
			this.refs.input.focus();
		}
	}

	onChange(event) {
		const input = event.target.value;
		if (!input) return this.setState(this.initialState);
		this.setState({ value: input });
		this.search(this.normaliseInput(input))
	}


	render() {
		return (
			 <div className={classNames('search-bar-wrapper', { 'focused': this.state.isFocused }, { 'classic': this.props.classic })}>
				<input
					className={classNames('search-bar-input', { 'focused': this.state.isFocused }, { 'classic': this.props.classic })}
					name={this.props.inputName}
					type="text"
					maxLength="100"
					autoCapitalize="none"
					autoComplete="off"
					autoCorrect="off"
					ref="input"
					value={this.state.value}
					placeholder={this.props.placeholder}
					onChange={this.onChange.bind(this)}
					onBlur={() => this.setState({ isFocused: false })}
					onFocus={() => this.setState({ isFocused: true })}
					onKeyDown={this.onKeyDown.bind(this)} />
				<input
					className={classNames('icon search-bar-submit', { 'classic': this.props.classic })}
					type="submit"
					value=""
					/>
			</div>
		);
	}
}
export default GymSearch;
