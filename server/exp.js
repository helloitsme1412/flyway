console.log('Step 1: Starting Express server setup');

const express = require('express');
const app = express();
const port = 3000;

// Dummy JSON data
const jsonData = {
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
};
app.get('/', (req, res) => {
    res.redirect('/data');
  });
  
// Define a route to serve JSON data
app.get('/data', (req, res) => {
  console.log('Step 3: Serving JSON data');
  res.json(jsonData);
});

app.listen(port, () => {
  console.log(`Step 2: Server is running on http://localhost:${port}`);
});
