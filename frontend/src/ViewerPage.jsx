import { useEffect, useState } from 'react'
import { Slide } from './Slide'
import { socket } from './socket'
import Timer from './Timer'

export default function ViewerPage() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [participants, setParticipants] = useState([])
    const [time, setTime] = useState(0)

    useEffect(() => {
        socket.connect()

        socket.on('start', (data) => {
            console.log(data)
            setQuestion(data.question)
            setParticipants(data.participants)
            setTime(90)
        })

        socket.on('show_answer', (data) => {
            console.log(data)
            setAnswer(data)
        })

        return () => {
            socket.off('start')
            socket.off('show_answer')
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        socket.on('answer', (data) => {
            console.log(data)
            participants.forEach((participant, index) => {
                if (participant.id === data.id) {
                    participants[index].answer = data.answer
                    participants[index].time = data.time
                }
            })
            setParticipants([...participants])
        })

        socket.on('score', (data) => {
            console.log(data)
            participants.forEach((participant) => {
                participant.score = data.scores[participant.id]
            })
            setParticipants([...participants])
        })

        return () => {
            socket.off('answer')
            socket.off('score')
        }
    }, [participants])

    return (
        <>
            <div className='grid grid-cols-5 px-4'>
                <div></div>
                <h2 className='text-2xl font-bold text-center col-span-3 justify-self-center'>Câu hỏi thứ {question}:</h2>
                <div className='justify-self-end'>
                    {time > 0 && <Timer time={time} setTime={setTime} />}
                </div>
            </div>
            <Slide question={question} />
            <div className='flex items-center justify-center'>
                {answer && <h2 className='text-2xl font-bold text-center'>Đáp án: {answer}</h2>}
            </div>
            <div className='grid grid-cols-2'>
                {
                    participants.map((participant, index) => (
                        <div className='flex justify-between items-center border p-2'>
                            <div key={index}>
                                <p className='font-bold'>{participant.name}</p>
                                <p>Trả lời: {participant.answer}</p>
                                <p>Thời gian: {participant.time}</p>
                            </div>
                            <p className='text-[#8CC63F] font-bold text-2xl'>{participant.score}</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}