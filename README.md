# Elevator system
> **Please select the socket branch for the best functinallity**
## Description
A backend system made for calling elevators to specific floors with a simple frontend to visualize the elevators.

## 🚀 Running
There are **two** versions of the project, one strictly using a REST API and the other one relying on Websockets. Using WebSockets, we can continuously update the client with the latest information about the elevators without the client having to call on multiple requests.

Using websockets, 

Both the frontend and the backend has the following npm scripts
* `npm run clean`
    * Used to clean the workspace
* `npm run build`
    * Builds the source files
* `npm run develop`
    * Runs the application locally

## 💻 Using
Press one out of the 20 buttons in the UI to call an elevator to that floor. If you wish to call on multiple elevators, the system will decide which elevator is closest and choose that one. If the elevator is close but busy, the system will wait for that elevator to finish until moving on to the next floor in the queue. 

Multiple elevators can run at the same time without any problem. 

## 🧪 Tests
The backend has a few tests to ensure the functionality of the elevator is working.

To run the tests from the backend folder:
* `npm run test`

## 📂 Logging
The logging on the server is using [Winston](https://github.com/winstonjs/winston) and all logs are written to a log file.

To tail the logs, run from the backend folder:
* `tail -f ./logs/server.log`
