const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World with CORS!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
