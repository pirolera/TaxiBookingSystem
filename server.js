'use strict';

// Register any short path names defined in package.json
require('module-alias/register');

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const routes = require('@src/routes');
const statusConstants = require('@src/constants/statusConstants');


// Set port
const localPort = 8080;
const port = process.env.PORT || localPort;

app.use(bodyParser.json());


// Do this for all requests
app.use((req, res, next) => {
  // Log request received
  console.log('Request Received: ', dateDisplayed(Date.now()));

  // Clean up the headers
  res.removeHeader('X-Powered-By');

  // Action after response
  const afterResponse = function () {
    // Log request completed
    console.log('Request Completed: ', dateDisplayed(Date.now()));
  };

  // Hooks to execute after response
  res.on('finish', afterResponse);
  res.on('close', afterResponse);

  next();
});

/**
 * Get a nicely formatted date to display
 *
 * @param {Date} timestamp - the date to format
 * @returns {string} with the format M/D/YYYY H:MM:SS
 */
function dateDisplayed (timestamp) {
  const date = new Date(timestamp);

  return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' +
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}


// Define all routes and map to route functions
app.post('/api/book', routes.postBook);
app.post('/api/tick', routes.postTick);
app.post('/api/reset', routes.postReset);

app.use((req, res) => {
  console.log('Endpoint does not exist: ' + req.url);
  res.status(statusConstants.NOT_FOUND);
  res.send(
    {
      error: 'This method/page does not exist. Please consult the API documentation.'
    });
});


// Start server listening on port 3000
app.listen(port);
console.log('REST API listening on port: ' + port);

module.exports = app;
