import * as React from "react";
import { useEffect,useState } from "react";
import socketIOClient from "socket.io-client";
import * as css from "./ImplementationPage.module.scss";
import axios from "axios";

const ENDPOINT = "http://localhost:3000";

interface Elevator {
    id: number,
    floor: number,
    direction: string,
    destination: number,
    queue: number[],
}

const API_URL = 'http://localhost:3000/elevators'

const ImplementationPage = () => {
    const defaultElevators: Elevator[] = [];

    const [requestedFloor, setRequestedFloor] = useState(null);
    const [elevators, setElevators] = useState(defaultElevators);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = useState("");

    const [socket, setSocket] = useState(null);

    const callElevator = async (floor: number) => {
        setRequestedFloor(floor);
        socket.emit("call", floor);
    };

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        setSocket(socket);

        socket.on("status", (data: Elevator[]) => {
            console.log(data)
            setElevators(data);
            setLoading(false);
        });

        socket.on("elevator", (data: Elevator) => {
            console.log(data)
        });
    }, [setSocket]);

    return (
        <>
            <h1>Elevators</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error &&
                <>
                    <table className={css.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Floor</th>
                                <th>Direction</th>
                                <th>Destination</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elevators.map(elevator =>
                                <tr key={elevator.id}>
                                    <td>{elevator.id}</td>
                                    <td>{elevator.floor}</td>
                                    <td>{elevator.direction}</td>
                                    <td>{elevator.destination}</td>
                                    {elevator.queue.length > 0 && <td>{elevator.queue.join(", ")}</td>}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className={css.elevatorDisplays}>
                        {elevators.map(elevator =>
                            <div key={elevator.id} className={css.elevatorDisplay}>
                                {elevator.direction !== 'idle' && <p>{elevator.direction == 'up' ? '^' : 'v'}</p>}
                                {elevator.direction === 'idle' && <p style={elevator.floor == requestedFloor ? {color: 'green'} : {}}>{elevator.floor}</p>}
                            </div>
                        )}
                    </div>
                </>
            }
            <h1 className={css.title}>Call elevator to floor</h1>
            <div className={css.elevatorButtons}>
                {Array.apply(null, Array(20)).map((_: any, floor: any) =>
                    <button style={floor + 1 === requestedFloor ? {border: '4px solid green'} : {}} key={floor + 1} onClick={() => callElevator(floor + 1)}>{floor + 1}</button>
                    )}
            </div>
            
        </>
    );
}

export default ImplementationPage

