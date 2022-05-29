# Elevator system
## Description
A backend system for calling elevators to specific floors with a simple frontend to visualize the elevators.

## 🚀 Running
There are **two** version of the project, one strictly using a REST API and the other one relying on Websockets. 

Both the frontend and the backend has the following npm scripts
* `npm run clean`
    * Used to clean the workspace
* `npm run build`
    * Builds the source files
* `npm run develop`
    * Runs the application locally

## 🧪 Tests
The backend has a few tests to ensure the functionality of the elevator is working.

To run the tests from the backend folder:
* `npm run test`

## 📂 Logging
The logging on the server is using [Winston](https://github.com/winstonjs/winston) and all logs are written to a log file.

To tail the logs, run from the backend folder:
* `tail -f ./logs/server.log`
