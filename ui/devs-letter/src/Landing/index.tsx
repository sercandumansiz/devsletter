import React from "react";
import WelcomeLanding from "./WelcomeLanding";
import InfoLanding from "./InfoLanding";
import "./style.css";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";

export default function Landing() {
  let role: string = "";
  const isAuthenticated = localStorage.getItem("token") !== null;
  if (isAuthenticated) {
    let token = localStorage.getItem("token")!;
    let decoded = jwt_decode(token) as any;
    role = decoded.role;
  }

  return (
    <div className="section">
      {isAuthenticated ? (
        role === "Producer" ? (
          <Redirect to="/showcase" />
        ) : (
          <InfoLanding></InfoLanding>
        )
      ) : (
        <WelcomeLanding></WelcomeLanding>
      )}
    </div>
  );
}
