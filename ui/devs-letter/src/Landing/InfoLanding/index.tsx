import React from "react"
import "./style.css"
import { Link } from "react-router-dom"

export default function InfoLanding() {
  return (
    <div className="InfoLanding">
      <div className="ProducerCard">
        <h1>Producer</h1>
        <p>Medium length description. Let's add a few more words here.</p>
        <Link to="/become-a-producer">Become a  Producer</Link>
      </div>
      <div className="ObserverCard">
        <h1>Observer</h1>
        <p>Short Description.</p>
        <Link to="/join">Continue as an Observer</Link>
      </div>
    </div>
  )
}
