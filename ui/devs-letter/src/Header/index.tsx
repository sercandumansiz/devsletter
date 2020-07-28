import React, {Component} from 'react';
import './style.css';

class Header extends Component {
  render() {
    return (
      <header className="Header">
        <a href="/" className="logo">dev's letter</a>
      </header>
    )
  }
}

export default Header;
