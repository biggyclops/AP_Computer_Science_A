let questions = [];

fetch('questions.json')

    .then(response => response.json())
    .then(data => {
        questions = data;
        startQuiz(); // Proceed to start the quiz after loading the questions
    })
    .catch(error => console.error('Error loading questions:', error));

let currentQuestionIndex = 0;
let score = 0;
let incorrectQuestions = [];
let startTime;
let timerInterval;

const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result");
const restartButton = document.getElementById("restart");

const timerDisplay = document.createElement("div");
timerDisplay.style.textAlign = "center";
timerDisplay.style.marginBottom = "20px";
timerDisplay.style.fontSize = "1.2em";
document.querySelector(".container").insertBefore(timerDisplay, quizContainer);

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayQuestion(index) {
    const question = questions[index];
    const shuffledOptions = shuffle([...question.options]);

    quizContainer.innerHTML = `
        <div class="question">
            <p>${question.question.replace(/\n/g, "<br>")}</p>
        </div>
        <div class="options">
            ${shuffledOptions
                .map(
                    (option, i) =>
                        `<button onclick="checkAnswer('${option}', ${index})">${i + 1}. ${option}</button>`
                )
                .join("")}
        </div>
    `;
}

function checkAnswer(selected, index) {
    const question = questions[index];
    const isCorrect = selected === question.correctAnswer;

    quizContainer.innerHTML = `
        <div class="question">
            <p>${question.question.replace(/\n/g, "<br>")}</p>
        </div>
        <div class="explanation">
            ${isCorrect ? "Correct!" : "Incorrect!"} ${question.explanation}
        </div>
    `;

    if (isCorrect) {
        score++;
        incorrectQuestions = incorrectQuestions.filter(q => q !== question);
    } else {
        if (!incorrectQuestions.includes(question)) {
            incorrectQuestions.push(question);
        }
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
        } else if (incorrectQuestions.length > 0) {
            questions = [...incorrectQuestions];
            currentQuestionIndex = 0;
            incorrectQuestions = [];
            displayQuestion(currentQuestionIndex);
        } else {
            displayResult();
        }
    }, 3000);
}

function displayResult() {
    quizContainer.style.display = "none";
    stopTimer();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    resultContainer.innerHTML = `You scored ${score} out of ${questions.length}!<br>Time taken: ${elapsed}s`;
    restartButton.style.display = "block";
}

restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    questions = shuffle(questions);
    incorrectQuestions = [];
    quizContainer.style.display = "block";
    restartButton.style.display = "none";
    resultContainer.innerHTML = "";
    startTimer();
    displayQuestion(currentQuestionIndex);
});

function startQuiz() {
    startTimer();
    questions = shuffle(questions);
    displayQuestion(currentQuestionIndex);
}
