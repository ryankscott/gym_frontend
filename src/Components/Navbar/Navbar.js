import React, { Component } from "react";
import { Redirect, NavLink, browserHistory, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { Auth } from "../../utils/Auth";

import PropTypes from "prop-types";
import Alert from "react-s-alert";
import "../../alert.css";
import "../../alert-stackslide.css";

import styles from "./Navbar.css";
import Button from "../Button/Button";

// TODO: Clean up the conditional rendering

class Navbar extends Component {
  constructor(props) {
    super(props);
    const { userProfile, getProfile } = this.props.auth;
    if (this.props.auth.isLoggedIn()) {
      if (!userProfile) {
        getProfile((err, profile) => {
          this.setState({ profile });
        });
      } else {
        this.setState({ profile: userProfile });
      }
    }
    this.showAlert = this.showAlert.bind(this);
    this.getAvatarSrc = this.getAvatarSrc.bind(this);
  }

  showAlert(text) {
    Alert.info(text, {
      position: "top-right",
      effect: "stackslide",
      timeout: 3000
    });
  }

  localLogOut() {
    this.showAlert("Successfully logged out");
    this.props.auth.logout();
  }

  getAvatarSrc() {
    if (this.props.auth.isLoggedIn()) {
      if (this.state) {
        return (
          <img className={styles.avatar} src={this.state.profile.picture} />
        );
      }
    }
    return (
      <svg fill="#35a7ff" height="30" viewBox="0 0 24 24" width="30">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    );
  }

  render() {
    var logoutClass = this.props.auth.isLoggedIn()
      ? styles.hidden
      : styles.accountItem;
    return (
      <div className={styles.navbar}>
        <Link to={"/search"} style={{ textDecoration: "none" }}>
          <div className={styles.product}>
            <div className={styles.productIcon}>
              <svg fill="#35a7ff" height="48" viewBox="0 0 48 24" width="96">
                <path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z" />
              </svg>
            </div>
            <div className={styles.productName}>Gym Tracker</div>
          </div>
        </Link>
        <div className={styles.menu}>
          <div className={styles.menuOption}>
            <NavLink to={`/search`} activeClassName={styles.activeLink}>
              Search
            </NavLink>
          </div>
          <div className={styles.menuOption}>
            <NavLink to={`/myclasses`} activeClassName={styles.activeLink}>
              Your Classes
            </NavLink>
          </div>
          <div className={styles.menuOption}>
            <NavLink to={`/mystats`} activeClassName={styles.activeLink}>
              Your Stats
            </NavLink>
          </div>
        </div>
        <div className={styles.account}>
          {this.props.auth.isLoggedIn()
            ? <div>
                <Button
                  className={styles.button}
                  label={"Log out"}
                  handleClick={() => this.localLogOut()}
                  size="medium"
                />
              </div>
            : <Button
                className={styles.button}
                label={"Login"}
                handleClick={() => this.props.auth.login()}
                size="medium"
                inverted={false}
              />}
          {
            <div
              className={styles.avatar}
              onClick={() =>
                (this.props.auth.isLoggedIn() ? null : this.props.auth.login())}
            >

              {this.getAvatarSrc()}
            </div>
          }
        </div>
        <Alert stack={{ limit: 5, spacing: 5 }} offset={60} />
      </div>
    );
  }
}

export default Navbar;
Navbar.PropTypes = {
  auth: PropTypes.instanceOf(Auth)
};
