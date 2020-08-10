import React from "react";
import "./style.css";
import DevsLetterProducerHeader from "../ProducerHeader";
import jwt_decode from "jwt-decode";
import DevsLetterObserverHeader from "../ObserverHeader";

export default function DevsLetterShowcase() {
  let token = localStorage.getItem("token")!;
  let decoded = jwt_decode(token) as any;
  let role: string = decoded.role;

  return (
    <div className="Showcase">
      {role === "Producer" ? (
        <DevsLetterProducerHeader></DevsLetterProducerHeader>
      ) : (
        <DevsLetterObserverHeader></DevsLetterObserverHeader>
      )}
    </div>
  );
}
