import React, { useState, useRef, useEffect } from "react";
import "./form.css";
import { Link } from "react-router-dom";

function FormPage({ json_data }) {
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
  // eslint-disable-next-line no-unused-vars
  const [previousData, setPreviousData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  const fetchData = () => {
    fetch("http://localhost:3001/extracted-data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data from server:", data);

        // Use functional update to ensure we're working with the most current state
        setFormData((prevData) => {
          // Compare the newly fetched data with the previous data
          if (JSON.stringify(data) !== JSON.stringify(prevData)) {
            // Update formData state with new data
            return {
              tripType: "oneWay", // Assuming default values
              name: data.names ? data.names[0] : "", // Extracting name
              from: data.from_location ? data.from_location : "", // Extracting from location
              to: data.to_location ? data.to_location : "", // Extracting to location
              departureDate: data.dates ? data.dates[0] : "", // Extracting departure date
              returnDate: "", // Assuming return date is not available
              classType: "economy", // Assuming default class type
              transcript: "", // Assuming transcript is not available
            };
          } else {
            // If the data is the same, return the previous state
            return prevData;
          }
        });

        // Update the previous data with the newly fetched data
        setPreviousData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    fetch("http://localhost:3001/transcripts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript: formData.transcript }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) =>
        console.log(
          "There has been an ambiguous problem in the fetch operation:",
          error
        )
      );
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
      handleSubmit();
      setTimeout(() => {
        // reload page
        window.location.reload();
      }, 6000);
    } else {
      speechRecognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="page-layout">
      <div className="form-container">
        <form className="booking-form">
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
            <span className="slider"></span>
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
