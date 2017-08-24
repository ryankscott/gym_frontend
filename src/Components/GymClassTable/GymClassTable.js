import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import classNames from "classnames";
import styles from "./GymClassTable.css";
import AddClassButton from "../AddClassButton/AddClassButton";
import Button from "../Button/Button";

const desktopWidth = 1000;

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

class GymClassTable extends Component {
  constructor(props) {
    super(props);
    this.generateEditCol = this.generateEditCol.bind(this);
    this.editButtonChange = this.editButtonChange.bind(this);
  }

  formatClassTime(dateString) {
    var width =
      window.innerWidth || documentElement.clientWidth || body.clientWidth;
    if (moment().isSame(moment(dateString), "day")) {
      if (width < desktopWidth) {
        return moment(dateString).format("h:mm a");
      } else {
        return moment(dateString).format("[Today at] h:mm a");
      }
    } else if (width < desktopWidth) {
      return (
        moment(dateString).format("ddd") +
        "\n" +
        moment(dateString).format("h:mm a")
      );
    } else {
      return moment(dateString).format("dddd h:mm a");
    }
  }

  editButtonChange(add, index) {
    add ? this.props.addClass(index) : this.props.deleteClass(index);
  }

  generateEditCol(index) {
    if (this.props.editable) {
      if (this.props.mode == "save" && this.props.savedClasses) {
        // Check if this has already been saved
        var savedClass = false;
        for (var i = 0; i < this.props.savedClasses.length; i++) {
          if (this.props.savedClasses[i].uuid == index) {
            savedClass = true;
          }
        }
        return (
          <div className={styles.tableCellAction}>
            <AddClassButton
              onChange={add => {
                this.editButtonChange(add, index);
              }}
              add={!savedClass}
              canToggle={true}
            />
          </div>
        );
      } else {
        return (
          <div className={styles.tableCellAction}>
            <AddClassButton
              onChange={add => {
                this.editButtonChange(add, index);
              }}
              add={false}
              defaultAdd={false}
              canToggle={false}
            />
          </div>
        );
      }
    }
  }

  render() {
    var rows = [];
    var editableCol;
    var editableHeader;
    var isHidden =
      this.props.classes == null ||
      (this.props.classes != null && this.props.classes.length == 0);

    var cellClass = classNames({
      [styles.tableCell]: true,
      [styles.hidden]: isHidden
    });

    if (this.props.classes != null) {
      if (this.props.editable) {
        editableHeader = (
          <div
            className={classNames({
              [styles.tableCellAction]: true,
              [styles.hidden]: isHidden
            })}
          />
        );
      }
      this.props.classes.forEach(
        function(gymclass, index) {
          rows.push(
            <div key={gymclass.uuid} className={styles.tableRow}>
              <div className={cellClass}>
                {toTitleCase(gymclass.gym)}
              </div>
              <div className={cellClass}>
                {toTitleCase(gymclass.name)}
              </div>
              <div className={cellClass}>
                {gymclass.location}
              </div>
              <div className={cellClass}>
                {this.formatClassTime(gymclass.startdatetime)}
              </div>
              {this.generateEditCol(gymclass.uuid)}
            </div>
          );
        }.bind(this)
      );
    }
    return (
      <div className={styles.tableWrapper}>
        <div
          className={classNames({
            [styles.table]: true,
            [styles.hidden]: isHidden
          })}
        >
          <div
            className={classNames({
              [styles.tableRowHeader]: true,
              [styles.hidden]: isHidden
            })}
          >
            <div className={cellClass}>Gym</div>
            <div className={cellClass}>Class</div>
            <div className={cellClass}>Studio</div>
            <div className={cellClass}>Time</div>
            {editableHeader}
          </div>
          {rows}
        </div>
        <div
          className={classNames({
            [styles.noClassTextContainer]: true,
            [styles.hidden]: this.props.classes == null
          })}
        >
          <p
            className={classNames({
              [styles.noClassText]: true,
              [styles.hidden]: !isHidden
            })}
          >
            No classes found ☹
          </p>
        </div>
      </div>
    );
  }
}

export default GymClassTable;

GymClassTable.PropTypes = {
  editable: PropTypes.bool,
  mode: PropTypes.oneOf(["save", "delete"]),
  classes: PropTypes.object,
  savedClasses: PropTypes.object,
  addClass: PropTypes.func.isRequired,
  deleteClass: PropTypes.func.isRequired
};

GymClassTable.defaultProps = {
  editable: false,
  mode: "delete",
  savedClasses: [],
  classes: []
};
