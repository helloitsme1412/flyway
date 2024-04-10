import React from "react";
import "./details.css";

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
      <button type="button" className="submit-button">Book Now</button>
    </div>
  );
}

export default Details;
