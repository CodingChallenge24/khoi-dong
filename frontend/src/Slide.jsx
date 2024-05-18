import { useEffect, useState } from 'react'

import bg from './assets/bg.png'
import data from './questions.json'

export function Slide({ question }) {
    const [images, setImages] = useState(data[question]?.images || [])
    const [currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        if (images.length == 0) return
        const interval = setInterval(() => {
            if (currentImage === images.length - 1) {
                clearInterval(interval)
                return
            }
            setCurrentImage((currentImage + 1) % images.length)
        }, currentImage === 0 ? 3000 : 90000 / (images.length - 1))

        return () => clearInterval(interval)
    }, [images, currentImage])

    useEffect(() => {
        setImages(data[question]?.images || [])
        setCurrentImage(0)
    }, [question])

    return (
        <>
            <img className='mx-auto w-[65%] mb-2' src={question !== '' ? `/src/assets/questions/${question}/${images[currentImage]}` : bg} />
        </>
    )
}