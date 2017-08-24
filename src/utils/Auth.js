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
      scope: "openid profile"
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
      }
      cb(err, profile);
    });
  }
}

// export default class AuthService extends EventEmitter {
//   constructor(clientId, domain) {
//     super();
//     // Configure Auth0
//     this.lock = new Auth0Lock(clientId, domain, {
//       auth: {
//         redirect: true,
//         redirectUrl: __GYMCLASS_REDIRECT_URL__,
//         responseType: "token"
//       },
//       theme: {
//         logo: require("../img/dumbbell.svg"),
//         primaryColor: "#35A7FF"
//       },
//       languageDictionary: {
//         title: "Gym Tracker"
//       }
//     });

//     // Add callback for lock `authenticated` event
//     this.lock.on("authenticated", this._doAuthentication.bind(this));
//     // binds login functions to keep this context
//     this.login = this.login.bind(this);
//   }

//   _doAuthentication(authResult) {
//     console.log("Doing auth");
//     // Saves the user token
//     console.log(authResult);
//     this.setToken(authResult.idToken);
//   }

//   login() {
//     // Call the show method to display the widget.
//     this.lock.show();
//   }

//   getTokenExpirationDate(encodedToken) {
//     const token = decode(encodedToken);
//     if (!token.exp) {
//       return null;
//     }

//     const date = new Date(0);
//     date.setUTCSeconds(token.exp);

//     return date;
//   }

//   isTokenExpired(token) {
//     const expirationDate = this.getTokenExpirationDate(token);
//     return expirationDate < new Date();
//   }

//   isLoggedIn() {
//     const idToken = this.getToken();
//     console.log(
//       "Checking if logged in: " + (!!idToken && !this.isTokenExpired(idToken))
//     );
//     return !!idToken && !this.isTokenExpired(idToken);
//   }

//   setToken(idToken) {
//     // Saves user token to local storage
//     localStorage.setItem("id_token", idToken);
//   }

//   getToken() {
//     // Retrieves the user token from local storage
//     return localStorage.getItem("id_token");
//   }

//   logout() {
//     //; Clear user token from local storage
//     localStorage.removeItem("id_token");
//   }
// }

/*
const lock = new Auth0Lock(
  "y5kMS0RrKROdimFa1jXtBIpEgyjGsDrZ",
  "ryankscott.au.auth0.com",
  {
    auth: {
      redirect: true,
      responseType: "token"
    },
    theme: {
      logo: require("../img/dumbbell.svg"),
      primaryColor: "#35a7ff"
    },
    languageDictionary: {
      title: "Gym Tracker"
    }
  }
);

function doAuth(authResult) {
  console.log("here");
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      console.log(error);
      return;
    }
    setIdToken(authResult.idToken);
    BrowserRouter.pushState("/search");
  });
}
lock.on("authenticated", authResult => {
  doAuth(authResult);
});

//TODO: Work out why we don't get loggedIn straight away
export function login(options) {
  lock.show(options);

  return {
    hide() {
      lock.hide();
    }
  };
}

export function logout() {
  clearIdToken();
  BrowserRouter.pushState("/");
}

function setProfile(profile) {
  console.log("Setting profile to: " + profile);
  try {
    localStorage.setItem("profile", JSON.stringify(profile));
  } catch (exception) {
    console.log("Failed to set profile");
    console.log(exception);
  }
}

function setIdToken(idToken) {
  console.log("Setting id token to: " + idToken);
  try {
    localStorage.setItem(ID_TOKEN_KEY, idToken);
  } catch (exception) {
    console.log("Failed to set id token");
    console.log(exception);
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
 console.log(props);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  console.log("Id token: " + idToken);
  console.log(
    "Checking if logged in: " + (!!idToken && !isTokenExpired(idToken))
  );
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
*/
