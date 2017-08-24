import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Auth } from "../../utils/Auth";

import styles from "./Login.css";
import Button from "../Button/Button";

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.container}>
        <div>
          <h2 className={styles.h2}>To view this page you must login</h2>
        </div>
        <Button
          label={"Login"}
          size="large"
          handleClick={() => this.props.auth.login()}
        />
      </div>
    );
  }
}
export default Login;
Login.PropTypes = {
  auth: PropTypes.instanceOf(Auth)
};
