import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

export default function WelcomeLanding() {
  return (
    <div className="columns">
      <div className="column">
        <div className="hero">
          <div className="hero-body">
            <h1 className="title is-1">Title - Card 1</h1>
            <p>Medium length description. Let's add a few more words here.</p>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="hero">
          <div className="hero-body">
            <h1 className="title is-1">Title - Card 1</h1>
            <p>Medium length description. Let's add a few more words here.</p>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="hero">
          <div className="hero-body">
            <h1 className="title is-1">Title - Card 1</h1>
            <p>Medium length description. Let's add a few more words here.</p>
            <Link to="/join">Join Us!</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
