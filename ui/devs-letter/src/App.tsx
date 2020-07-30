import React from "react"

import "./App.css"
import Header from "./Header"
import SignUp from "./SignUp"
import Landing from "./Landing"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import DevsLetterShowcase from "./DevsLetter/Showcase"
import Login from "./Login"
import NavBar from "./NavBar"
import Footer from "./Footer"
import ProducerSignUp from "./ProducerSignUp/SignUp"

export default function App() {
  const isAuthenticated = localStorage.getItem("token") !== null
  return (
    <Router>
      <div className="App">
          <Header />
            <main>
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
              </main>
          <Footer />
      </div>
    </Router>
  )
}
