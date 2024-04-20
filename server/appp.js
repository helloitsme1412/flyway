require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const cors = require('cors');
const helmet = require('helmet');



const app = express();
app.use(cors());
app.use(bodyParser.json());


// const MONGODB_URI="  "
async function fetchData(from, to) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const database = client.db('manish');
        const collection = database.collection('flight');

        const query = { from, to };
        const projection = { from: 1, to: 1 };
        const result = await collection.find(query, { projection }).toArray();
        console.log(result);
       
}
        catch (error) {
        console.error("Error connecting to the database:", error);
        throw new Error("Unable to connect to the database");
    } finally {
        await client.close();
    }
}

app.post('/search-flights', async (req, res) => {
    const { from, to } = req.body;
    try {
        const results = await fetchData(from, to);
        res.json(results);
    } catch (error) {
        console.error("Error searching flights:", error);
        res.status(500).json({ error: "An error occurred while searching flights" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


fetchData()