export interface ElevatorProps {
    id: number;
    floor: number;
    direction: string;
    destination: number;
}

export class Elevator {
    /**
     * Creates an instance of Elevator.
     *
     * @param {number} id - The id of the elevator
     * @param {number} floor - The current floor of the elevator
     * @param {string} direction - The direction of the elevator (up, down)
     * @param {number} destination - The destination floor of the elevator
     */
    id: number
    floor: number
    direction: string
    destination: number

    constructor(id: number, floor: number) {
        this.id = id;
        this.floor = floor;
        this.direction = "idle";
        this.destination = null;
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