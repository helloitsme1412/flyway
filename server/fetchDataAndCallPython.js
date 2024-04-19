require('dotenv').config(); // Load environment variables from .env file
const { MongoClient } = require('mongodb');
const { spawn } = require('child_process');

async function fetchDataAndCallPython(app) {
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
                sendDataToClient(app, jsonData); // Pass the JSON data to the sendDataToClient function
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
function sendDataToClient(app, data) {
    console.log("Sending data to client...");
    // Send data to the frontend using a route
    app.get('/extracted-data', (req, res) => {
        console.log("Serving latest processed data...");
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('No data available');
        }
    });
}

module.exports = { fetchDataAndCallPython, sendDataToClient }; // Export both functions
