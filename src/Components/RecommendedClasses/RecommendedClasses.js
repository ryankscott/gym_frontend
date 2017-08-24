import PropTypes from "prop-types";
import React, { Component } from "react";
import GymClassTable from "../GymClassTable/GymClassTable";
import styles from "./RecommendedClasses.css";
import classNames from "classnames";

class RecommendedClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: null
    };
    this.getClasses();
  }

  getClasses() {
    var url = __GYMCLASS_URL__ + "/preferredclasses/";
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
        <h2
          className={classNames({
            [styles.h2]: true,
            [styles.hidden]: this.state.classes == null
          })}
        >
          Classes you may like:
        </h2>
        <GymClassTable
          classes={this.state.classes ? this.state.classes.slice(0, 5) : null}
          editable={true}
          mode="save"
          addClass={this.props.addClass}
          deleteClass={this.props.deleteClass}
        />
      </div>
    );
  }
}

RecommendedClasses.propTypes = {
  addClass: PropTypes.func.isRequired,
  deleteClass: PropTypes.func.isRequired
};

export default RecommendedClasses;
