import { useState } from 'react'; 

interface StopwatchProps {
    initialSeconds: number;
}

interface LapValueProps {
    id: number;
    value: number;
}
interface LapProps {
    index: number;
    lap: LapValueProps;
    onDelete: () => void;
}

const createRandomId = () => {
    return Math.floor(Math.random() * 10000000) + 1;
}

const formattedSeconds = (sec: number) => {
    const minutes = `${Math.floor(sec / 60)}`;
    const seconds = `0${sec % 60}`.slice(-2);

    return `${minutes}:${seconds}`;
};

const Lap = ({ index, lap, onDelete }: LapProps) => {
    return ( 
        <div className="stopwatch-lap">
            <strong>{index}</strong> / {formattedSeconds(lap.value)} 
            <button onClick={ onDelete } > X </button>
        </div>
   );
}  


function StopwatchUpdated({ initialSeconds }: StopwatchProps){

    const [ laps, setLaps ] = useState<LapValueProps[]>([]);
    const [ incrementer, setIncrementer ] = useState<number>(0);
    const [ secondsElapsed, setSecondsElapsed ] = useState<number>(initialSeconds);
    const [ lastClearedIncrementer, setLastClearedIncrementer ] = useState<number>(0);

    const hasSecondsElapsed = secondsElapsed !== 0;
    const hasIncrementerStopped = incrementer === lastClearedIncrementer;

    const handleStartClick = () => {
        const elapsed = () => setSecondsElapsed(secondsElapsed => secondsElapsed + 1);
        setIncrementer(setInterval(elapsed, 1000));
    }

    const handleStopClick = () => {
        clearInterval(incrementer);
        setLastClearedIncrementer(incrementer)
    }

    const handleResetClick = () => {
        clearInterval(incrementer);
        setLaps([]);
        setSecondsElapsed(0);
    }

    const handleLapClick = () => {
        setLaps(laps => ([
            ...laps, 
            { 
                id: createRandomId(),
                value: secondsElapsed
            }
        ]));
    }

    const handleDeleteClick = (index: number) => {
        setLaps(laps.filter((_, i) => i !== index));
    }

    return (
        <section className="stopwatch">
            <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)} </h1>

            {(!hasSecondsElapsed || hasIncrementerStopped)
                ? <button className="start-btn" onClick={handleStartClick}>start</button>
                : <button className="stop-btn" onClick={handleStopClick}>stop</button>
            }

            {(hasSecondsElapsed && !hasIncrementerStopped) &&
                <button onClick={handleLapClick}>lap</button>
            }

            {(hasSecondsElapsed && hasIncrementerStopped) && 
                <button onClick={handleResetClick}>reset</button>
            }

            <ul className="stopwatch-laps">
                { laps && laps.map((lap, index) =>
                    <li key={lap.id}>
                        <Lap 
                            index={index+1} 
                            lap={lap} 
                            onDelete={() => handleDeleteClick(index)} />
                    </li>
                )}
            </ul>
        </section>
    )
}

export default StopwatchUpdated;
