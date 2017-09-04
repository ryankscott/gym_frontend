import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import styles from "./Button.css";
import classNames from "classnames";

const Button = ({
  label,
  size,
  inverted,
  handleClick,
  icon,
  className: classNameProp
}) => {
  const btnClasses = classNames(
    {
      [styles.button]: true,
      [styles.small]: size == "small",
      [styles.medium]: size == "medium",
      [styles.large]: size == "large",
      [styles.full]: size == "full",
      [styles.inverted]: inverted
    },
    classNameProp
  );

  var i;
  switch (icon) {
    case "add":
      i = (
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
      );
      break;
    case "clear":
      i = (
        <svg
          fill="#000000"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      );
      break;
    case "check":
      i = (
        <svg
          fill="#FFFFFF"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </svg>
      );
      break;
  }

  return (
    <div
      className={btnClasses}
      onClick={() => {
        handleClick();
      }}
    >
      <div
        className={classNames({
          [styles.icon]: true,
          [styles.hidden]: !i
        })}
      >
        {i}
      </div>
      <div className={styles.label}>
        {label}
      </div>
    </div>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large", "full"]),
  inverted: PropTypes.bool,
  handleClick: PropTypes.func,
  icon: PropTypes.oneOf(["add", "clear", "check"]),
  className: PropTypes.string
};

Button.defaultProps = {
  label: "button",
  mini: false,
  size: "medium",
  inverted: false
};
export default Button;
