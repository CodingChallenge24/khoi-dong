import { useEffect, useState } from "react"
import { socket } from "./socket.js"
import data from './questions.json'

const participants = [
    {
        id: 1,
        name: 'Contestant 1',
    },
    {
        id: 2,
        name: 'Contestant 2',
    },
    {
        id: 3,
        name: 'Contestant 3',
    },
    {
        id: 4,
        name: 'Contestant 4',
    },
]

export default function ControllerPage() {
    const [question, setQuestion] = useState(0);
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // if (user.role !== 'controller') {
        //     window.location.href = '/';
        // }
        socket.connect();
        setScores([0, 0, 0, 0, 0]);

        return () => {
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        socket.emit('score', {scores});
    }, [scores])

    const handleStart = () => {
        alert(`Start round with question ${question}!`);
        socket.emit('start', {question, participants});
    }

    const handleChangeQuestion = (e) => {
        setQuestion(e.target.value);
    }

    const handleScoreChange = (e) => {
        e.preventDefault();
        const id = parseInt(e.target.name);
        const value = parseFloat(e.target[0].value);
        if (isNaN(value)) {
            alert('Please enter a valid number');
            return;
        }
        setScores(scores.map((score, index) => index === id ? score + value : score));
        
        e.target[0].value = '';
    }

    const showAnswer = (e) => {
        socket.emit('show_answer', data[question - 1].answer);
    }

    return (
        <div>
            <h1 className="text-center font-bold mb-4 text-3xl">Controller Page</h1>
            <div className="flex flex-col gap-2 w-[30%] mx-auto">
                <input onChange={handleChangeQuestion} type="number" placeholder="Question id" />
                <button onClick={handleStart}>Start</button>
            </div>
            <div>
                {
                    participants.map((participant) => {
                        return (
                            <div className="flex flex-col items-center" key={participant.id}>
                                <p>{`${participant.name}: ${scores[participant.id]} pts`}</p>
                                <form name={participant.id} className="flex gap-2 justify-center" onSubmit={handleScoreChange}>
                                    <input type="number" step="1" />
                                    <button type="submit" name={participant.id}>Add</button>
                                </form>
                            </div>
                        )
                    })
                }
            </div>
            <div className="mt-4 flex gap-2 justify-center">
                <button onClick={() => {
                    socket.emit('score', {scores});
                }}>Update score</button>
                <button onClick={showAnswer}>
                    Show answer
                </button>
            </div>
        </div>
    )
}