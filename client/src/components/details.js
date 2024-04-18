import React from "react";
import "./details.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Details() {
  // Example flight details
  const flightDetails = {
    flightName: "Flight A123",
    duration: "5 hours",
    price: "$349"
  };

  return (
    <div className="flight-details-container">
      <h2>Flight Details</h2>
      <div className="flight-detail"><strong>Flight Name:</strong> {flightDetails.flightName}</div>
      <div className="flight-detail"><strong>Time to Destination:</strong> {flightDetails.duration}</div>
      <div className="flight-detail"><strong>Price:</strong> {flightDetails.price}</div>
      <Link to="/payment" style={{ textDecoration: "none" }}>
      <button type="button" className="submit-button">
      Book Now</button>
      </Link>
    </div>
  );
}

export default Details;
