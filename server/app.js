const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
//const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
//app.use(helmet());
//const a = "XD";
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
        })
        .catch(err => {
            console.error("Save failed:", err);
            res.status(400).json('Error: ' + err);
        });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});