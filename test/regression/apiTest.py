import sys
import requests
import numpy as np 
import matplotlib.pyplot as plt

url = "http://localhost:8080/"
resetURL = url + 'api/reset'
bookURL = url + 'api/book'
tickURL = url + 'api/tick'


def book(jsonContent):
    """Sends an /api/book request

    jsonContent -- JSON object to send to the POST /api/book request
    """

    try:
        r = requests.post(bookURL, json=jsonContent)
        if r.status_code != 200:
            print('ERROR, /api/book status is not 200')
            sys.exit(1)
        print(r.json())
    except requests.exceptions.RequestException as re:
        print('/api/book request exception: ' + format(re))
        sys.exit(1)

    
def tick(count, taxi1, taxi2, taxi3):
    """Sends an /api/tick request for the amount of times passed as the count argument
    Appends the taxi paths to the paths passed as arguments

    count -- number of times the /api/tick request should be made
    taxi1 -- 2D numpy array representing path of Taxi1
    taxi2 -- 2D numpy array representing path of Taxi2
    taxi3 -- 2D numpy array representing path of Taxi3

    Returns (taxi1, taxi2, taxi3) which are updated 2D numpy arrays representing the paths of the three taxis
    """
    
    for x in range(8):
        try:
            r = requests.post(tickURL)
            if r.status_code != 200:
                print('ERROR, /api/tick status is not 200')
                sys.exit(1)
            print(r.json())
        except requests.exceptions.RequestException as re:
            print('/api/tick request exception: ' + format(re))
            sys.exit(1)
            
        taxi1Json = r.json()[0]
        taxi2Json = r.json()[1]
        taxi3Json = r.json()[2]
        row1 = [taxi1Json['x'], taxi1Json['y']]
        row2 = [taxi2Json['x'], taxi2Json['y']]
        row3 = [taxi3Json['x'], taxi3Json['y']]
        taxi1 = np.vstack([taxi1, row1])
        taxi2 = np.vstack([taxi2, row2])
        taxi3 = np.vstack([taxi3, row3])

    return taxi1, taxi2, taxi3 


def reset():
    try:
        r = requests.post(resetURL)
        if r.status_code != 200:
            print('ERROR, /api/reset status is not 200')
            sys.exit(1)
        print(r.json())
    except requests.exceptions.RequestException as re:
        print('/api/reset request exception: ' + format(re))
        sys.exit(1)


def plotPaths(taxi1, taxi2, taxi3):
    """Plots the paths, sources and destinations for the three taxis
    Sources and destinations are hard-coded in this function for the plots based on the expected outcome

    taxi1 -- 2D numpy array representing path of Taxi1
    taxi1 -- 2D numpy array representing path of Taxi2
    taxi1 -- 2D numpy array representing path of Taxi3
    """
    
    plt.figure(1)
    plt.subplot(311)
    plt.plot(taxi1[:,0], taxi1[:,1], 'r.', label='Path')
    plt.plot([1,1], [2,-1], 'ro', label='Source')
    plt.plot([3,2], [2,-2], 'rd', label='Destination')
    plt.legend()
    plt.title('Taxi1')
    plt.ylabel('Y')
    
    plt.subplot(312)
    plt.plot(taxi2[:,0], taxi2[:,1], 'b.', label='Path')
    plt.plot([-1, -2], [2, 1], 'bo', label='Source')
    plt.plot([-2, -3], [2, 0], 'bd', label='Destination')
    plt.legend()
    plt.title('Taxi2')
    plt.ylabel('Y')
    
    plt.subplot(313)
    plt.plot(taxi3[:,0], taxi3[:,1], 'g.', label='Path')
    plt.plot(-1, -3, 'go', label='Source')
    plt.plot(-2, -3, 'gd', label='Destination')
    plt.legend()
    plt.title('Taxi3')
    plt.xlabel('X')
    plt.ylabel('Y')
    
    plt.show()

            
def apiTest():
    """Main method to test the APIs
    """

    reset()
    taxi1 = np.array([[0, 0]])
    taxi2 = np.array([[0, 0]])
    taxi3 = np.array([[0, 0]])

    jsonContent = { 'source': { 'x': 1, 'y': 2 }, 'destination': { 'x': 3, 'y': 2 } }
    book(jsonContent)
    
    jsonContent = { 'source': { 'x': -1, 'y': 2 }, 'destination': { 'x': -2, 'y': 2 } }
    book(jsonContent)

    jsonContent = { 'source': { 'x': -1, 'y': -3 }, 'destination': { 'x': -2, 'y': -3 } }
    book(jsonContent)

    jsonContent = { 'source': { 'x': 1, 'y': -1 }, 'destination': { 'x': 2, 'y': -2 } }
    book(jsonContent)

    taxi1, taxi2, taxi3 = tick(8, taxi1, taxi2, taxi3)

    jsonContent = { 'source': { 'x': 1, 'y': -1 }, 'destination': { 'x': 2, 'y': -2 }}
    book(jsonContent)

    jsonContent = { 'source': { 'x': -2, 'y': 1 }, 'destination': { 'x': -3, 'y': 0 }}
    book(jsonContent)

    taxi1, taxi2, taxi3 = tick(8, taxi1, taxi2, taxi3)

    plotPaths(taxi1, taxi2, taxi3)
        

if __name__ == "__main__":

    apiTest()
