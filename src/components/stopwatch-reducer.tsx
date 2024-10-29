import { useReducer, useState } from 'react'; 

interface StopwatchProps {
    initialSeconds: number;
}

interface StopWatchInitialValues {
    laps: number[], 
    incrementer: number,
    secondsElapsed: number,
    lastClearedIncrementer: number 
}

interface LapProps {
    index: number;
    lap: number;
    onDelete: () => void;
}

const formattedSeconds = (sec: number) => {
    const minutes = `${Math.floor(sec / 60)}`;
    const seconds = `0${sec % 60}`.slice(-2);

    return `${minutes}:${seconds}`;
};


const Lap = (props: LapProps) => {
    const {index, lap, onDelete } = props;

    return ( 
        <div className="stopwatch-lap">
            <strong>{index}</strong> / {formattedSeconds(lap)} 
            <button onClick={ onDelete } > X </button>
        </div>
   );
}  

enum Actions {
    DELETE = 'delete',
    RESET = 'reset',
    LAPS = 'laps', 
    START = 'start', 
    STOP = ' stop'
}


// 
const reducer = (state: StopWatchInitialValues, action: any) => {

    switch (action.type) {


        case Actions.DELETE:
            return {
                ...state, 
                laps: state.laps.filter((_: number, i:number) => i !== action.payload)
            }

            
        case Actions.LAPS:

            return {
                ...state, 
                laps: ([...state.laps, state.secondsElapsed])
            }

        case Actions.START:      
        
            console.log('start:');

            // const stc = ( prev ) => {

            //     console.log('STATE: ', state);

            //     return prev.secondsElapsed + 1 
            
            // };

            // const elapsed = () => {
            //     console.log('elapsed: ', stc);
            //     return state.secondsElapsed + 1
            // };

            const inter = setInterval(() => {
                console.log('int: ', state.secondsElapsed);
                
                return state.secondsElapsed++ }
            , 1000);
            
            console.log('inter: ', inter);

            return {
                ...state, 
                secondsElapsed: state.secondsElapsed++,
                incrementer: setInterval(() => inter , 1000)
                // secondsElapsed: state.secondsElapsed + 1,
                // incrementer: setInterval(elapsed, 1000)
                // incrementer: inter
            }

        case Actions.STOP: 

            console.log('Stop: ', state.incrementer);

            clearInterval(state.incrementer);

            return {
                ...state,
                lastClearedIncrementer: state.incrementer
            }


        case Actions.RESET: 
            clearInterval(state.incrementer);

            return {
                ...state, 
                laps: [], 
                secondsElapsed: 0
            }

        default:
            return state;
    }
}

const StopwatchUpdated = (props: StopwatchProps) => {

    const { initialSeconds } =  props;

    const initialValues = {
        laps: [], 
        incrementer: 0,
        secondsElapsed: initialSeconds,
        lastClearedIncrementer: 0
    }

    const [ laps, setLaps ] = useState<number[]>([]);
    const [ incrementer, setIncrementer ] = useState<number>(0);
    const [ secondsElapsed, setSecondsElapsed ] = useState<number>(initialSeconds);
    const [ lastClearedIncrementer, setLastClearedIncrementer ] = useState<number>(0);


    // const [{
    //     incrementer,
    //     laps, 
    //     lastClearedIncrementer,
    //     secondsElapsed
    // }, dispatch] = useReducer(reducer, initialValues);


    const handleStartClick = () => {
        const elapsed = () => setSecondsElapsed(secondsElapsed => secondsElapsed + 1);
        setIncrementer(setInterval(elapsed, 1000));
        // console.log('handleStartClick: ', incrementer);
        // dispatch({ type: Actions.START });
    }

    const handleStopClick = () => {
        // console.log('handleStopClick: ', incrementer);
        clearInterval(incrementer);
        setLastClearedIncrementer(incrementer)

        // dispatch({ type: Actions.STOP });
    }
    

    const handleResetClick = () => {
        clearInterval(incrementer);
        setLaps([]);
        setSecondsElapsed(0);

        // dispatch({ type: Actions.RESET });
    }

    const handleLapClick = () => {
        setLaps(laps => ([...laps, secondsElapsed]));

        // dispatch({ type: Actions.LAPS });
    }

    const handleDeleteClick = (index: number) => {
        setLaps(laps.filter((_, i) => i !== index));

        // dispatch({ type: Actions.DELETE, payload: index });
    }

    const isIncrementLastCleared = incrementer === lastClearedIncrementer;


    return (

        <section className="stopwatch">
            <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)} </h1>

            {(secondsElapsed === 0 || isIncrementLastCleared)
                ? <button className="start-btn" onClick={handleStartClick}>start</button>
                : <button className="stop-btn" onClick={handleStopClick}>stop</button>
            }

            {(secondsElapsed !== 0 && isIncrementLastCleared) &&
                <button onClick={handleLapClick}>lap</button>
            }

            {(secondsElapsed !== 0 && isIncrementLastCleared) && 
                <button onClick={handleResetClick}>reset</button>
            }

            <div className="stopwatch-laps">
                { laps && laps.map((lap, index) =>
                    <Lap index={index+1} lap={lap} onDelete={() => handleDeleteClick(index)} />) 
                }
            </div>
        </section>
    )
}

export default StopwatchUpdated;
