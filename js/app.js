/*----- DOM References -----*/
let gameBoard = document.getElementById("gameBoard");
let gameMessage = document.getElementById("gameMessage");
let resetButton = document.getElementById("reset");
let xScore = document.getElementById("xScore");
let oScore = document.getElementById("oScore");
let onePlayer = document.getElementById("player1");
let twoPlayer = document.getElementById("player2");

/*----- Game Logic Variables -----*/
let playerTurn = 0;
let gameOver = false;
twoPlayer.disabled = true;

let xPlayer = {
    selects: [],
    wins: 0
}

let oPlayer = {
    selects: [],
    wins: 0,
    human: true
}

const winStates = [
    ["0", "1", "2"],
    ["3", "4", "5"],
    ["6", "7", "8"],
    ["0", "3", "6"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["0", "4", "8"],
    ["2", "4", "6"]
]

let cellStates = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
}

/*----- Event Listeners & Functions -----*/
gameBoard.addEventListener("click", cellClick);
resetButton.addEventListener("click", resetGame);
onePlayer.addEventListener("click", comPlayer);
twoPlayer.addEventListener("click", humPlayer);

function comPlayer() {
    oPlayer.human = false;
    onePlayer.disabled = true;
    twoPlayer.disabled = false;
    xScore.innerText = "";
    oScore.innerText = "";
    xPlayer.wins = 0;
    oPlayer.wins = 0;
    resetGame();
}

function humPlayer() {
    oPlayer.human = true;
    onePlayer.disabled = false;
    twoPlayer.disabled = true;
    xScore.innerText = "";
    oScore.innerText = "";
    xPlayer.wins = 0;
    oPlayer.wins = 0;
    resetGame();
}

function cellClick(e) {
    let choice = e.target.id;
    if (!cellStates[choice]) {
        if (!playerTurn && oPlayer.human) {
            cellStates[choice] = true;
            xPlayer.selects.push(choice);
            e.target.classList.add("xSelect");
            evaluateCombinations();
        } else if (!playerTurn && !oPlayer.human) {
            cellStates[choice] = true;
            xPlayer.selects.push(choice);
            e.target.classList.add("xSelect");
            evaluateCombinations();
            computerChoice();
        } else if (playerTurn && oPlayer.human) {
            cellStates[choice] = true;
            oPlayer.selects.push(choice);
            e.target.classList.add("oSelect");
            evaluateCombinations();
        } else if (playerTurn && !oPlayer.human) {
            evaluateCombinations();
            computerChoice();
        }
    } 
}

function computerChoice() {
    let computerChooses = randomChoice(9);
    if (!cellStates[computerChooses] && !gameOver) {
        cellStates[computerChooses] = true;
        oPlayer.selects.push(computerChooses);
        let compChoice = document.getElementById(computerChooses);
        compChoice.classList.add("oSelect");
        evaluateCombinations();
    } else if (cellStates[computerChooses] && !gameOver) {
        computerChoice();
    }
}

function randomChoice(num) {
    return Math.floor(Math.random() * Math.floor(num)).toString();
}

function evaluateCombinations() {
    if (!playerTurn) {
        for (let i = 0; i < winStates.length; i++) {
            let winningCombo = winStates[i];
            let match = 0;
            for (let j = 0; j < winningCombo.length; j++) {
                if (xPlayer.selects.includes(winningCombo[j])) {
                    match++;
                }
                if (match === 3) {
                    gameOver = true;
                    gameMessage.innerText = "player X winz!"
                    gameBoard.removeEventListener("click", cellClick);
                    xPlayer.wins++;
                    xScore.innerText = xPlayer.wins;
                }
            }
        }
    } else {
        for (let i = 0; i < winStates.length; i++) {
            let winningCombo = winStates[i];
            let match = 0;
            for (let j = 0; j < winningCombo.length; j++) {
                if (oPlayer.selects.includes(winningCombo[j])) {
                    match++;
                }
                if (match === 3) {
                    gameOver = true;
                    gameMessage.innerText = "player O winz!"
                    gameBoard.removeEventListener("click", cellClick);
                    oPlayer.wins++;
                    oScore.innerText = oPlayer.wins;
                }
            }
        }
    }
    if (Object.values(cellStates).filter(cell => cell).length > 8) {
        gameDraw();
    }
    else {
        changeTurn();
    }
}

function changeTurn() {
    if (!gameOver) {
        if (!playerTurn) {
            playerTurn++;
            gameMessage.innerText = "oh my! it's O's turn."
        } else if (playerTurn) {
            playerTurn--;
            gameMessage.innerText = "x gonna give it to ya."
        }
    }
}

function gameDraw() {
    gameOver = true;
    gameMessage.innerText = "tis a draw!";
    for (let state in cellStates) {
        cellStates[state] = true;
    }
}

function resetGame() { 
    gameOver = false;
    xPlayer.selects = [];
    oPlayer.selects = [];
    gameMessage.innerText = "";
    for (let i = 0; i < gameBoard.children.length; i++) {
        gameBoard.children[i].className = "gameCell";
    }
    for (let state in cellStates) {
        cellStates[state] = false;
    }
    playerTurn = 0;
    gameBoard.addEventListener("click", cellClick);
}