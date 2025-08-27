const numCardsInput = document.getElementById('numCards');
const startButton = document.getElementById('startButton');
const gameBoard = document.getElementById('game-board');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restartButton');

// These variables will keep track of the current state of our game.
let firstCard = null; // Stores the first card the player flips.
let secondCard = null; // Stores the second card the player flips.
let lockBoard = false; // Prevent the player from flipping more cards.
let pairsMatched = 0; // Counts how many pairs the player has found.
let totalPairs = 0; // The total number of pairs in the current game.

// ======================================================================================

// Functions
// This is the main function that starts or restarts the game.
function startGame() {
    const numCards = parseInt(numCardsInput.value);

    // Validate the User's Input 
    // Check if the number of cards is valid (even, and between 4-100).
    if (isNaN(numCards) || numCards % 2 !== 0 || numCards < 4 || numCards > 100) {
        alert("Please enter a valid, even number of cards between 4 and 100.");
        return; // Stop the function if the input is wrong.
    }

    // Reset the Game State
    pairsMatched = 0;
    totalPairs = numCards / 2;
    gameOverMessage.classList.add('hidden');

    // The Game Board
    createCards(numCards); // Function to create and shuffle the cards.
}

// This function creates all the card elements and puts them on the board.
function createCards(numCards) {
    const cardValues = createCardValues(numCards);
    gameBoard.innerHTML = '';

    // Set's the number of columns for our grid layout.
    gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(numCards)}, 1fr)`;

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value; // Store the card's value for later comparison.
        card.innerHTML = `<div class="card-front">${value}</div>
            <div class="card-back"></div>`;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// This function handles what happens when a card is clicked.
function flipCard() {
    // If the board is "locked" or the same card is clicked twice, do nothing.
    if (lockBoard || this === firstCard || this.classList.contains('matched')) {
        return;
    }

    // Flip the card by adding the 'flip' CSS class.
    this.classList.add('flip');

    if (!firstCard) {
        // This is the first card of the pair.
        firstCard = this;
    } else {
        // This is the second card of the pair.
        secondCard = this;
        lockBoard = true; // Locks the board so no other cards can be clicked.
        checkForMatch();
    }
}

// This function compares the two flipped cards to see if they match.
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        // If they match, keep them face up.
        disableCards();
    } else {
        // If they don't match, flip them back over after a delay.
        unflipCards();
    }
}

// This function runs when the player finds a matching pair.
function disableCards() {
    // Removes the click listener so the cards can't be flipped again.
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Added the 'matched' class to change their appearance.
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    // Reset our game state variables.
    resetBoard();
    
    pairsMatched++;
    if (pairsMatched === totalPairs) {
        endGame();
    }
}

// This function runs when the cards don't match.
function unflipCards() {
    // Wait for 1 second so the player can see the cards.
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

// This function shows the "Congratulations!" message when the player won.
function endGame() {
    gameOverMessage.classList.remove('hidden');
}

// ====================================================================================
// Utility Functions
// Function to reset the variables after each turn.
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Function to create and shuffle the numeric values for the cards.
function createCardValues(numCards) {
    const values = [];
    for (let i = 1; i <= numCards / 2; i++) {
        values.push(i);
    }
    const allValues = [...values, ...values];
    return shuffle(allValues);
}

// A helper function to shuffle an array using the Fisher-Yates algorithm.
function shuffle(array) {
    // We loop backwards through the array to ensure a fair shuffle.
    for (let i = array.length - 1; i > 0; i--) {
        // We pick a random index from the unshuffled part of the array.
        const j = Math.floor(Math.random() * (i + 1));
        
        // This is the modern way to swap two values in one line!
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// =======================================================================================
// Event Handlers
// Listen for clicks on the Start and Restart buttons to begin the game.
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Start a new game when the page first loads.
startGame();