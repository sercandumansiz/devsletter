import React from "react";
import "./App.sass";
import Header from "./Header";
import SignUp from "./SignUp";
import Landing from "./Landing";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import DevsLetterShowcase from "./DevsLetter/Showcase";
import Login from "./Login";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ProducerSignUp from "./ProducerSignUp/SignUp";
import { AuthResponse } from "./ApiResponses/AuthResponse";
import jwt_decode from "jwt-decode";
import { Provider } from "use-http";
import { API } from "./Constants/API";
import { Role } from "./Enums/Role";
import { UserResponse } from "./ApiResponses/UserResponse";

export default function App() {
  let token = localStorage.getItem("token");
  let refreshToken = localStorage.getItem("refreshToken");
  let user = localStorage.getItem("user");
  let userResponse;
  const isAuthenticated = token !== null;
  if (user) {
    userResponse = JSON.parse(user) as UserResponse;
  }
  const globalOptions = {
    interceptors: {
      request: async ({ options }: { options: any }) => {
        if (isAuthenticated) {
          let decoded = jwt_decode(token as string) as any;
          let expireDate = new Date(decoded.exp * 1000);
          let now = new Date();

          if (expireDate < now) {
            const hasRefreshToken = refreshToken !== null;

            if (hasRefreshToken) {
              await fetch(`${API.AUTH}/api/users/token/${refreshToken}/refresh`)
                .then((response) => response.json())
                .then((result) => {
                  const auth: AuthResponse = result as AuthResponse;
                  token = auth.token;
                  localStorage.setItem("token", auth.token);
                  localStorage.setItem("refreshToken", auth.refreshToken);
                  localStorage.setItem("user", JSON.stringify(auth.user));
                })
                .catch((err) => console.log(err));
            }
          }
          options.headers = {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          };
          return options;
        }

        return options;
      },
      response: async ({ response }: { response: any }) => {
        return response;
      },
    },
  };
  return (
    <Provider options={globalOptions}>
      <Router>
        <Header />
        <NavBar />
        {isAuthenticated ? (
          <Switch>
            <Route path="/" exact={true} component={Landing} />
            <Route
              path="/showcase"
              exact={true}
              component={DevsLetterShowcase}
            />
            <Redirect from="/join" to="/showcase" />
            <Redirect from="/login" to="/showcase" />
            <Route
              path="/become-a-producer"
              exact={true}
              component={ProducerSignUp}
            />
            {user && userResponse && userResponse.type != Role.Producer && (
              <Route
                path="/become-a-producer"
                exact={true}
                component={ProducerSignUp}
              />
            )}
          </Switch>
        ) : (
          <Switch>
            <Route path="/" exact={true} component={Landing} />
            <Route path="/join" exact={true} component={SignUp} />
            <Route from="/login" exact={true} component={Login} />
            <Redirect from="/showcase" to="/login" />
            <Redirect from="/become-a-producer" to="/login" />
          </Switch>
        )}
        <Footer />
      </Router>
    </Provider>
  );
}
