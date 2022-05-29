import * as React from "react";
import { useEffect,useState } from "react";

import * as css from "./ImplementationPage.module.scss";
import axios from "axios";

interface Elevator {
    id: number,
    floor: number,
    direction: string,
    destination: number,
}

const API_URL = 'http://localhost:3000/elevators'

const ImplementationPage = () => {
    const defaultElevators: Elevator[] = [];

    const [requestedFloor, setRequestedFloor] = useState(null);
    const [elevators, setElevators] = useState(defaultElevators);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = useState("");

    const callElevator = async (floor: number) => {
        // Reseve the closest elevator
        const res = await axios.post<Elevator>(`${API_URL}/reserve`, { floor })

        if(res.status !== 202) {
            setError("Something went wrong")
            return;
        }

        const new_elevator = res.data as Elevator;
        const elevator = elevators.find(e => e.id === new_elevator.id);

        if (!elevator) {
            setError("Something went wrong");
            return 
        }
        
        // Indicate the elevator is moving
        setRequestedFloor(floor);
        
        elevator.floor = new_elevator.floor;
        elevator.direction = new_elevator.direction;
        elevator.destination = new_elevator.destination;
        
        setElevators([...elevators]);

        // Make a new request for the elevator to be moved to the floor
        axios.post<Elevator>(`${API_URL}/call`, { floor: floor })
            .then((res) => {
                console.log("callElevator 2",res.data)
                
                // find and update the elevator
                const elevator = elevators.find(e => e.id === res.data.id);
                if (!elevator) return 

                elevator.floor = res.data.floor;
                elevator.direction = res.data.direction;
                elevator.destination = res.data.destination;
                setElevators([...elevators]);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    useEffect(() => {
        axios
            .get<Elevator[]>(`${API_URL}/status`)
            .then(response => {
                setElevators(response.data);
                setLoading(false);
            })
            .catch(ex => {
                console.log(ex)
                let error = ex
                if(ex?.response && ex?.response?.data) {
                error =
                    ex.response.status === 404
                    ? "Resource Not found"
                    : "An unexpected error has occurred";
                }
                setError(error);
                setLoading(false);
            });
        }, []);

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

