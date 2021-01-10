import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

export default function WelcomeLanding() {
  return (
    <div className="columns">
      <div className="column full">
        <div className="hero has-background-grey-light">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-1">Collect & Share</h1>
              <p className="full-height-p">
                Medium length description. Let's add a few more words here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="hero has-background-grey-light">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-1">Focus</h1>
              <p className="full-height-p">
                Medium length description. Let's add a few more words here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="hero has-background-grey-light">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-1">Fresh</h1>
              <p className="full-height-p">
                Medium length description. Let's add a few more words here.
                Medium length description. Let's add a few more words here.
              </p>
              <Link
                className="button is-medium is-pulled-right mt-3 mr-3 mb-3"
                to="/join"
              >
                Join Us!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
