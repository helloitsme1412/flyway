require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected successfully to MongoDB");
});

// Define a schema for the transcript
const TranscriptSchema = new mongoose.Schema({
    transcript: String,
    timestamp: { type: Date, default: Date.now }
});

const Transcript = mongoose.model('Transcript', TranscriptSchema);

// Routes
app.post('/transcripts', (req, res) => {
    if (!req.body.transcript) {
        return res.status(400).send('Transcript is required');
    }

    const newTranscript = new Transcript({ transcript: req.body.transcript });
    console.log("Attempting to save:", newTranscript);
    
    newTranscript.save()
        .then(() => {
            console.log("Saved successfully:", newTranscript);
            res.status(201).send('Transcript saved');

            // After saving, fetch data and call Python script
            fetchDataAndCallPython();
        })
        .catch(err => {
            console.error("Save failed:", err);
            res.status(400).json('Error: ' + err);
        });
});

async function fetchDataAndCallPython() {
    const uri = process.env.MONGODB_URI; // MongoDB Atlas connection string loaded from .env file
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const database = client.db('test'); // Replace with your database name
        const collection = database.collection('transcripts'); // Replace with your collection name

        const query = {}; // Your query to fetch data
        const projection = { transcript: 1 }; // Projection to fetch only the transcript field
        const sort = { timestamp: -1 }; // Sort by timestamp in descending order
        const result = await collection.find(query, projection).sort(sort).limit(1).toArray();
        
        if (result.length > 0) {
            console.log("Latest Transcript:", result[0].transcript);

            // Spawn a child Python process
            const childPython = spawn('python', ['flyway.py', result[0].transcript]); // Pass the latest transcription as a command-line argument
            console.log("Python script has started running");

            // Collect data from Python script
            childPython.stdout.on('data', (data) => {
                const jsonData = JSON.parse(data.toString()); // Parse the received data as JSON
                console.log("Python script has sent JSON data:", jsonData);
                sendDataToClient(jsonData); // Pass the JSON data to the sendDataToClient function
            });

            childPython.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            childPython.on('close', (code) => {
                console.log(`Python script has finished running with code ${code}`);
            });

        } else {
            console.log("No transcripts found");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB Atlas");
    }
}


// Function to send data to the frontend
function sendDataToClient(data) {
    // Send data to the frontend using a route
    app.get('/extracted-data', (req, res) => {
        console.log("Serving latest processed data...");
        if (data) { // Use the 'data' parameter received by the function
            res.json(data); // Send the received data
        } else {
            res.status(404).send('No data available');
        }
    });
}


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});





