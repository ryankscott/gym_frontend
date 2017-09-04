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

import BigCalendar from "react-big-calendar";
import moment from "moment";
BigCalendar.momentLocalizer(moment);
import "../../calendar.css";

import { RadioGroup, Radio } from "react-radio-group";

let formats = {
  dayFormat: (date, culture, localizer) => moment(date).format("dddd")
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

class MyClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      view: "calendar"
    };
    this.getClasses = this.getClasses.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.transformClasses = this.transformClasses.bind(this);
    this.limitClasses = this.limitClasses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getClasses();
  }

  handleChange(value) {
    this.setState({
      view: value
    });
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
          this.setState({ classes: this.limitClasses(res) });
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }
  transformClasses() {
    var x = this.state.classes.map(function(obj) {
      var rObj = {};
      rObj["title"] = toTitleCase(obj.name);
      rObj["start"] = moment(obj.startdatetime).toDate();
      rObj["end"] = moment(obj.enddatetime).toDate();
      return rObj;
    });
    return x;
  }

  limitClasses(classes) {
    var x = classes.filter(function(a) {
      return moment(a.startdatetime).isBetween(
        moment().startOf("week"),
        moment().endOf("week"),
        null,
        "[]"
      );
    });
    return x;
  }
  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.h2}> Your classes this week </h1>
        <RadioGroup
          className={styles.radioGroup}
          name="view"
          selectedValue={this.state.view}
          onChange={this.handleChange}
        >
          <Radio className={styles.radio} value="calendar" /> Calendar
          <Radio className={styles.radio} value="list" /> List
        </RadioGroup>
        {this.state.view == "calendar"
          ? <BigCalendar
              events={this.transformClasses()}
              defaultView="week"
              toolbar={false}
              views={["week"]}
              min={new Date(0, 0, 0, 6, 0, 0)}
              max={new Date(0, 0, 0, 20, 0, 0)}
              step={60}
              formats={formats}
              date={moment().startOf("week").toDate()}
            />
          : <GymClassTable
              classes={this.state.classes}
              editable={true}
              deleteClass={this.deleteClass}
              mode="delete"
            />}
        <Alert stack={{ limit: 5, spacing: 5 }} offset={60} />
      </div>
    );
  }
}

export default MyClasses;
MyClasses.PropTypes = {
  auth: PropTypes.instanceOf(Auth)
};
