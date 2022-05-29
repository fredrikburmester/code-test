import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";
import { Elevator, Direction, ElevatorProps } from "./elevator";

const app = new Koa();
const router = new Router();
const NR_OF_FLOORS = 20;

let e1 = new Elevator(1, 1);
let e2 = new Elevator(2, 1);
let e3 = new Elevator(3, 1);
let e4 = new Elevator(4, 1);
let e5 = new Elevator(5, 1);

let ELEVATORS = [e1, e2, e3, e4, e5];

export const findClosestElevator = (elevators: Elevator[], floor: number) => {
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

    console.log(sortedElevators);

    // Pick first not idle elevator
    for(let i = 0; i < sortedElevators.length; i++) {
        const e = sortedElevators[i];
        if(e.direction !== Direction.IDLE) {
            closest = e;
            break;
        }
    }

    if (closest.direction === Direction.IDLE) {
        return sortedElevators[0];
    }

    return closest;
}

// Get the status of all elevators
router.get("/elevators/status", (context) => {
    context.response.body = ELEVATORS;
    context.response.status = 200;
});

// Get the closest elevator to a floor and reserve it to be moved
router.post("/elevators/reserve", (context) => {

    const floor = parseInt(context.request.body.floor);
    console.log(context.request.body.floor)

    if(floor < 1 || floor > NR_OF_FLOORS) {
        context.response.body = "Floor out of range";
        context.response.status = 404;
        return
    }
    
    const closestElevator = findClosestElevator(ELEVATORS, floor);

    closestElevator.destination = parseInt(context.params.floor);
    closestElevator.destination = floor;
    if (closestElevator.floor < floor) {
        closestElevator.direction = Direction.UP;
    } else if (closestElevator.floor > floor) {
        closestElevator.direction = Direction.DOWN;
    } else {
        closestElevator.direction = Direction.IDLE;
    }

    context.response.body = closestElevator;
    context.response.status = 202;
})

// Get the elevator with the closest floor to the requested floor
router.post("/elevators/call", async (context) => {
    let floor = parseInt(context.request.body.floor);
    let closest = findClosestElevator(ELEVATORS, floor);

    await closest.move(floor);

    context.response.body = closest;  
    context.response.status = 200;
});

app.use(bodyparser({
    enableTypes: ["json"],
}));
app.use(cors());
app.use(router.routes());
app.listen(3000);
