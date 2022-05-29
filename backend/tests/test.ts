import { assert } from 'chai';
import { Elevator } from '../src/elevator';
import { findClosestElevator } from '../src/index';

describe('Elevator', async function () {
	describe('create elevator', function () {
		it('should have an id of 1', function () {
			const e1 = new Elevator(1, 1)
			assert (e1.id === 1)
		})
		it('should have moved to floor 2', async function () {
			const e1 = new Elevator(1, 1)
			e1.queue.push(2);
			await e1.move(null, [e1])
			assert (e1.floor === 2)
		})
		it('elevator on floor 1 should be closest to floor 2', async function () {
			const e1 = new Elevator(1, 1)
			const e2 = new Elevator(2, 4)
			const closest = findClosestElevator([e1, e2], 2)
			assert (closest === e1)
		})
		it('elevator on floor 2 should be closest to floor 2', async function () {
			const e1 = new Elevator(1, 1)
			const e2 = new Elevator(2, 2)
			const e3 = new Elevator(3, 4)
			const closest = findClosestElevator([e1, e2, e3], 2)
			assert (closest === e2)
		})
		it('elevator on floor 5 should be closest to floor 4', async function () {
			const e1 = new Elevator(1, 1)
			const e2 = new Elevator(2, 2)
			const e3 = new Elevator(3, 5)
			const closest = findClosestElevator([e1, e2, e3], 4)
			assert (closest === e3)
		})
		it('evelator on floor 1 should have moved to floor 2', async function () {
			const e1 = new Elevator(1, 1)
			const e2 = new Elevator(2, 5)
			const closest = findClosestElevator([e1, e2], 2)
			closest.queue.push(2);
			await closest.move(null, [e1, e2])
			assert (e1.floor === 2)
		})
		it('evelator on floor 5 should have moved to floor 4', async function () {
			const e1 = new Elevator(1, 1)
			const e2 = new Elevator(2, 5)
			const closest = findClosestElevator([e1, e2], 4)
			closest.queue.push(4);
			await closest.move(null, [e1, e2])
			assert (e2.floor === 4)
		})
	})
})
