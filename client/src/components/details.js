import React from "react";
import "./details.css";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function Details() {
  const location = useLocation();
  const flights = location.state ? location.state.flights : [];  // Ensure to handle undefined state

  return (
    <div className="flights-container">
      {flights.map((flight, index) => (
        <div key={index} className="flight-card">
          <div className="flight-info">
            <div><strong>From:</strong> {flight.from}</div>
            <div><strong>To:</strong> {flight.to}</div>
            <div><strong>Airline:</strong> {flight.airline}</div>
            <div><strong>Flight Number:</strong> {flight.flightNumber}</div>
          </div>
          <Link to="/payment" style={{ textDecoration: "none" }}>
            <button className="book-button">Book Now</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Details;
