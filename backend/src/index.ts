
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Elevator, Direction, ElevatorProps } = require('./Elevator');
const logger = require("./utils/logger");

import cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

app.use(cors())

const NR_OF_FLOORS = 20;

let e1 = new Elevator(1, 1);
let e2 = new Elevator(2, 1);
let e3 = new Elevator(3, 1);
let e4 = new Elevator(4, 1);
let e5 = new Elevator(5, 1);

let ELEVATORS = [e1, e2, e3, e4, e5];

export const findClosestElevator = (elevators: typeof Elevator[], floor: number) => {
    /**
     * Finds the closest elevator to the given floor
     *
     * @param {Elevator[]} elevators - The elevators to search
     * @param {number} floor - The floor to search for
     * 
     * @return {Elevator} - The closest elevator
     */
    if(elevators.length === 0) {
        return null;
    }

    let closest = elevators[0];

    const sortedElevators = elevators.sort((a, b) => {
        const aDelta = Math.abs(a.floor - floor);
        const bDelta = Math.abs(b.floor - floor);

        return aDelta - bDelta;
    });

    // Pick first not idle elevator
    for(let i = 0; i < sortedElevators.length; i++) {
        const e = sortedElevators[i];
        if(e.direction === Direction.IDLE) {
            closest = e;
            break;
        }
    }

    if (closest.direction === Direction.IDLE) {
        return sortedElevators[0];
    }

    return closest;
}


app.get('/elevators/status', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ELEVATORS));
    res.status = 200;
    res.send();
});

io.on('connection', (socket: any) => {
    logger.info(`Elevator client connected: ${socket.id}`);
    socket.emit("status", ELEVATORS);

    socket.on("call", async (floor: number) => {
        const closestElevator = findClosestElevator(ELEVATORS, floor);
        logger.info(`Elevator ${closestElevator.id} (${closestElevator.direction}) requested to floor: ${floor}`);
        closestElevator.queue.push(floor);

        // This async function is called when the elevator has reached the floor
        closestElevator.move(socket, ELEVATORS).then(() => {
            logger.info(`Elevator ${closestElevator.id} has reached floor: ${closestElevator.floor}`);
            socket.emit("status", ELEVATORS);
        })

        // This will be called after the elevator has started moving but before the elevator has reached the floor
        socket.emit("status", ELEVATORS);
    });
});

server.listen(3000, () => {
    logger.info('Elevator server is running on http://localhost:3000');
});
