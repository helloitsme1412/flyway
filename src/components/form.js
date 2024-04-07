// FormPage.js
import React, { useState } from "react";
import "./form.css"; // Ensure this CSS file exists in your project

function FormPage() {
  const [formData, setFormData] = useState({
    tripType: "oneWay",
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    classType: "economy",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your form submission logic here
    console.log(formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="radio-container">
          <label>
            <input
              type="radio"
              name="tripType"
              value="oneWay"
              checked={formData.tripType === "oneWay"}
              onChange={handleChange}
            />
            One Way
          </label>
          <label>
            <input
              type="radio"
              name="tripType"
              value="twoWay"
              checked={formData.tripType === "twoWay"}
              onChange={handleChange}
            />
            Two Way
          </label>
        </div>
        <label htmlFor="classType">From</label>
        <input
          type="text"
          name="from"
          placeholder="From"
          value={formData.from}
          onChange={handleChange}
        />
        <label htmlFor="from">To</label>
        <input
          type="text"
          name="to"
          placeholder="To"
          value={formData.to}
          onChange={handleChange}
        />
        <label htmlFor="Departure Date">Departure Date</label>
        <input
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
        />
        <label htmlFor="Return Date">Return Date</label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
        />
        <label htmlFor="classType">Class</label>
        <select
          name="classType"
          value={formData.classType}
          onChange={handleChange}
        >
          <option value="economy">Economy</option>
          <option value="business">Business</option>
          <option value="firstClass">First Class</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormPage;
