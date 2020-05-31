/*----- DOM References -----*/
let gameBoard = document.getElementById("gameBoard");
let gameMessage = document.getElementById("gameMessage");
let resetButton = document.getElementById("reset");
let xScore = document.getElementById("xScore");
let oScore = document.getElementById("oScore");

/*----- Game Logic Variables -----*/
let playerTurn = 0;
let xPlayer = [];
let oPlayer = [];
let xWins = 0;
let oWins = 0;
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
    topL: false,
    topC: false,
    topR: false,
    midL: false,
    midC: false,
    midR: false,
    botL: false,
    botC: false,
    botR: false,
}

/*----- Event Listeners & Functions -----*/
gameBoard.addEventListener("click", cellClick);
resetButton.addEventListener("click", resetGame);

function cellClick(e) {
    let choice = e.target.id;
    if (!cellStates[choice]) {
        if (!playerTurn) {
            cellStates[choice] = true;
            xPlayer.push(choice);
            e.target.classList.add("xSelect");
            changeTurn();
            evaluateCombinations();
        } else {
            cellStates[choice] = true;
            oPlayer.push(choice);
            e.target.classList.add("oSelect");
            changeTurn();
            evaluateCombinations();
        }
    } 
}

function evaluateCombinations() {
    if (playerTurn) {
        for (let i = 0; i < winStates.length; i++) {
            let winningCombo = winStates[i];
            let match = 0;
            for (let j = 0; j < winningCombo.length; j++) {
                if (xPlayer.includes(winningCombo[j])) {
                    match++;
                } if (match === 3) {
                    gameMessage.innerText = "player X winz!"
                    gameBoard.removeEventListener("click", cellClick);
                    xWins++;
                    xScore.innerText = xWins;
                }
            }
        }
    } else {
        for (let i = 0; i < winStates.length; i++) {
            let winningCombo = winStates[i];
            let match = 0;
            for (let j = 0; j < winningCombo.length; j++) {
                if (oPlayer.includes(winningCombo[j])) {
                    match++;
                } if (match === 3) {
                    gameMessage.innerText = "player O winz!"
                    gameBoard.removeEventListener("click", cellClick);
                    oWins++;
                    oScore.innerText = oWins;
                }
            }
        }
    }
    if (xPlayer.length >= 4 && oPlayer.length >= 4) {
        gameDraw();
    }
}

function changeTurn() {
    if (!playerTurn) {
        playerTurn++;
        gameMessage.innerText = "oh my! it's O's turn."
    } else {
        playerTurn--;
        gameMessage.innerText = "x gonna give it to ya."
    }
}

function gameDraw() {
    gameMessage.innerText = "tis a draw!";
    gameBoard.removeEventListener("click", cellClick);
}

function resetGame() {
    xPlayer = [];
    oPlayer = [];
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