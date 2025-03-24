const questions = [
    {
        question: "What is 0 + 0?",
        choices: ["0", "1", "2", "3"],
        correct: 0
    },
    {
        question: "What is 1 + 0?",
        choices: ["0", "1", "2", "3"],
        correct: 1
    },
    {
        question: "What is 1 + 1?",
        choices: ["1", "2", "3", "4"],
        correct: 1
    },
    {
        question: "What is 2 + 0?",
        choices: ["0", "1", "2", "3"],
        correct: 2
    },
    {
        question: "What is 2 - 1?",
        choices: ["0", "1", "2", "3"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let canAnswer = true;
let timeLeft = 60;
let timerInterval;

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const scoreEl = document.getElementById('score-value');
const endScreen = document.getElementById('end-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const timerEl = document.getElementById('time');

function startQuiz() {
    startScreen.classList.add('hide');
    quizContainer.classList.remove('hide');
    startTimer();
    showQuestion();
}

function startTimer() {
    timeLeft = 30; // Reduced time for 5 questions
    timerEl.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerEl.parentElement.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function shuffleChoices() {
    const buttons = Array.from(choicesEl.getElementsByTagName('button'));
    const positions = buttons.map((_, index) => {
        return {
            top: `${index * 60}px`,
            zIndex: Math.floor(Math.random() * 10)
        };
    });

    // Shuffle positions randomly
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Apply new positions to buttons
    buttons.forEach((button, index) => {
        button.classList.add('shuffling');
        button.style.top = positions[index].top;
        button.style.zIndex = positions[index].zIndex;
    });
}

let shuffleInterval;

function showQuestion() {
    canAnswer = true;
    const question = questions[currentQuestion];
    questionEl.textContent = question.question;
    choicesEl.innerHTML = '';
    
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.addEventListener('click', () => checkAnswer(index));
        button.classList.add('shuffling');
        choicesEl.appendChild(button);
    });

    // Start shuffling choices every 0.2 seconds
    shuffleChoices();
    shuffleInterval = setInterval(shuffleChoices, 200);
}

function checkAnswer(choiceIndex) {
    if (!canAnswer) return;
    canAnswer = false;
    
    // Stop shuffling when answer is selected
    clearInterval(shuffleInterval);
    
    const buttons = choicesEl.getElementsByTagName('button');
    const correctIndex = questions[currentQuestion].correct;
    
    buttons[correctIndex].classList.add('correct');
    if (choiceIndex !== correctIndex) {
        buttons[choiceIndex].classList.add('incorrect');
        // Penalty for wrong answer
        timeLeft = Math.max(0, timeLeft - 10);
        timerEl.textContent = timeLeft;
    }
    
    if (choiceIndex === correctIndex) {
        score++;
        scoreEl.textContent = score;
    }
    
    // Wait before showing next question
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    clearInterval(shuffleInterval);
    quizContainer.classList.add('hide');
    endScreen.classList.remove('hide');
    finalScoreEl.textContent = `${score} out of ${questions.length} (Time remaining: ${timeLeft}s)`;
}

function restartQuiz() {
    clearInterval(timerInterval);
    clearInterval(shuffleInterval);
    timerEl.parentElement.classList.remove('warning');
    currentQuestion = 0;
    score = 0;
    scoreEl.textContent = score;
    endScreen.classList.add('hide');
    startScreen.classList.remove('hide');
}

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);
