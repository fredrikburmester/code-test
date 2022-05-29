const logger = require("./utils/logger");

export interface ElevatorProps {
    id: number;
    floor: number;
    direction: Direction;
    destination: number;
}

export enum Direction {
    UP = "up",
    DOWN = "down",
    IDLE = "idle"
}

export class Elevator {
    /**
     * Creates an instance of Elevator.
     *
     * @param {number} id - The id of the elevator
     * @param {number} floor - The current floor of the elevator
     * @param {string} direction - The direction of the elevator (up, down)
     * @param {number} destination - The destination floor of the elevator
     * @param {number[]} queue - The queue of floors to go to
     */
    id: number
    floor: number
    direction: Direction
    destination: number
    queue: number[]

    constructor(id: number, floor: number) {
        this.id = id;
        this.floor = floor;
        this.direction = Direction.IDLE;
        this.destination = null;
        this.queue = [];
    }

    async move(socket, ELEVATORS): Promise<number> {
        /**
         * Moves the elevator to the given floor
         *
         * @return {Promise<number>} - The floor the elevator is on
         */

        // Wait until the elevator is idle before moving on to the next floor in the queue
        while(this.direction !== Direction.IDLE) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const floor = this.queue.shift();

        if (floor === undefined) {
            return Promise.resolve(this.floor);
        }

        if(floor === this.floor) {
            this.destination = floor;
            return Promise.resolve(floor);
        }
        const floorDelta = Math.abs(floor - this.floor);
        this.destination = floor;
        this.direction = floor > this.floor ? Direction.UP : Direction.DOWN;

        // Move the elevator to the floor one floor at a time
        return new Promise(async (resolve, reject) => {            
            for (let i = 1; i <= floorDelta; i++) {
                await this.moveOneFloor(this.direction)

                // Send the elevator's current floor to the client
                try {
                    socket.emit("status", ELEVATORS);
                }   catch (e) {
                    logger.error(e);
                }
            }

            this.direction = Direction.IDLE;
            this.destination = floor;
            resolve(this.floor);
        });
    }

    moveOneFloor(direction: Direction): Promise<number> {
        /**
         * Moves the elevator one floor in the given direction
         *
         * @return {Promise<number>} - The floor the elevator is on
         */
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (direction === Direction.UP) {
                    this.floor++;
                } else {
                    this.floor--;
                }

                resolve(this.floor);
            }, 2000);
        });
    }
}