import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import styles from "./AddClassButton.css";

import classNames from "classnames";

class AddClassButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      add: props.add
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const state = this.state.add;
    if (this.props.canToggle) {
      this.setState({
        add: !state
      });
    }
    this.props.onChange(this.state.add);
  }

  render() {
    return (
      <div
        className={classNames({
          [styles.add]: this.state.add,
          [styles.remove]: !this.state.add
        })}
        onClick={() => {
          this.handleClick();
        }}
      >
        <svg
          fill="#000000"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </div>
    );
  }
}
export default AddClassButton;

AddClassButton.PropTypes = {
  add: PropTypes.bool,
  canToggle: PropTypes.bool,
  onChange: PropTypes.func
};

AddClassButton.defaultProps = {
  add: true,
  canToggle: true
};
