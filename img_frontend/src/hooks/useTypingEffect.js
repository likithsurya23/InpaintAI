/**
 * useTypingEffect Hook
 * Creates a typewriter animation effect for text
 */

import { useState, useEffect } from 'react'

export const useTypingEffect = (
    words,
    typingSpeed = 150,
    deletingSpeed = 100,
    pauseDuration = 2000
) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        const currentWord = words[currentWordIndex]

        const handleTyping = () => {
            if (isPaused) {
                return
            }

            if (!isDeleting) {
                // Typing
                if (currentText.length < currentWord.length) {
                    setCurrentText(currentWord.substring(0, currentText.length + 1))
                } else {
                    // Finished typing, pause before deleting
                    setIsPaused(true)
                    setTimeout(() => {
                        setIsPaused(false)
                        setIsDeleting(true)
                    }, pauseDuration)
                }
            } else {
                // Deleting
                if (currentText.length > 0) {
                    setCurrentText(currentText.substring(0, currentText.length - 1))
                } else {
                    // Finished deleting, move to next word
                    setIsDeleting(false)
                    setCurrentWordIndex((prev) => (prev + 1) % words.length)
                }
            }
        }

        const speed = isDeleting ? deletingSpeed : typingSpeed
        const timer = setTimeout(handleTyping, speed)

        return () => clearTimeout(timer)
    }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

    return currentText
}

export default useTypingEffect
