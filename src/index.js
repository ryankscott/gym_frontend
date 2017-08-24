import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  IndexRedirect
} from "react-router-dom";
import Auth from "./utils/Auth";

import Search from "./Components/Search/Search";
import App from "./Components/App";
import Login from "./Components/Login/Login";
import MyClasses from "./Components/MyClasses/MyClasses";
import MyStats from "./Components/MyStats/MyStats";
import Navbar from "./Components/Navbar/Navbar";
import Feedback from "./Components/Feedback/Feedback";
import history from "./history";

const auth = new Auth();
const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};
ReactDOM.render(
  <Router history={history}>
    <div>
      <Feedback />
      <Navbar auth={auth} />
      <Route
        exact
        path="/"
        render={props => (handleAuthentication(props), <App auth={auth} />)}
      />
      <Route path="/search" render={props => <Search auth={auth} />} />
      <Route
        path="/myclasses"
        render={props =>
          auth.isLoggedIn() == true
            ? <MyClasses auth={auth} />
            : <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }}
              />}
      />

      <Route
        path="/mystats"
        render={props =>
          auth.isLoggedIn() == true
            ? <MyStats auth={auth} />
            : <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }}
              />}
      />
      <Route path="/login" render={props => <Login auth={auth} />} />
      <Route
        path="/callback"
        render={props => {
          handleAuthentication(props);
          return <Callback {...props} />;
        }}
      />

      <Redirect from="/" to="/search" />
    </div>
  </Router>,
  document.getElementById("content")
);
