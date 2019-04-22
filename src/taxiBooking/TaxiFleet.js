'use strict';

const Taxi = require('@taxiBooking/Taxi.js');
const constants = require('@constants/taxiFleetConstants.js');

/**
 * Represents a fleet of taxis
 */
class TaxiFleet {

  /**
   * Constructor for the TaxiFleet class
   * @returns {void}
   */
  constructor () {
    this.taxis = [];
  }


  /**
   * Resets the taxis in the fleet to their original location
   * @param {function} callback -- Callback that is returned by the function
   * @returns {function} callback(true) when the function completes
   */
  reset (callback) {
    this.taxis = [];
    let i = 0;

    for (; i < constants.NUMBER_OF_TAXIS; i++) {
      const taxi = new Taxi(i + 1);

      this.taxis = this.taxis.concat([taxi]);
    }

    return callback(true);
  }


  /**
   * Books a customer in the closest available taxi in the fleet
   * @param {Position} sourcePos -- Position where the customer is waiting
   * @param {Position} destinationPos -- Position where the customer wants to go
   * @param {function} callback -- Callback that is returned by the function
   * @returns {function} callback({}) if no taxis are available,
   *          callback({'car_id': matchedTaxi, 'total_time': totalTripTime}) with the closest available taxi
   */
  bookCustomer (sourcePos, destinationPos, callback) {
    // Compute shortest time to source + destination
    let shortestTime = null;
    let closestTaxi = null;

    this.taxis.forEach((taxi) => {
      const tripTime = taxi.computeTimeToLocation(sourcePos, destinationPos);

      if (tripTime !== null) {
        if (shortestTime === null || shortestTime > tripTime) {
          shortestTime = tripTime;
          closestTaxi = taxi;
        }
      }
    });

    // If shortestTime is still null, that means all taxis were booked
    if (shortestTime === null)
      return callback({
      });

    // Book taxi
    closestTaxi.bookCustomer(sourcePos, destinationPos);

    const ret = {
      car_id: closestTaxi.getId(),
      total_time: shortestTime
    };

    return callback(ret);
  }


  /**
   * Advances the state of the taxi fleet for one time tick
   * @param {function} callback -- Callback that is returned by the function
   * @returns {function} callback(updatedState) with updated state
   */
  advanceTime (callback) {
    let fullState = [];

    this.taxis.forEach((taxi) => {
      taxi.advanceTime((state) => {
        fullState = fullState.concat([state]);
      });
    });

    return callback(fullState);
  }
}

module.exports = TaxiFleet;
