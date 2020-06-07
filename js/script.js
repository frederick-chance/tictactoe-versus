let board = document.getElementsByClassName("game-board");
let playerX = document.getElementById("player-x");
let playerO = document.getElementById("player-o");
let versusHuman = document.getElementById("versus-human");
let versusMachine = document.getElementById("versus-machine");

let boardmoves = document.getElementById("game-board-moves");
let playerXmoves = document.getElementById("player-x-moves");
let playerOmoves = document.getElementById("player-o-moves");

let win = ["123", "456", "789", "147", "258", "369", "159", "357"];

let continueGame = true;

for (let square = 0; square < board.length; square++) {
    board[square].addEventListener("click", function () {
        setupGame();

        if (playerTurn(this)) {
            markSquare(this);
            endTurn(this);
        }

        setTimeout(2000);

        if (aiTurn()) {
            let move = determineMove();
            markSquare(move);
            endTurn(move);
        }

        //endGame();
    });
}

function determineMove() {
    let boardState = "";
    let potentialSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    for (let quadrant = 0; quadrant < board.length; quadrant++) {
        if (board[quadrant].innerHTML == "") {
            boardState += "-";
        } else {
            boardState += board[quadrant].innerHTML;

            const index = potentialSquares.indexOf(quadrant);
            if (index > -1) {
                potentialSquares.splice(index, 1);
            }
        }
    }

    let square = potentialSquares[Math.floor(Math.random() * potentialSquares.length)];

    return board[square];
}

function setupGame() {
    if (!playerX.checked && !playerO.checked) {
        playerX.checked = true;
    }

    if (!versusHuman.checked && !versusMachine.checked) {
        versusHuman.checked = true;
    }
}

function markSquare(square) {
    let mark = getPlayerMark();
    square.innerHTML = mark;
}

function endTurn(square) {
    updateBoardMoves(square);
    manageWinCondition();
    switchCurrentPlayer();
}

function switchCurrentPlayer() {
    if (continueGame) {
        if (playerX.checked) {
            playerX.checked = false;
            playerO.checked = true;
        } else {
            playerX.checked = true;
            playerO.checked = false;
        }

        if (versusHuman.checked) {
            versusHuman.checked = false;
            versusMachine.checked = true;
        } else {
            versusHuman.checked = true;
            versusMachine.checked = false;
        }
    }
}

function manageWinCondition() {
    let potentialWin;

    if (playerX.checked) {
        potentialWin = getWinConditions(playerXmoves);
    } else {
        potentialWin = getWinConditions(playerOmoves);
    }

    if (potentialWin.length > 0) {
        continueGame = false;
        showWinConditions(potentialWin);
        removeHover();
    }
}

function removeHover() {
    while (board.length) {
        board[0].classList.remove("game-board");
    }
}

function showWinConditions(conditions) {
    for (let i = 0; i < conditions.length; i++) {
        let condition = conditions[i];

        for (let j = 0; j < condition.length; j++) {
            highlightSquare(condition[j]);
        }
    }
}

function highlightSquare(id) {
    let square = document.getElementById("square-" + id);
    square.classList.add("winning-square");
}

function getWinConditions(moves) {
    let winConditions = [];

    for (let condition = 0; condition < win.length; condition++) {
        let expression = formatWinCondition(win[condition]);

        if (getWinConditionMatch(moves, expression).length == 3) {
            winConditions.push(getWinConditionMatch(moves, expression));
        }
    }

    return winConditions;
}

function getWinConditionMatch(moves, expression) {
    return Array.from(moves.value.matchAll(expression));
}

function formatWinCondition(condition) {
    return new RegExp("[" + condition + "]", "g");
}

function updateBoardMoves(square) {
    let mark = getPlayerMark();
    let quad = getQuadNumber(square);

    trackBoardMoves(mark, quad);
    trackPlayerMoves(quad);
}

function trackBoardMoves(mark, quad) {
    boardmoves.value += mark + quad + " ";
}

function trackPlayerMoves(quad) {
    if (playerO.checked) {
        playerOmoves.value += quad;
    } else {
        playerXmoves.value += quad;
    }
}

function playerTurn(square) {
    return continueGame && versusHuman.checked && square.innerHTML == "";
}

function aiTurn(square) {
    return continueGame && versusMachine.checked;
}

function getPlayerMark() {
    if (playerO.checked) {
        return playerO.value;
    } else {
        return playerX.value;
    }
}

function getQuadNumber(quadrant) {
    return quadrant.dataset.quadrant;
}