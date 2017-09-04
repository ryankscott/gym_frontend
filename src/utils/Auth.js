import decode from "jwt-decode";
import { BrowserRouter } from "react-router-dom";
import auth0 from "auth0-js";
import history from "../history";

// TODO: Refactor this with the newest react examples
// TODO: Get Profile information

export default class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: "ryankscott.au.auth0.com",
      clientID: "y5kMS0RrKROdimFa1jXtBIpEgyjGsDrZ",
      redirectUri: __GYMCLASS_REDIRECT_URL__ + "/callback",
      audience: "https://ryankscott.au.auth0.com/userinfo",
      responseType: "token id_token",
      scope: "openid profile email"
    });
    this.userProfile = null;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace("/search");
      } else if (err) {
        history.replace("/search");
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);

    // navigate to the home route
    history.replace("/home");
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  isLoggedIn() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
  getAccessToken() {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return accessToken;
  }
  getProfile(cb) {
    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
        var url = __GYMCLASS_URL__ + "/users/";
        fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("id_token")
          },
          body: JSON.stringify(profile)
        })
          .then(function(response) {
            if (!response.ok) {
              console.log(response);
            }
            return response.text();
          })
          .then(
            function(res) {
              console.log(res);
            }.bind(this)
          )
          .catch(function(err) {
            console.log(err);
          });
      }

      cb(err, profile);
    });
  }
}
