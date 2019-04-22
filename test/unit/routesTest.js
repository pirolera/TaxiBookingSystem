'use strict';

const expect = require('chai').expect;
const routes = require('@src/routes.js');
const response = require('express').response;
const sinon = require('sinon');
const constantsResponse = require('@constants/statusConstants.js');
const constantsTaxiFleet = require('@constants/taxiFleetConstants.js');

describe('routes Tests', () => {
  let sandbox;
  let statusStub;
  let jsonStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    // Stub out the response functions that we expect to be used so that we can monitor them
    statusStub = sandbox.stub(response, 'status');
    jsonStub = sandbox.stub(response, 'json');
    sandbox.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST', () => {
    describe('When called with /api/reset path', () => {
      it('should respond with 200 response.', (done) => {
        routes.postReset(
          {
            method: 'POST',
            url: '/api/reset'
          }, response);
        expect(statusStub.calledOnce).to.equal(true);
        expect(statusStub.args[0][0]).to.equal(constantsResponse.OK);
        done();
      });
    });
    describe('When called with /api/tick path', () => {
      it('should respond with 200 response.', (done) => {
        routes.postTick(
          {
            method: 'POST',
            url: '/api/tick'
          }, response);
        expect(statusStub.calledOnce).to.equal(true);
        expect(statusStub.args[0][0]).to.equal(constantsResponse.OK);
        done();
      });
    });
    describe('When called with /api/book path', () => {

      describe('When called with valid data', () => {

        afterEach(() => {
          sandbox.restore();
        });

        const validBookNorthRequest = {
          body: {
            destination: {
              x: 0,
              y: 4
            },
            source: {
              x: 0,
              y: 2
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const validBookEastRequest = {
          body: {
            destination: {
              x: 4,
              y: 0
            },
            source: {
              x: 2,
              y: 0
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const validBookWestRequest = {
          body: {
            destination: {
              x: -4,
              y: 0
            },
            source: {
              x: -2,
              y: 0
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const validBookSameSourceRequest = {
          body: {
            destination: {
              x: 0,
              y: -4
            },
            source: {
              x: 0,
              y: 0
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const validTickRequest = {
          method: 'POST',
          url: '/api/tick'
        };

        it('should respond with 200 response.', (done) => {
          routes.postBook(validBookNorthRequest, response);
          expect(statusStub.calledOnce).to.equal(true);
          expect(statusStub.args[0][0]).to.equal(constantsResponse.OK);
          done();
        });
        it('should respond with taxi 1 booked for the first customer', (done) => {
          routes.postReset(
            {
              method: 'POST',
              url: '/api/reset'
            }, response);
          routes.postBook(validBookNorthRequest, response);
          expect(jsonStub.args[1][0].car_id).to.equal(constantsTaxiFleet.FIRST_INDEX);
          done();
        });
        it('should respond with taxi 2 booked for the second customer', (done) => {
          routes.postBook(validBookEastRequest, response);
          expect(jsonStub.calledOnce).to.equal(true);
          expect(jsonStub.args[0][0].car_id).to.equal(constantsTaxiFleet.SECOND_INDEX);
          done();
        });
        it('should respond with taxi 3 booked for the third customer', (done) => {
          routes.postBook(validBookWestRequest, response);
          expect(jsonStub.calledOnce).to.equal(true);
          expect(jsonStub.args[0][0].car_id).to.equal(constantsTaxiFleet.THIRD_INDEX);
          done();
        });
        it('should respond with empty booking for the fourth customer', (done) => {
          routes.postBook(validBookWestRequest, response);
          expect(jsonStub.calledOnce).to.equal(true);
          expect(jsonStub.args[0][0].hasOwnProperty('car_id')).to.equal(false);
          done();
        });
        it('should report hasCustomer true in all taxis after 2 ticks', (done) => {
          routes.postTick(validTickRequest, response);
          expect(jsonStub.args[0][0][0].hasCustomer).to.equal(false);
          expect(jsonStub.args[0][0][1].hasCustomer).to.equal(false);
          expect(jsonStub.args[0][0][2].hasCustomer).to.equal(false);
          expect(jsonStub.args[0][0][0].booked).to.equal(true);
          expect(jsonStub.args[0][0][1].booked).to.equal(true);
          expect(jsonStub.args[0][0][2].booked).to.equal(true);

          routes.postTick(validTickRequest, response);
          expect(jsonStub.args[1][0][0].hasCustomer).to.equal(true);
          expect(jsonStub.args[1][0][1].hasCustomer).to.equal(true);
          expect(jsonStub.args[1][0][2].hasCustomer).to.equal(true);
          done();
        });
        it('should report all taxis are available after 2 more ticks', (done) => {
          routes.postTick(validTickRequest, response);
          routes.postTick(validTickRequest, response);
          expect(jsonStub.args[1][0][0].hasCustomer).to.equal(false);
          expect(jsonStub.args[1][0][1].hasCustomer).to.equal(false);
          expect(jsonStub.args[1][0][2].hasCustomer).to.equal(false);
          done();
        });
        it('should book taxi1 again after it dropped a customer to their destination', (done) => {
          routes.postBook(validBookNorthRequest, response);
          expect(jsonStub.calledOnce).to.equal(true);
          expect(jsonStub.args[0][0].car_id).to.equal(constantsTaxiFleet.FIRST_INDEX);
          done();
        });
        it('should book taxi2 again after it dropped a customer to their destination', (done) => {
          routes.postBook(validBookEastRequest, response);
          expect(jsonStub.calledOnce).to.equal(true);
          expect(jsonStub.args[0][0].car_id).to.equal(constantsTaxiFleet.SECOND_INDEX);
          done();
        });
        it('should book taxi3 again after it dropped a customer to their destination', (done) => {
          routes.postBook(validBookWestRequest, response);
          expect(jsonStub.calledOnce).to.equal(true);
          expect(jsonStub.args[0][0].car_id).to.equal(constantsTaxiFleet.THIRD_INDEX);
          done();
        });
        it('should pick a customer if their source is the same as the current location of the taxi', (done) => {
          routes.postReset(
            {
              method: 'POST',
              url: '/api/reset'
            }, response);
          routes.postBook(validBookSameSourceRequest, response);
          routes.postTick(validTickRequest, response);
          expect(jsonStub.args[1][0].car_id).to.equal(constantsTaxiFleet.FIRST_INDEX);
          expect(jsonStub.args[2][0][0].hasCustomer).to.equal(true);
          expect(jsonStub.args[2][0][0].booked).to.equal(true);
          done();
        });

      });
      describe('When called with invalid data', () => {

        afterEach(() => {
          sandbox.restore();
        });

        const invalidBookSourceXRequest = {
          body: {
            destination: {
              x: 0,
              y: 4
            },
            source: {
              x: 999999999999999,
              y: 2
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const invalidBookSourceYRequest = {
          body: {
            destination: {
              x: 0,
              y: 4
            },
            source: {
              x: 0,
              y: 999999999999999
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const invalidBookDestinationXRequest = {
          body: {
            destination: {
              x: 999999999999999,
              y: 4
            },
            source: {
              x: 0,
              y: 2
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const invalidBookDestinationYRequest = {
          body: {
            destination: {
              x: 0,
              y: 999999999999999
            },
            source: {
              x: 0,
              y: 2
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        const invalidBookIdenticalSourceDestRequest = {
          body: {
            destination: {
              x: 0,
              y: 0
            },
            source: {
              x: 0,
              y: 0
            }
          },
          method: 'POST',
          url: '/api/book'
        };

        it('should report error for source.x not being 32-bit integer', (done) => {
          routes.postBook(invalidBookSourceXRequest, response);
          expect(statusStub.args[0][0]).to.equal(constantsResponse.BAD_REQUEST);
          expect(jsonStub.args[0][0].error).to.equal('Source.x value is not a 32-bit integer');
          done();
        });

        it('should report error for source.y not being 32-bit integer', (done) => {
          routes.postBook(invalidBookSourceYRequest, response);
          expect(statusStub.args[0][0]).to.equal(constantsResponse.BAD_REQUEST);
          expect(jsonStub.args[0][0].error).to.equal('Source.y value is not a 32-bit integer');
          done();
        });

        it('should report error for destination.x not being 32-bit integer', (done) => {
          routes.postBook(invalidBookDestinationXRequest, response);
          expect(statusStub.args[0][0]).to.equal(constantsResponse.BAD_REQUEST);
          expect(jsonStub.args[0][0].error).to.equal('Destination.x value is not a 32-bit integer');
          done();
        });

        it('should report error for destination.y not being 32-bit integer', (done) => {
          routes.postBook(invalidBookDestinationYRequest, response);
          expect(statusStub.args[0][0]).to.equal(constantsResponse.BAD_REQUEST);
          expect(jsonStub.args[0][0].error).to.equal('Destination.y value is not a 32-bit integer');
          done();
        });

        it('should report error for request with identical source and destination', (done) => {
          routes.postBook(invalidBookIdenticalSourceDestRequest, response);
          expect(statusStub.args[0][0]).to.equal(constantsResponse.BAD_REQUEST);
          expect(jsonStub.args[0][0].error).to.equal('Source and destination are identical');
          done();
        });
      });
    });
  });
});
