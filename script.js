const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const questionArea = document.getElementById('question-area');
const questionText = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const submitAnswerBtn = document.getElementById('submit-answer');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let currentQuestionIndex = 0;
let selectedCell = null; // Track selected cell for marking

// Questions with options and answers
const questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Rome", "Berlin"],
        answer: "Paris"
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Jupiter"
    },
    {
        question: "What is the boiling point of water?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        answer: "100°C"
    }
];

// Initialize the game
function initializeGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    currentQuestionIndex = 0;
    statusText.innerText = `${currentPlayer}'s turn to answer a question`;
    cells.forEach(cell => {
        cell.innerText = '';
        cell.removeEventListener('click', handleCellClick); // Remove previous click events
        cell.style.cursor = 'default'; // Reset cursor
    });
    questionArea.style.display = 'none';
    submitAnswerBtn.style.display = 'none';
    optionsContainer.innerHTML = '';

    // Start the game by asking the first question
    askQuestion();
}

// Ask a question
function askQuestion() {
    questionArea.style.display = 'block';
    submitAnswerBtn.style.display = 'block';
    questionText.innerText = questions[currentQuestionIndex].question;
    optionsContainer.innerHTML = '';

    questions[currentQuestionIndex].options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.className = 'option-button';
        button.onclick = () => selectOption(option);
        optionsContainer.appendChild(button);
    });
}

// Select an option
function selectOption(option) {
    submitAnswerBtn.onclick = () => checkAnswer(option);
}

// Check the answer
function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedOption === correctAnswer) {
        statusText.innerText = `${currentPlayer}, select a cell to place your symbol.`;
        questionArea.style.display = 'none';
        submitAnswerBtn.style.display = 'none';

        // Allow players to select a cell
        cells.forEach((cell, index) => {
            cell.style.cursor = 'pointer'; // Indicate that cell is clickable
            cell.onclick = () => handleCellClick(cell, index);
        });
    } else {
        statusText.innerText = `${currentPlayer}'s answer is wrong. It's the other player's turn.`;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        askQuestion();
    }
}

// Handle cell click
function handleCellClick(cell, index) {
    if (cell.innerText === '' && isGameActive) {
        // Place the symbol on the cell
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;

        if (checkWinner()) {
            statusText.innerText = `${currentPlayer} wins!`;
            isGameActive = false;
        } else if (!board.includes('')) {
            statusText.innerText = 'Draw!';
            isGameActive = false;
        } else {
            // Switch players and ask the next question
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
            statusText.innerText = `${currentPlayer}'s turn to answer a question`;
            askQuestion();
        }
    }
}

// Check for a winner
function checkWinner() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Restart the game
restartBtn.addEventListener('click', initializeGame);
initializeGame();
