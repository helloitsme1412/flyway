require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { MongoClient, ObjectId } = require('mongodb');
const { spawn } = require('child_process');

const app = express();
app.use(cors());

app.use(bodyParser.json());

// Mongoose Connection for Transcripts
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once('open', function() {
    console.log("Connected successfully to MongoDB via Mongoose");
});

// Define Mongoose schema and model for transcripts
const TranscriptSchema = new mongoose.Schema({
    transcript: String,
    timestamp: { type: Date, default: Date.now }
});
const Transcript = mongoose.model('Transcript', TranscriptSchema);

// MongoDB client for fetching data
const client = new MongoClient(process.env.MONGODB_URI);

// Global variable to hold the latest processed data
let latestProcessedData = null;

// Function to fetch data and call a Python script
async function fetchDataAndCallPython() {
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('transcripts');

        const query = {};
        const projection = { transcript: 1 };
        const sort = { timestamp: -1 };
        const result = await collection.find(query).project(projection).sort(sort).limit(1).toArray();
        
        if (result.length > 0) {
            console.log("Latest Transcript:", result[0].transcript);

            const childPython = spawn('python', ['flyway.py', result[0].transcript]);
            childPython.stdout.on('data', (data) => {
                const jsonData = JSON.parse(data.toString());
                updateLatestProcessedData(jsonData);
            });

            childPython.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            childPython.on('close', (code) => {
                console.log(`Python script finished with code ${code}`);
            });
        } else {
            console.log("No transcripts found");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        await client.close();
    }
}

// Function to update the latest processed data
function updateLatestProcessedData(data) {
    latestProcessedData = data;
}

// Route to serve the latest processed data
app.get('/extracted-data', (req, res) => {
    if (latestProcessedData) {
        res.json(latestProcessedData);
    } else {
        res.status(404).send('No data available');
    }
});

// Route for posting transcripts
app.post('/transcripts', async (req, res) => {
    if (!req.body.transcript) {
        return res.status(400).send('Transcript is required');
    }
    const newTranscript = new Transcript({ transcript: req.body.transcript });
    try {
        await newTranscript.save();
        res.status(201).send('Transcript saved');
        fetchDataAndCallPython();  // Call this function after saving
    } catch (err) {
        console.error("Save failed:", err);
        res.status(500).json('Error: ' + err);
    }
});

// MongoClient for Flight Details
const MONGODB_URI_FLIGHTS = process.env.MONGODB_URI_FLIGHTS || process.env.MONGODB_URI; // Default to the same URI if not specified
const flightClient = new MongoClient(MONGODB_URI_FLIGHTS);

// Route for searching flights
app.post('/search-flights', async (req, res) => {
    try {
        await flightClient.connect();
        const database = flightClient.db('manish');
        const collection = database.collection('flight');
        const results = await collection.find({ from: req.body.from, to: req.body.to }).toArray();
        res.json(results);
    } catch (error) {
        console.error("Error searching flights:", error);
        res.status(500).json({ error: "An error occurred while searching flights" });
    } finally {
        await flightClient.close();
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

