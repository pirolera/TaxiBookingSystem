'use strict';

const Position = require('@taxiBooking/Position.js');

/**
 * Represents a Taxi
 */
class Taxi {

  /**
   * Constructor for the Taxi class
   * @param {number} id -- Id of the taxi
   * @returns {void}
   */
  constructor (id) {
    // Id of the taxi
    this.id = id;

    // Position of the taxi
    this.position = new Position(0, 0);

    // Boolean representing whether the taxi is currently booked
    this.booked = false;

    // Boolean representing whether taxi has customer
    // It determines whether the taxi should drive toward the customer source or destination
    this.hasCustomer = false;

    // Location where the customer is waiting for the taxi
    this.customerLocation = null;

    // Location of the destination where the customer is going
    this.customerDestination = null;
  }

  /**
   * Getter for the id
   * @returns {number} Id of the taxi
   */
  getId () {
    return this.id;
  }

  /**
   * Advances the state of the taxi for one time tick
   * @param {function} callback -- Callback that is returned by the function
   * @returns {function} callback(updatedState) with updated state
   */
  advanceTime (callback) {
    if (this.booked) {
      if (this.hasCustomer) {
        // Drive toward destination
        this._advancePosition(this.customerDestination);
      } else {
        // Drive toward customer location
        this._advancePosition(this.customerLocation);
      }
    }

    return callback({
      booked: this.booked,
      hasCustomer: this.hasCustomer,
      id: this.id,
      x: this.position.getX(),
      y: this.position.getY()
    });
  }


  /**
   * "Private" method to advance taxi position toward a destination and update state if destination is reached
   * @param {Position} destination -- Position representing the destination to be reached by the taxi
   * @returns {void}
   * @private
   */
  _advancePosition (destination) {
    let new_x = null;
    let new_y = null;
    let delta_x = destination.getX() - this.position.getX();
    let delta_y = destination.getY() - this.position.getY();

    // Greedy solution to move in the axis where the distance to destination is greatest
    if (Math.abs(delta_x) > Math.abs(delta_y)) {
      // Move in the x axis
      new_y = this.position.getY();
      if (delta_x > 0) {
        new_x = this.position.getX() + 1;
      } else {
        new_x = this.position.getX() - 1;
      }
    } else {
      // Move in the y axis
      new_x = this.position.getX();
      if (delta_y > 0) {
        new_y = this.position.getY() + 1;
      } else {
        new_y = this.position.getY() - 1;
      }
    }

    this.position = new Position(new_x, new_y);
    // Check to see if destination is reached
    delta_x = destination.getX() - new_x;
    delta_y = destination.getY() - new_y;
    if (delta_x === 0 && delta_y === 0) {
      if (this.hasCustomer) {
        // Reached final destination
        this.booked = false;
        this.hasCustomer = false;
        this.customerLocation = null;
        this.customerDestination = null;
      } else {
        // Reached customer location
        this.hasCustomer = true;
      }
    }
  }


  /**
   * Computes time it takes to reach source then destination from current position
   * @param {Position} source -- Position where the customer is waiting
   * @param {Position} destination -- Position where the customer wants to go
   * @returns {number} Time it takes to reach source then destination from current position
   */
  computeTimeToLocation (source, destination) {
    if (this.booked)
      return null;

    const timeToSource = Math.abs(source.x - this.position.x) + Math.abs(source.y - this.position.y);
    const timeToDest = Math.abs(destination.x - source.x) + Math.abs(destination.y - source.y);

    return timeToSource + timeToDest;
  }


  /**
   * Books a customer of the taxi and updates the state
   * @param {Position} source -- Position where the customer is waiting
   * @param {Position} destination -- Position where the customer wants to go
   * @returns {void}
   */
  bookCustomer (source, destination) {
    this.booked = true;
    this.customerLocation = source;
    this.customerDestination = destination;

    // If current taxi location is the same as the source location, set hasCustomer to true
    if (this.customerLocation.getX() === this.position.getX() && this.customerLocation.getY() === this.position.getY())
      this.hasCustomer = true;
  }
}

// Export the class
module.exports = Taxi;
