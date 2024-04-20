import React from "react";
import "./details.css";
import { Link } from "react-router-dom";

function Details() {
  // Array of example flight details
  const flights = [
    { id: 1, origin: "New York", destination: "London", departTime: "08:00 AM", arriveTime: "08:00 PM", price: "$500", duration: "12h" },
    { id: 2, origin: "San Francisco", destination: "Berlin", departTime: "09:00 AM", arriveTime: "09:00 AM", price: "$600", duration: "12h" },
    { id: 3, origin: "Tokyo", destination: "Paris", departTime: "11:00 AM", arriveTime: "11:00 PM", price: "$550", duration: "12h" },
    { id: 4, origin: "Sydney", destination: "Toronto", departTime: "07:00 AM", arriveTime: "07:00 PM", price: "$650", duration: "12h" },
    { id: 5, origin: "Mumbai", destination: "New York", departTime: "06:00 AM", arriveTime: "06:00 PM", price: "$700", duration: "12h" }
  ];

  return (
    <div className="flights-container">
      {flights.map(flight => (
        <div key={flight.id} className="flight-card">
          <div className="flight-info">
            <div><strong>From:</strong> {flight.origin}</div>
            <div><strong>To:</strong> {flight.destination}</div>
            <div><strong>Depart:</strong> {flight.departTime}</div>
            <div><strong>Arrive:</strong> {flight.arriveTime}</div>
            <div><strong>Duration:</strong> {flight.duration}</div>
            <div className="price"><strong>Price:</strong> {flight.price}</div>
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
