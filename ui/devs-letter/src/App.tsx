import React from 'react';

import './App.css';
import Header from './Header';
import SignUp from './SignUp';
import Landing from './Landing';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import DevsLetterShowcase from './DevsLetter/Showcase';
import Login from './Login';

function App() {
  const isAuthenticated = localStorage.getItem("token") !== null;
  console.log(isAuthenticated);
  return (
    <Router>
      <Header></Header>
      {isAuthenticated ?
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/showcase" exact component={DevsLetterShowcase} />
          <Redirect from='/join' to='/showcase' />
          <Redirect from='/login' to='/showcase' />
        </Switch>
        :
         <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/join" exact component={SignUp} />
          <Route from='/login' exact component={Login} />
          <Redirect from='/showcase' to='/login' />
        </Switch>
      }
      
      
    </Router>
  );
}

export default App;
