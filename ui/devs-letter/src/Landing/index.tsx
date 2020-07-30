import React from "react"
import WelcomeLanding from "./WelcomeLanding"
import InfoLanding from "./InfoLanding"
import "./style.css"

export default function Landing() {
  const isAuthenticated = localStorage.getItem("token") !== null
  return (
    <div className="Landing">
      { isAuthenticated ? <InfoLanding></InfoLanding> : <WelcomeLanding></WelcomeLanding> }
    </div>
  )
}
