import { useEffect, useState } from 'react'
import data from './questions.json'
import { Slide } from './Slide.jsx'
import { socket } from './socket.js'
import Timer from './Timer.jsx'

export function ParticipantPage() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [time, setTime] = useState(0)

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        socket.connect()

        socket.on('start', (data) => {
            console.log(data)
            setQuestion(data.question)
            setTime(90)
        })

        return () => {
            socket.off('start')
            socket.disconnect()
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(answer);
        socket.emit('answer', { id: user.id, answer })
        setAnswer('')
    }

    const handleChangeAnswer = (e) => {
        setAnswer(e.target.value)
    }

    return (
        <>
            <p className='text-center'>Thí sinh được quyền nộp đáp án nhiều lần trong thời gian cho phép. <br/>Hệ thống sẽ chỉ ghi nhận đáp án cuối cùng.</p>
            <Slide question={question} />
            <Timer time={time} setTime={setTime} />
            <form className='flex justify-center items-center gap-2' onSubmit={handleSubmit}>
                <input disabled={time === 0} value={answer} className='px-4 py-2' placeholder='Đáp án' onChange={handleChangeAnswer} />
                <button disabled={time === 0}>Nộp</button>
            </form>
        </>
    )
}