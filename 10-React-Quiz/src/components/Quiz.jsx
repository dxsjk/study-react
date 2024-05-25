import {useCallback, useRef, useState} from 'react';
import QUESTIONS from '../questions.js';
import quizComplete from '../assets/quiz-complete.png'
import Question from "./Question.jsx";
export default function Quiz() {

    const [userAnswers, setUserAnswers] = useState([])
    const [answerState, setAnswerState] = useState('')

    const activeQuestionIndex = answerState === '' ? userAnswers.length : userAnswers.length - 1
    const quizIsOver = activeQuestionIndex === QUESTIONS.length
    const handleSelectAnswer = useCallback(function handleSelectAnswer(selectedAnswer) {
        setAnswerState('answered')
        setUserAnswers(prevState => [...prevState, selectedAnswer])
        setTimeout(() => {
            if (selectedAnswer === QUESTIONS[activeQuestionIndex].answers[0]) {
                setAnswerState('correct')
            } else {
                setAnswerState('wrong')
            }
            setTimeout(() => {
                setAnswerState('')
            }, 2000)
        }, 1000)
    }, [activeQuestionIndex])
    const handleSkipAnswer = useCallback(() => handleSelectAnswer(null), [handleSelectAnswer])
    if (quizIsOver) {
        return (
            <div id="summary">
                <img src={quizComplete} alt="quiz complete"/>
                <h2>Quiz complete!</h2>
            </div>
        )
    }

    return (
        <div id="quiz">
            <Question
                key={activeQuestionIndex}
                questionText={QUESTIONS[activeQuestionIndex].text}
                answers={QUESTIONS[activeQuestionIndex].answers}
                selectedAnswer={userAnswers[userAnswers.length - 1]}
                onSelect={handleSelectAnswer}
                onSkipAnswer={handleSkipAnswer}
                answerState={answerState}
            />

        </div>
    )
}
