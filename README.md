[![Build Status](https://travis-ci.org/pirolera/TaxiBookingSystem.svg?branch=master)](https://travis-ci.org/pirolera/TaxiBookingSystem)

# Taxi Booking System

The Taxi Booking system provides a way to book three cabs to take customers anywhere within a grid defined by 32-bit integers. It provides three main APIs:  
- /api/reset: Resets the system to original state  
- /api/book: Books a taxi for a customer if there are taxis available  
- /api/tick: Adanves the time by one unit and updates the state of the system
        
## Getting Started
### Running Standalone
* Install node (this implementation is tested with node version 6.3.1)
* Install npm (this implementation is tested with npn version 3.10.3)
* Install gulp
* Run `npm install` in the command line from your project root folder to install the package dependencies.
* Run `npm start` in the command line from your project root folder to start the backend.


### Running Tests
#### Unit Tests
* Run `npm run test` to run lint tests, unit tests and coverage report
* See gulpfile.js for the individual gulp tasks, including running lint tests, unit tests and coverage report.
* Run `gulp watch` in the root directory of the project to watch the src and test directories and kick off the JSLint tests, unit tests, and generate a code coverage report every time a change is made.
* The unit tests are implemented in test/unit/routesTest.js. The code has 100% test coverage. The expected output of the unit tests is:  
- routes Tests  
    - POST  
        - When called with /api/reset path  
            - ✓ should respond with 200 response.  
        - When called with /api/tick path  
            - ✓ should respond with 200 response.  
        - When called with /api/book path  
            - When called with valid data  
                - ✓ should respond with 200 response.  
                - ✓ should respond with taxi 1 booked for the first customer  
                - ✓ should respond with taxi 2 booked for the second customer  
                - ✓ should respond with taxi 3 booked for the third customer  
                - ✓ should respond with empty booking for the fourth customer  
                - ✓ should report hasCustomer true in all taxis after 2 ticks  
                - ✓ should report all taxis are available after 2 more ticks  
                - ✓ should book taxi1 again after it dropped a customer to their destination  
                - ✓ should book taxi2 again after it dropped a customer to their destination  
                - ✓ should book taxi3 again after it dropped a customer to their destination  
                - ✓ should pick a customer if their source is the same as the current location of the taxi  
            - When called with invalid data  
                - ✓ should report error for source.x not being 32-bit integer  
                - ✓ should report error for source.y not being 32-bit integer  
                - ✓ should report error for destination.x not being 32-bit integer  
                - ✓ should report error for destination.y not being 32-bit integer  
                - ✓ should report error for request with identical source and destination  
- 18 passing (299ms)  

#### Regression Tests
* Install python3
* Install matplotlib python3 package
* Install numpy python3 package
* Install requests python3 package
* Run `python3 apiTest.py` in the command line from the test/regression folder
* The expected output is a figure with three subplots, showing the paths of the three taxis for a particular scenario. This regression test was added for visual inspection of the outcome of the scenario, augmenting the functionality testing through the unit tests.

## Software Description
### Software Design
The functionality of the Taxi Booking system is implemented in object-oriented design.  

The TaxiFleet class has a method for each REST API. It also contains three Taxi objects as part of its state. The three taxi objects are instantiated in the reset method.

The Taxi class contains the state and functionality for a particular taxi object. The advanceTime and bookCustomer functions are called from the corresponding functions in TaxiFleet. The advanceTime function calls the private _advancePosition method, which updates the location of the taxi based on its destination (to the customer's source or final destination). The algorithm to update the location of the taxi is a simple greedy algorithm that moves the taxi in the grid axis that has the biggest difference between the current position of the taxi and the current destination.

The Position class defines a 2D XY object that represents positions in the implementation.  

The routes.js file defines methods that implement the REST APIs and it also instantiates a new TaxiFleet. The server.js file maps the URLs to the method implementations in routes.js, and it starts the server on port 8080.  

### Class Diagram

        ______________
        |TaxiFleet   |
        |____________|
        |constructor |
        |reset       |
        |bookCustomer|
        |advanceTime |
        |____________|
        |____________|
              <>
              | 0..1
              |
              | 3..3
        _______________________
        |Taxi                 |
        |_____________________|
        |constructor          |
        |getId                |
        |bookCustomer         |
        |advanceTime          |
        |computeTimeToLocation|
        |_____________________|
        |_advancePosition     |
        |_____________________|
              <>
              | 0..1
              |
              | 1..1
        ______________
        |Position    |
        |____________|
        |constructor |
        |getX        |
        |getY        |
        |____________|
        |____________|

                
### Description of files
- config/                         - Folder with config files  
    - .eslintrc                   - Linting rules definition, verified as part of unit testing  
- reports/                        - Folder where code coverage reports are generated from unit tests  
- screenshots/                    - Folder with screenshots of regression and unit tests output, and API swagger documentation 
- src/                            - Folder with source code  
    - constants/                  - Folder with constants value definitions  
        - statusConstants.js      - Constants related to REST API return codes  
        - taxiFleetConstants.js   - Constants used in the Taxi Booking system  
    - routes.js                   - Implements each REST API  
    - taxiBooking/                - Source code of the functionality implementation  
        - Position.js             - Position class definition  
        - TaxiFleet.js            - TaxiFleet class definition  
        - Taxi.js                 - Taxi class definition  
- test/                           - Folder with unit and regression tests  
    - unit/                       - Folder with unit tests
        - routesTest.js           - Unit tests definitions  
    - regression/                 - Folder with regression tests  
        - apiTest.py              - Scipt to test the full Taxi Booking system and display the output  
- gulpfile.js                     - Gulp task definitions  
- package.json                    - Package configuration and definitions  
- README.md                       - This file  
- server.js                       - Main file that starts the Taxi Booking System backend  
- swagger.yml                     - API definition  
