import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from "./Suggestions.css";

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: -1
    };
  }

  render() {
    const { searchTerm, suggestions } = this.props;
    return (
      <ul
        className={classNames({
          [styles.suggestions]: true,
          [styles.hidden]: suggestions.length == 0
        })}
      >
        {suggestions.slice(0, 4).map((suggestion, index) =>
          <li
            className={classNames({
              [styles.suggestionListItem]: true,
              [styles.highlighted]:
                index == this.state.activeItem ||
                index == this.props.selectedSuggestion
            })}
            key={index}
            onClick={() => this.props.onSelection(suggestion, index)}
            onMouseEnter={() => this.setState({ activeItem: index })}
            onMouseDown={e => e.preventDefault()}
            onTouchEnd={() => this.onTouchEnd(suggestion)}
          >
            <span>
              {searchTerm}
              <strong>
                {suggestion.substr(searchTerm.length)}
              </strong>
            </span>
          </li>
        )}
      </ul>
    );
  }
}

Suggestions.propTypes = {
  selectedSuggestion: PropTypes.number,
  searchTerm: PropTypes.string
};
export default Suggestions;
