import React from 'react';

import './App.css';
import Header from './Header';
import SignUp from './SignUp';
import Landing from './Landing';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DevsLetterShowcase from './DevsLetter/Showcase';

function App() {
  return (
    <Router>
      <Header></Header>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/join" component={SignUp} />
        <Route path="/showcase"  component={DevsLetterShowcase} />
      </Switch>
    </Router>
  );
}

export default App;
