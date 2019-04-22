'use strict';

const express = require('express');
const router = express.Router();
const TaxiFleet = require('@taxiBooking/TaxiFleet.js');
const Position = require('@taxiBooking/Position.js');
const constantsResponse = require('@constants/statusConstants.js');
const taxiBookingConstants = require('@constants/taxiFleetConstants.js');

const taxiFleet = new TaxiFleet();

/**
 * POST method for /api/reset URL
 * @param {object} req is the request obj
 * @param {object} res is the response obj
 * @returns {object} that returns json or error message
 */
router.postReset = function (req, res) {
  taxiFleet.reset((completed) => {
    console.log('Taxi fleet reset: ' + completed);
  });
  res.status(constantsResponse.OK);
  res.json({
  });
};


/**
 * POST method for the /api/book URL
 * @param {object} req is the request obj
 * @param {object} res is the response obj
 * @returns {object} that returns json or error message
 */
router.postBook = function (req, res) {
  const source = req.body.source;
  const sourceX = source.x;
  const sourceY = source.y;

  // Make sure passed coordinates for source and destination are 32-bit integers
  if (sourceX < taxiBookingConstants.MIN_GRID_INDEX || sourceX > taxiBookingConstants.MAX_GRID_INDEX)
    _sendJsonErr(res, constantsResponse.BAD_REQUEST, 'Source.x value is not a 32-bit integer');
  if (sourceY < taxiBookingConstants.MIN_GRID_INDEX || sourceY > taxiBookingConstants.MAX_GRID_INDEX)
    _sendJsonErr(res, constantsResponse.BAD_REQUEST, 'Source.y value is not a 32-bit integer');
  const sourcePos = new Position(sourceX, sourceY);

  const destination = req.body.destination;

  const destX = destination.x;
  const destY = destination.y;

  if (destX < taxiBookingConstants.MIN_GRID_INDEX || destX > taxiBookingConstants.MAX_GRID_INDEX)
    _sendJsonErr(res, constantsResponse.BAD_REQUEST, 'Destination.x value is not a 32-bit integer');
  if (destY < taxiBookingConstants.MIN_GRID_INDEX || destY > taxiBookingConstants.MAX_GRID_INDEX)
    _sendJsonErr(res, constantsResponse.BAD_REQUEST, 'Destination.y value is not a 32-bit integer');
  const destinationPos = new Position(destX, destY);

  // Check if source and destination are the same, in which case report a bad request
  if (sourceX === destX && sourceY === destY)
    _sendJsonErr(res, constantsResponse.BAD_REQUEST, 'Source and destination are identical');

  taxiFleet.bookCustomer(sourcePos, destinationPos, (booked) => {
    res.status(constantsResponse.OK);
    res.json(booked);
  });
};

/**
 * POST method for the /api/tick URL
 * @param {object} req is the request obj
 * @param {object} res is the response obj
 * @returns {object} that returns json or error message
 */
router.postTick = function (req, res) {
  taxiFleet.advanceTime((state) => {
    res.status(constantsResponse.OK);
    res.json(state);
  });

};


/**
 * Create error handling for client
 * Handles sending errors back to client
 * @param {object} res pass in response object
 * @param {int} status the status code to respond with
 * @param {string} errMsg the error message to respond with
 * @returns {void} nothing - sends response to client
 * @private
 */
function _sendJsonErr (res, status, errMsg) {
  res.status(status);
  res.json({
    error: errMsg
  });
}


module.exports = router;
