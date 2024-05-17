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

        socket.on('show_answer', (data) => {
            console.log(data)
            setAnswer(data)
        })

        return () => {
            socket.off('start')
            socket.off('answer')
            socket.off('show_answer')
            socket.disconnect()
        }
    }, [])

    return (
        <>
            <div className='grid grid-cols-5 px-4'>
                <div></div>
                <h2 className='text-2xl font-bold text-center col-span-3 justify-self-center'>Câu hỏi thứ {question}:</h2>
                <div className='justify-self-end'>
                    <Timer time={time} setTime={setTime} />
                </div>
            </div>
            <Slide question={question} />
            <div className='flex items-center justify-center'>
                {answer && <h2 className='text-2xl font-bold text-center'>Đáp án: {answer}</h2>}
            </div>
            <div className='grid grid-cols-2'>
                {
                    participants.map((participant, index) => (
                        <div key={index} className='border p-2'>
                            <p className='font-bold'>{participant.name}</p>
                            <p>Trả lời: {participant.answer}</p>
                            <p>Thời gian: {participant.time}</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}