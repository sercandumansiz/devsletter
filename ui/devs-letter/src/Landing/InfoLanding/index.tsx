import React from "react"
import "./style.css"
import { Link } from "react-router-dom"

export default function InfoLanding() {
  return (
      <div className="columns">
        <div className="column">
          <div className="hero">
            <div className="hero-body">
              <h1 className="title">Producer</h1>
              <p>Medium length description. Let's add a few more words here.</p>
              <Link to="/become-a-producer">Become a  Producer</Link>
            </div>
          </div>
        </div>
        <div className="column">
        <div className="hero">
          <div className="hero-body">
            <h1 className="title">Observer</h1>
            <p>Short Description.</p>
            <Link to="/join">Continue as an Observer</Link>
        </div>
        </div>
      </div>
      </div>
  )
}
