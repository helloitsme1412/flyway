import React, { useState, useRef } from "react";
import "./form.css";
import { Link } from "react-router-dom";

function FormPage() {
  const [formData, setFormData] = useState({
    tripType: "oneWay",
    name: "",
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    classType: "economy",
    transcript: "",
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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    if (!speechRecognitionRef.current) {
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = false;
      speechRecognitionRef.current.lang = "en-US";
      speechRecognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData((prevState) => ({
          ...prevState,
          transcript: prevState.transcript + " " + transcript,
        }));
      };
      speechRecognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    if (isRecording) {
      speechRecognitionRef.current.stop();
    } else {
      speechRecognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="page-layout">
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
              Return
            </label>
          </div>
          <label htmlFor="Name">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="from">From</label>
          <input
            type="text"
            name="from"
            placeholder="From"
            value={formData.from}
            onChange={handleChange}
          />
          <label htmlFor="to">To</label>
          <input
            type="text"
            name="to"
            placeholder="To"
            value={formData.to}
            onChange={handleChange}
          />
          <label htmlFor="departureDate">Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
          />
          {formData.tripType === "twoWay" && (
            <>
              <label htmlFor="returnDate">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
              />
            </>
          )}
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

          <label className="switch">
            <input
              type="checkbox"
              checked={isRecording}
              onChange={toggleRecording}
            />
            <span className="slider round">
            </span>
          </label>

          <Link to="/details" style={{ textDecoration: "none" }}>
            <button type="submit">Submit</button>
          </Link>
        </form>
      </div>

      <div className="transcript-container">
        <textarea
          className="transcript-area"
          rows="10"
          placeholder="Speak and see your text here..."
          value={formData.transcript}
          readOnly
        />
      </div>
    </div>
  );
}

export default FormPage;
