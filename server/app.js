const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/flyway', {
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
    const newTranscript = new Transcript({ transcript: req.body.transcript });
    console.log("Attempting to save:", newTranscript);  // Log what is being saved
    
    newTranscript.save()
        .then(() => {
            console.log("Saved successfully:", newTranscript);  // Log the saved transcript
            res.status(201).send('Transcript saved');
        })
        .catch(err => {
            console.error("Save failed:", err);  // Log any errors that occur
            res.status(400).json('Error: ' + err);
        });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
