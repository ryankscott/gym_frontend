import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import Button from "../Button/Button";
import Dropzone from "react-dropzone";
import styles from "./Feedback.css";
const CLOUDINARY_UPLOAD_PRESET = "uwjbfivy";
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dokxhmjze/image/upload";
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.state = {
      dialogHidden: true,
      feedbackMessage: "",
      feedbackType: "Bug",
      btnLabel: "Submit",
      btnIcon: null,
      screenshotURL: null,
      screenshotLabel: "Upload Screenshot",
      files: []
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendToSlack = this.sendToSlack.bind(this);
    this.messageSent = this.messageSent.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.screenshotUpload = this.screenshotUpload.bind(this);
  }
  handleMessageChange(event) {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      feedbackMessage: value
    });
  }
  handleTypeChange(event) {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      feedbackType: value
    });
  }
  handleSubmit() {
    var payload = new Object();
    payload.channel = "#feedback";
    payload.username = "John Smith";
    payload.icon_emoji = ":squirrel:";
    var attachment = new Object();
    attachment.fallback = "Feedback - " + this.state.feedbackType;
    attachment.author_name = "John Smith"; //TODO: use the account name
    attachment.color = "danger";
    attachment.title = this.state.feedbackType;
    attachment.text = this.state.feedbackMessage;
    attachment.title_link = "https://www.ryankscott.com/search"; //TODO: fix me
    attachment.footer = "Gym Search Feedback";
    attachment.image_url = this.state.screenshotURL;
    payload.attachments = [];
    payload.attachments.push(attachment);
    this.sendToSlack(payload);
  }
  messageSent() {
    this.setState({
      btnClass: "btn-success full",
      btnLabel: "Feedback sent",
      btnIcon: "check"
    });
    setTimeout(() => {
      this.toggleDialog();
    }, 1800);
  }
  sendToSlack(payload) {
    this.setState({
      btnLabel: "Sending ..."
    });
    var url = __GYMCLASS_URL__ + "/slack/";
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(payload)
    })
      .then(function(response) {
        if (!response.ok) {
          console.log(response);
        }
        return response.text();
      })
      .then(
        function(res) {
          this.messageSent();
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }
  screenshotUpload(acceptedFiles, rejectedFiles) {
    var screenshot = acceptedFiles.length >= 1
      ? acceptedFiles[0]
      : acceptedFiles;
    var formData = new FormData();
    formData.append("file", screenshot);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    var url = CLOUDINARY_UPLOAD_URL;
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: formData
    })
      .then(function(response) {
        if (!response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then(
        function(res) {
          this.setState({
            screenshotURL: res.secure_url,
            screenshotLabel: "Screenshot uploaded",
            files: [res.original_filename + "." + res.format]
          });
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }
  uploadImage(image) {}
  toggleDialog() {
    this.setState({
      feedbackMessage: "",
      feedbackType: "Bug",
      dialogHidden: !this.state.dialogHidden,
      btnClass: "",
      btnIcon: null,
      btnLabel: "Submit",
      screenshotLabel: "Upload Screenshot",
      files: []
    });
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.btn} onClick={this.toggleDialog}>
          <div className={styles.icon}>
            <svg
              fill="#ffffff"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
            </svg>
          </div>
        </div>
        <div
          className={classNames({
            [styles.form]: true,
            [styles.hidden]: this.state.dialogHidden
          })}
        >
          <div className={styles.header}>
            <div className={styles.headerIcon} onClick={this.toggleDialog}>
              <svg
                fill="#000000"
                height="18"
                viewBox="0 0 24 24"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </div>
          </div>
          <div className={styles.content}>
            <h3 className={styles.h3}>Help us make the product better</h3>
            <h4 className={styles.h4}>What kind of feedback do you have:</h4>
            <div className={styles.controlGroup}>
              <label className={styles.label}>
                Bug
                <input
                  name="isBug"
                  type="radio"
                  name="feedbackType"
                  value="Bug"
                  onClick={this.handleTypeChange}
                />
              </label>
              <label className={styles.label}>
                Feature Request
                <input
                  name="isFeature"
                  type="radio"
                  name="feedbackType"
                  value="Feature"
                  onClick={this.handleTypeChange}
                />
              </label>
            </div>
            <h4 className={styles.h4}>What is your suggestion?</h4>
            <textarea
              name="feedbackMessage"
              className={styles.message}
              placeholder="Your feedback..."
              value={this.state.feedbackMessage}
              autoFocus="true"
              rows="10"
              onChange={this.handleMessageChange}
            />
            <Dropzone
              multiple={false}
              accept="image/jpeg, image/png"
              className={classNames({
                [styles.dropzone]: true,
                [styles.hidden]: this.state.files.length > 0
              })}
              activeClassName={styles.activeDropzone}
              acceptClassName={styles.successDropzone}
              rejectClassName={styles.rejectDropzone}
              onDrop={this.screenshotUpload}
            >
              <div>
                {this.state.screenshotLabel}
              </div>
            </Dropzone>
            <img
              src={this.state.screenshotURL}
              className={classNames({
                [styles.imagePreview]: true,
                [styles.hidden]: this.state.screenshotURL == null
              })}
            />
          </div>
          <Button
            size="full"
            label={this.state.btnLabel}
            icon={this.state.btnIcon}
            handleClick={this.handleSubmit}
            class={this.state.btnClass}
          />
        </div>
      </div>
    );
  }
}

export default Feedback;
Feedback.PropTypes = {};
