import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from "./GymSearchBar.css";
import Suggestions from "../Suggestions/Suggestions";
import { debounce } from "lodash";
import PropTypes from "prop-types";

class GymSearch extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState = {
      value: "",
      searchTerm: "",
      suggestions: null,
      selectedSuggestion: -1
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.search = debounce(this.props.onSearch, 350);
    this.search = this.search.bind(this);
    this.normaliseInput = this.normaliseInput.bind(this);
    this.suggest = debounce(this.props.onSuggest, 150);
    this.suggest = this.suggest.bind(this);
    this.autoSuggest = this.autoSuggest.bind(this);
    this.onSelection = this.onSelection.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  autoSuggest(input) {
    const searchTerm = input;
    if (!searchTerm) return;
    new Promise(resolve => {
      this.props.onSuggest(searchTerm, resolve);
    }).then(result => {
      this.setState({
        suggestions: result,
        searchTerm: searchTerm,
        selectedSuggestion: -1
      });
    });
  }

  normaliseInput(input) {
    return input.toLowerCase().trim();
  }

  onKeyDown(e) {
    const key = e.which || e.keyCode;
    switch (key) {
      case 13: // ENTER
        this.props.onSearch(this.normaliseInput(this.state.value));
        this.setState({
          isFocused: false,
          suggestions: null,
          selectedSuggestion: -1
        });
        break;
      case 38: // UP
      case 40: // DOWN
        e.preventDefault();
        this.scroll(key);
        break;
      case 27: // ESC
        this.setState({ suggestions: null });
        break;
    }
  }

  scroll(key) {
    const selected = this.state.selectedSuggestion;
    var nextItem;
    switch (key) {
      case 38: // UP
        selected >= 1
          ? (nextItem = selected - 1)
          : (nextItem = this.state.suggestions.length - 1);
        break;
      case 40: // DOWN
        selected >= this.state.suggestions.length - 1
          ? (nextItem = 0)
          : (nextItem = selected + 1);
        break;
    }
    this.setState({
      value: this.state.suggestions[nextItem],
      selectedSuggestion: nextItem
    });
    this.props.onSearch(this.normaliseInput(this.state.suggestions[nextItem]));
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.refs.input.focus();
    }
  }

  onChange(event) {
    const input = event.target.value;
    const suggestion = this.state.suggestions;
    var normalInput = this.normaliseInput(input);
    if (!input) return this.setState(this.initialState);
    this.setState({ value: input, suggestions: null, selectedSuggestion: -1 });
    this.autoSuggest(normalInput);
    this.search(normalInput);
  }

  onSelection(input, index) {
    this.setState({
      selectedSuggestion: index,
      value: input,
      suggestions: null
    });
    this.props.onSearch(this.normaliseInput(input));
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.search}>
            <svg
              fill="#444"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </div>
          <input
            className={styles.input}
            type="text"
            maxLength="100"
            ref="input"
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={this.onChange.bind(this)}
            onBlur={() => this.setState({ isFocused: false })}
            onFocus={() => this.setState({ isFocused: true })}
            onKeyDown={this.onKeyDown.bind(this)}
          />
        </div>

        {this.state.suggestions != null &&
          <Suggestions
            suggestions={this.state.suggestions}
            searchTerm={this.state.searchTerm}
            onSelection={this.onSelection}
            selectedSuggestion={this.state.selectedSuggestion}
          />}
      </div>
    );
  }
}
export default GymSearch;
GymSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSuggest: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string
};

GymSearch.defaultProps = {
  autoFocus: true,
  placeholder: "Search for a class"
};
