import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from "./MyClasses.css";

import GymClassTable from "../GymClassTable/GymClassTable";
import { Auth } from "../../utils/Auth";
import PropTypes from "prop-types";

import Alert from "react-s-alert";
import "../../alert.css";
import "../../alert-stackslide.css";

class MyClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: null
    };
    this.getClasses = this.getClasses.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.getClasses();
  }

  showAlert(text) {
    Alert.info(text, {
      position: "top-right",
      effect: "stackslide",
      timeout: 3000
    });
  }

  deleteClass(classID) {
    console.log("Deleting class: " + classID);
    var url = __GYMCLASS_URL__ + "/classes/?classID=" + classID;
    fetch(url, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("id_token") },
      mode: "cors"
    })
      .then(function(response) {
        if (!response.ok) {
          console.log(response);
        }
        return response.text();
      })
      .then(
        function(res) {
          this.getClasses();
          this.showAlert("Class removed from your profile");
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }

  getClasses() {
    var url = __GYMCLASS_URL__ + "/classes/";
    fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("id_token") },
      mode: "cors"
    })
      .then(function(response) {
        if (!response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then(
        function(res) {
          this.setState({ classes: res });
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }

  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.h2}> Your classes </h1>
        <GymClassTable
          classes={this.state.classes}
          editable={true}
          deleteClass={this.deleteClass}
          mode="delete"
        />
        <Alert stack={{ limit: 5, spacing: 5 }} offset={60} />
      </div>
    );
  }
}

export default MyClasses;
MyClasses.PropTypes = {
  auth: PropTypes.instanceOf(Auth)
};
