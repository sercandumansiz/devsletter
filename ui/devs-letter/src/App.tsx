import React from "react"
import './App.sass';
import Header from "./Header"
import SignUp from "./SignUp"
import Landing from "./Landing"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import DevsLetterShowcase from "./DevsLetter/Showcase"
import Login from "./Login"
import NavBar from "./NavBar"
import Footer from "./Footer"
import ProducerSignUp from "./ProducerSignUp/SignUp"
import useFetch, { Provider } from "use-http"
import { AuthResponse } from "./ApiResponses/AuthResponse"
import jwt_decode from "jwt-decode"

export default function App() {
  const { get, response } = useFetch("http://localhost:5000/api")

  const isAuthenticated = localStorage.getItem("token") !== null

  const globalOptions = {
		interceptors: {
      request: async ({ options }: { options: any }) => {
        if (isAuthenticated) {
          console.log('A');
          let token = localStorage.getItem("token")!;
          let decoded = jwt_decode(token) as any;
          let expireDate = new Date(decoded.exp * 1000);
          let now = new Date();
          
          if (expireDate < now) {
            const hasRefreshToken = localStorage.getItem("refreshToken") !== null
            if (hasRefreshToken) {
                let refreshToken = localStorage.getItem("refreshToken");
                await get(`/users/token/${refreshToken}/refresh`)
                if (response.ok)
                    {
                  const auth: AuthResponse = response.data
                  token = auth.token;
                      localStorage.setItem("token", auth.token)
                      localStorage.setItem("refreshToken", auth.refreshToken)
                      localStorage.setItem("user", JSON.stringify(auth.user))
                      options.headers = {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json, text/plain",
                      "Content-Type": "application/json"
                      }
                    } 
            }
          
          }
        }
        return options;
      },
      response: async ({ response }: { response: any }) => {
        return response 
      }
    }
	}
  return (
    <Provider options={globalOptions}>
      <Router>
            <Header />
                <NavBar />
                  {isAuthenticated ? (
                    <Switch>
                      <Route path="/" exact={true} component={Landing} />
                      <Route path="/showcase" exact={true} component={DevsLetterShowcase} />
                      <Redirect from="/join" to="/showcase" />
                      <Redirect from="/login" to="/showcase" />
                      <Route path="/become-a-producer" exact={true} component={ProducerSignUp} />
                    </Switch>
                  ) : (
                    <Switch>
                      <Route path="/" exact={true} component={Landing} />
                      <Route path="/join" exact={true} component={SignUp} />
                      <Route from="/login" exact={true} component={Login} />
                      <Redirect from="/showcase" to="/login" />
                    </Switch>
                    )}
            <Footer />
        </Router>
      </Provider>
  )
}
