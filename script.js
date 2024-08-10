let welcomeScreen = document.querySelector(".welcome");
let quizScreen = document.querySelector(".quiz");
let resultScreen = document.querySelector(".result");
let startQuizBtn = document.querySelector(".start-quiz-btn");
let answerBtns = document.querySelectorAll(".answer");
let restartQuizBtn = document.querySelector(".restart-quiz-btn");
let quizQuestion = document.querySelector(".quiz__question")
let resultTitle = document.querySelector(".result__title")
let quizCounter = document.querySelector(".quiz__counter span")
let timerElement = document.querySelector(".timer") // отримали дув з класом таймер
let interval // створили змінну для нашого інтурвалу
let startTimerValue = 10 // встановили початкове значеня для таймеру

function startTimer() {    
 timerElement.innerHTML = startTimerValue 

 interval = setInterval(function() {  
 if (startTimerValue == 1) {   
 timerElement.innerHTML = 0   
 clearInterval(interval)   
 showQuestionResult("red") 
 showNextQuestion ()      
 } else {   
 startTimerValue--  
 timerElement.innerHTML = startTimerValue  
 }
 }, 1000) 
}

let allQuestion = [
    {
        question: "Скільки хромосом у людини?",
        answers: [60, 36, 47, 46, 59],
        correctAnswer: 46
    },
    {
        question: "Який найдовший орган у людини?",
        answers: ["Шкіра", "Кишечник","Спиний мозок" ,"Тонкий кишечник" ,"Товстий кишечник" ],
        correctAnswer: "Шкіра"
    },
     {
        question: "Скільки океанів є на нашій планеті?",
        answers: [2, 5, 3, 4,6],
        correctAnswer: 4
    },
    {
        question: "Скільки країн є на нашій планеті? ",
        answers: [195, 183, 216,154 , 96],
        correctAnswer: 195
    },
    {
        question: "В якій країні най більше населеня?",
        answers: ["Росія","Індія","Китай","Америка","Індонезія"],
        correctAnswer: "Індія"
    }
]
let userPoint = 0
let currQuestionNumber = 0

function renderQuestion(quest) {
    quizQuestion.innerHTML = quest.question
    answerBtns.forEach((btn, i) => btn.innerHTML = quest.answers[i])
    startTimer()
}

function showQuestionResult(color) {
    quizScreen.style.background = color

 setTimeout(() => {
        quizScreen.style.background = "#C0C0C0"
    }, 600)
}

function disabledButton(option) {
    answerBtns.forEach(btn => btn.disabled = option)
}

function deleteActiveScreen() {
  welcomeScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");
}

function runQuiz() {
  deleteActiveScreen();
  quizScreen.classList.add("active");
  currQuestionNumber = 0
    userPoint = 0
    renderQuestion(allQuestion[currQuestionNumber])
    quizCounter.innerHTML = currQuestionNumber + 1
}

function finishQuiz() {
  deleteActiveScreen();
  resultScreen.classList.add("active");
  resultTitle.innerHTML =  `Вітаю, ти закінчив опитування і отримав ${userPoint} з ${allQuestion.length}`
}

startQuizBtn.addEventListener("click", runQuiz);
restartQuizBtn.addEventListener("click", runQuiz);



            
answerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        clearInterval(interval)
    
         if (btn.innerHTML == allQuestion[currQuestionNumber].correctAnswer) {
            userPoint++
            showQuestionResult("lightgreen")
        } else {
            showQuestionResult("red")
        }
        showNextQuestion()
    } )
})
function showNextQuestion() {
    disabledButton(true)

    startTimerValue = 10
        setTimeout(() => {
            if (currQuestionNumber == allQuestion.length - 1) {
                finishQuiz()
            } else {
                currQuestionNumber++
                renderQuestion(allQuestion[currQuestionNumber])
                quizCounter.innerHTML = currQuestionNumber + 1
            }
            disabledButton(false)
        }, 800)
}
