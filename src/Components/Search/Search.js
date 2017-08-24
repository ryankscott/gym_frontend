import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { debounce } from "lodash";
import "whatwg-fetch";
import styles from "./Search.css";

import GymSearchBar from "../GymSearchBar/GymSearchBar";
import GymClassTable from "../GymClassTable/GymClassTable";
import RecommendedClasses from "../RecommendedClasses/RecommendedClasses";

import { Auth } from "../../utils/Auth";

import Alert from "react-s-alert";
import "../../alert.css";
import "../../alert-stackslide.css";

function storageAvailable(type) {
  try {
    var storage = window[type], x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

const commonSearches = [
  "grit today",
  "grit this afternoon",
  "grit tomorrow",
  "grit after 4pm",
  "grit before 6pm",
  "balance today",
  "balance this afternoon",
  "balance tomorrow",
  "balance after 4pm",
  "balance before 6pm",
  "cx today",
  "cx this afternoon",
  "cx tomorrow",
  "cx after 4pm",
  "cx before 6pm",
  "today at takapuna",
  "today at newmarket",
  "today at city",
  "today at britomart",
  "after 4pm at takapuna",
  "after 4pm at newmarket",
  "after 4pm at city",
  "after 4pm at britomart",
  "before 6pm at takapuna",
  "before 6pm at newmarket",
  "before 6pm at city",
  "before 6pm at britomart",
  "takapuna today",
  "city today",
  "newmarket today",
  "britomart today",
  "takapuna tomorrow",
  "city tomorrow",
  "newmarket tomorrow",
  "britomart tomorrow"
];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: null,
      savedClasses: null
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSuggest = this.onSuggest.bind(this);
    this.addClass = this.addClass.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.getLocalSuggestions = this.getLocalSuggestions.bind(this);
    this.setLocalSuggestions = _.debounce(this.setLocalSuggestions, 1000);
    this.getSavedClasses = this.getSavedClasses.bind(this);

    this.getSavedClasses();
  }

  showAlert(text) {
    Alert.info(text, {
      position: "top-right",
      effect: "stackslide",
      timeout: 3000
    });
  }

  addClass(classID) {
    var url = __GYMCLASS_URL__ + "/classes/?classID=" + classID;
    fetch(url, {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("id_token") }
    })
      .then(function(response) {
        if (!response.ok) {
          console.log(response);
        }
        return response.text();
      })
      .then(
        function(res) {
          this.showAlert("Class added to your profile");
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }

  deleteClass(classID) {
    console.log("Deleting class: " + classID);
    var url = __GYMCLASS_URL__ + "/classes/?classID=" + classID;
    fetch(url, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("id_token") }
    })
      .then(function(response) {
        if (!response.ok) {
          console.log(response);
        }
        return response.text();
      })
      .then(
        function(res) {
          this.showAlert("Class removed from your profile");
        }.bind(this)
      )
      .catch(function(err) {
        console.log(err);
      });
  }

  setLocalSuggestions(input) {
    if (storageAvailable("localStorage")) {
      var storage = window["localStorage"];
      storage.setItem("searches", JSON.stringify(input));
    }
  }

  getLocalSuggestions(input) {
    var localMatches = [];
    if (storageAvailable("localStorage")) {
      var storage = window["localStorage"];
      var searches = storage.getItem("searches");
      var localSearches = [];
      searches ? (localSearches = JSON.parse(searches)) : null;
      localSearches.push(input);
      input.split(" ").length > 1
        ? this.setLocalSuggestions(localSearches)
        : null;
      localMatches = localSearches.map(
        search => (search.startsWith(input) ? search : null)
      );
      localMatches = localMatches.filter(match => match != null);
    }
    return localMatches;
  }

  getSavedClasses() {
    if (this.props.auth.isLoggedIn()) {
      var url = __GYMCLASS_URL__ + "/classes/";
      fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("id_token") }
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
              savedClasses: res
            });
          }.bind(this)
        )
        .catch(function(err) {
          console.log(err);
        });
    }
  }

  onSuggest(input, resolve) {
    var localSuggestions = this.getLocalSuggestions(input);
    var matches = commonSearches.map(
      commonSearch => (commonSearch.startsWith(input) ? commonSearch : null)
    );
    matches = matches.filter(match => match != null);
    var allMatches = [];
    allMatches = _.uniq(allMatches.concat(matches, localSuggestions));
    resolve(allMatches);
  }

  onSearch(input) {
    var url = __GYMCLASS_URL__ + "/classsearch/?q=" + input;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(
        function(res) {
          this.setState({ classes: res });
        }.bind(this)
      );
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.title}>
            <div className={styles.logo}>
              <svg x="0px" y="0px" viewBox="0 0 504 504">
                <circle fill="#47afff" cx="252" cy="252" r="252" />
                <path
                  fill="#324A5E"
                  d="M437.9,264H66.2c-6.6,0-12-5.4-12-12l0,0c0-6.6,5.4-12,12-12h371.7c6.6,0,12,5.4,12,12l0,0
	C449.9,258.6,444.5,264,437.9,264z"
                />
                <path
                  fill="#FFFFFF"
                  d="M357,339.9L357,339.9c-14.5,0-26.3-11.8-26.3-26.3V190.4c0-14.5,11.8-26.3,26.3-26.3l0,0
	c14.5,0,26.3,11.8,26.3,26.3v123.2C383.3,328.1,371.5,339.9,357,339.9z"
                />
                <path
                  fill="#E6E9EE"
                  d="M409.6,315.5L409.6,315.5c-14.5,0-26.3-11.8-26.3-26.3v-74.4c0-14.5,11.8-26.3,26.3-26.3l0,0
	c14.5,0,26.3,11.8,26.3,26.3v74.4C435.9,303.7,424.1,315.5,409.6,315.5z"
                />
                <path
                  fill="#FFFFFF"
                  d="M147,164.1L147,164.1c14.5,0,26.3,11.8,26.3,26.3v123.2c0,14.5-11.8,26.3-26.3,26.3l0,0
	c-14.5,0-26.3-11.8-26.3-26.3V190.4C120.7,175.9,132.5,164.1,147,164.1z"
                />
                <path
                  fill="#E6E9EE"
                  d="M94.4,188.5L94.4,188.5c14.5,0,26.3,11.8,26.3,26.3v74.4c0,14.5-11.8,26.3-26.3,26.3l0,0
	c-14.5,0-26.3-11.8-26.3-26.3v-74.4C68.1,200.3,79.9,188.5,94.4,188.5z"
                />
              </svg>

            </div>
            <h1 className={styles.header}> Class Search </h1>
          </div>
          <GymSearchBar
            placeholder={"Search for a class"}
            onSearch={this.onSearch}
            onSuggest={this.onSuggest}
          />
          <GymClassTable
            classes={this.state.classes}
            savedClasses={this.state.savedClasses}
            editable={this.props.auth.isLoggedIn() ? true : false}
            addClass={this.addClass}
            deleteClass={this.deleteClass}
            mode={"save"}
          />
          {this.props.auth.isLoggedIn()
            ? <RecommendedClasses
                addClass={this.addClass}
                deleteClass={this.deleteClass}
              />
            : null}
        </div>
        <Alert stack={{ limit: 5, spacing: 5 }} offset={60} />
      </div>
    );
  }
}
export default Search;
Search.PropTypes = {
  auth: PropTypes.instanceOf(Auth)
};
