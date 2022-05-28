import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";
import { Elevator } from "./elevator";

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
    elevators.forEach((e) => {
            if (Math.abs(e.floor - floor) < Math.abs(closest.floor - floor)) {
            closest = e;
            }
        }
    );

    return closest;
}

// Get the status of all elevators
router.get("/elevators/status", (context) => {
    context.response.body = ELEVATORS;
    context.response.status = 200;
});

// Get the closest elevator to a floor and reserve it to be moved
router.get("/elevators/reserve/:floor", (context) => {
    const floor = parseInt(context.params.floor);

    if(floor < 1 || floor > NR_OF_FLOORS) {
        context.response.body = "Floor out of range";
        context.response.status = 404;
        return
    }
    
    const closestElevator = findClosestElevator(ELEVATORS, floor);
    closestElevator.destination = parseInt(context.params.floor);
    closestElevator.destination = floor;
    if (closestElevator.floor < floor) {
        closestElevator.direction = "up";
    } else if (closestElevator.floor > floor) {
        closestElevator.direction = "down";
    } else {
        closestElevator.direction = "idle";
    }

    context.response.body = closestElevator;
    context.response.status = 200;
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
