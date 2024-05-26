import QuestionTimer from "./QuestionTimer.jsx";
import Answers from "./Answers.jsx";
import {useState} from "react";
import QUESTIONS from "../questions.js";

export default function Question({
                                     index,
                                     onSelect,
                                     onSkipAnswer
                                 }) {
    const [answer, setAnswer] = useState(
        {
            selectedAnswer: '',
            isCorrect: null
        }
    )
    let timer=10000
    if(answer.selectedAnswer){
        timer=1000
    }
    if (answer.isCorrect !== null) {
        timer = 2000
    }

    const handleSelect = (answer) => {
        setAnswer({
            selectedAnswer: answer,
            isCorrect: null
        })
        setTimeout(() => {
            setAnswer({
                selectedAnswer: answer,
                isCorrect: QUESTIONS[index].answers[0] === answer
            })
            setTimeout(() => {
                onSelect(answer)
            }, 2000)

        }, 1000)


    }
    let answerState = ''
    if (answer.selectedAnswer&& answer.isCorrect !== null) {
        answerState = answer.isCorrect ? 'correct' : 'wrong'
    }else if (answer.selectedAnswer) {
        answerState = 'answered'
    }
    return (
        <div id="question">
            <QuestionTimer
                key={timer}
                timeout={timer}
                OnTimeout={ answer.selectedAnswer===''? onSkipAnswer: null}
                mode={answerState}/>
            <h2>{QUESTIONS[index].text}</h2>
            <Answers
                answers={QUESTIONS[index].answers}
                answerState={answerState}
                selectedAnswer={answer.selectedAnswer}
                onSelect={handleSelect}
            >

            </Answers>
        </div>
    )
}
