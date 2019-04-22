'use strict';

/**
 * Represents a 2D grid position
 */
class Position {

  /**
   * Constructor for the Position class
   * @param {number} x -- X coordinate
   * @param {number} y -- Y coordinate
   * @returns {void}
   */
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Getter for X coordinate of the position
   * @returns {number} X coordinate
   */
  getX () {
    return this.x;
  }

  /**
   * Getter for Y coordinate of the position
   * @returns {number} Y coordinate
   */
  getY () {
    return this.y;
  }
}

// Export the class
module.exports = Position;
