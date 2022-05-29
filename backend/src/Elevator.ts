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
    direction: string
    destination: number
    queue: number[]

    constructor(id: number, floor: number) {
        this.id = id;
        this.floor = floor;
        this.direction = "idle";
        this.destination = null;
        this.queue = [];
    }
    
    move(floor: number): Promise<number> {
        /**
         * Moves the elevator to the given floor
         *
         * @return {Promise<number>} - The floor the elevator is on
         */
        if(floor === this.floor) {
            return Promise.resolve(floor);
        }

        const floorDelta = Math.abs(floor - this.floor);

        return new Promise((resolve, reject) => {            
            setTimeout(() => {
                this.floor = floor;
                this.direction = "idle";
                this.destination = floor;
                resolve(this.floor);
            }, 2000 * floorDelta);
        });
    }
}