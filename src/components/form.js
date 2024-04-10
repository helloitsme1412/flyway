import React, { useState, useRef } from "react";
import "./form.css"; 
import { Link } from "react-router-dom";

function FormPage() {
  const [formData, setFormData] = useState({
    tripType: "oneWay",
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    classType: "economy",
  });
  const [isRecording, setIsRecording] = useState(false);
  const speechRecognitionRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const toggleRecording = () => {
    // Check for support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    // Initialize speech recognition if it hasn't been already
    if (!speechRecognitionRef.current) {
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = false;
      speechRecognitionRef.current.lang = "en-US";
      speechRecognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log(transcript); // Here, you could also update the state or form with the transcript
      };
      speechRecognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    // Toggle the recording state
    if (isRecording) {
      speechRecognitionRef.current.stop();
    } else {
      speechRecognitionRef.current.start();
    }
    setIsRecording(!isRecording); // Update the recording state
  };

  return (
    <div className="form-container">
      <button className="circle-button" onClick={toggleRecording}>
        <i className={isRecording ? "fas fa-microphone-slash" : "fas fa-microphone"} />
      </button>
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
        <Link to="/details" style={{ textDecoration: "none" }}>
        <button type="submit">Submit</button></Link>
      </form>
    </div>
  );
}

export default FormPage;
