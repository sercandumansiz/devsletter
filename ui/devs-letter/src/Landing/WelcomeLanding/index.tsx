import React from "react"
import "./style.css"
import { Link } from "react-router-dom"

export default function WelcomeLanding() {
  return (
    <div className="WelcomeLanding">
      <div className="Card">
        <h1>Title - Card 1</h1>
        <p>Medium length description. Let's add a few more words here.</p>
      </div>
      <div className="Card">
        <h1>Title - Card 2</h1>
        <p>
          Long Description. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed est error
          repellat veritatis.
        </p>
      </div>
      <div className="Card">
        <h1>Title - Card 3</h1>
        <p>Short Description.</p>
        <Link to="/join">Join Us!</Link>
      </div>
    </div>
  )
}
