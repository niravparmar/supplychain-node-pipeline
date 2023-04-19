const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const config = require('./config');
const routes = require('./routes');
const producer = require('./producer');
const consumer = require('./consumer');

const app = express();
const port = config.app.port;

// Middleware to parse request body
app.use(bodyParser.json());

// API routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
