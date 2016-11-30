// function to create a board
// Board needs to have three divs with class row and board-row, row needs to contain three divs with class
// col-md-4 and board-box


var boardDOMElement = document.getElementById("board");
var resultDOMElement = document.getElementById("winner-text");
var resetDOMElement = document.getElementById("reset-game");

var audio = new Audio('nooo.mp3');



var allianceIds = [];
var imperialIds = [];


function createBoard() {
    boardDOMElement.innerHTML = "";
    resultDOMElement.innerHTML = "";
    resetDOMElement.classList.add("hidden");
    clickerCount = 0;
    gameState = true;
    gameWinner = undefined;
    for (i = 0; i < 3; i++) {
        var boardRow = document.createElement("div");
        boardRow.classList.add("row");
        for (j = 0; j < 3; j++) {
            var boardBox = document.createElement("div");
            boardBox.classList.add("col-md-4", "board-box", "empty");
            boardBox.id = (i + 1) + "" + (j + 1);
            boardRow.appendChild(boardBox);

        }
        boardDOMElement.appendChild(boardRow);
    }
}

createBoard();

// Create an event listener that changes the class of the box on click
// Click event should change class of box clicked on - but only if class is empty

var clickerCount = 0;
var gameState = true;
var gameWinner;
var winSize = 3;

boardDOMElement.addEventListener("click", function() {
    var allianceCombos = [];
    var imperialCombos = [];
    if (event.target.classList.contains("empty") && (clickerCount % 2 === 0) && gameState === true) {
        event.target.classList.add("imperial", "in-play");
        event.target.classList.remove("empty");
        clickerCount++;
        generateOwnedArrays();
        if (imperialIds.length >= winSize) {
            getCombinations(imperialIds, winSize, 0, [], imperialCombos);
            checkWin(imperialCombos);
        }
        if (gameState === false) {
            gameWinner = "Imperials";
        }
        if (clickerCount === 9) {
            gameState = false;
        }

    } else if (event.target.classList.contains("empty") && (clickerCount % 2 !== 0) && gameState === true) {
        event.target.classList.add("alliance", "in-play");
        event.target.classList.remove("empty");
        clickerCount++;
        generateOwnedArrays();
        if (allianceIds.length >= winSize) {
            getCombinations(allianceIds, winSize, 0, [], allianceCombos);
            checkWin(allianceCombos);
        }
        if (gameState === false) {
            gameWinner = "Alliance";
            audio.play();
        }
    }

    if (gameState === false) {
        printWinner();
    }
});



function printWinner() {
    if (gameWinner !== undefined) {
        resultDOMElement.innerText = "The winner is " + gameWinner;

    } else {
        resultDOMElement.innerText = "It's a draw";
    }
    resetDOMElement.classList.remove("hidden");

}

resetDOMElement.addEventListener("click", createBoard);


function generateOwnedArrays() {
    var inPlay = document.getElementsByClassName("in-play");
    allianceIds = [];
    imperialIds = [];
    for (i = 0; i < inPlay.length; i++) {
        if (inPlay[i].classList.contains("alliance")) {
            allianceIds.push(inPlay[i].id); //pushes the ids (ie the position) of all alliance blocks to an array

        } else if (inPlay[i].classList.contains("imperial")) {
            imperialIds.push(inPlay[i].id); //pushes the ids (ie the position) of all imperial blocks to an array
        }


    }
}




function getCombinations(array, size, start, holdingArray, output) {
    if (holdingArray.length >= size) {
        output.push(holdingArray);
    } else {
        var i;

        for (i = start; i < array.length; ++i) {
            getCombinations(array, size, i + 1, holdingArray.concat(array[i]), output);
        }
    }
}

function checkRow(arrayOfArrays) {

    for (i = 0; i < arrayOfArrays.length; i++) {
        if (gameState === true) {
            var successCount = 0;
            for (j = 0; j < (winSize - 1); j++) {
                var firstTest = parseInt(arrayOfArrays[i][j]) + 1;
                var secondTest = parseInt(arrayOfArrays[i][j + 1]);
                if (firstTest !== secondTest) {
                    gameState = true;
                }
                if (firstTest === secondTest) {
                    successCount++;
                    if (successCount === (winSize - 1)) {
                        return gameState = false;
                    }
                }

            }
        }
    }
}

function checkColumn(arrayOfArrays) {
    for (i = 0; i < arrayOfArrays.length; i++) {
        if (gameState === true) {
            var successCount = 0;
            for (j = 0; j < (winSize - 1); j++) {
                var firstTest = parseInt(arrayOfArrays[i][j]) + 10;
                var secondTest = parseInt(arrayOfArrays[i][j + 1]);
                if (firstTest !== secondTest) {
                    gameState = true;
                }
                if (firstTest === secondTest) {
                    successCount++;
                    if (successCount === (winSize - 1)) {
                        return gameState = false;
                    }
                }

            }
        }
    }
}

function checkBackDiagonal(arrayOfArrays) {
    for (i = 0; i < arrayOfArrays.length; i++) {
        if (gameState === true) {
            var successCount = 0;
            for (j = 0; j < (winSize - 1); j++) {
                var firstTest = parseInt(arrayOfArrays[i][j]) + 11;
                var secondTest = parseInt(arrayOfArrays[i][j + 1]);
                if (firstTest !== secondTest) {
                    gameState = true;
                }
                if (firstTest === secondTest) {
                    successCount++;
                    if (successCount === (winSize - 1)) {
                        return gameState = false;
                    }
                }

            }
        }
    }
}

function checkForwardDiagonal(arrayOfArrays) {
    for (i = 0; i < arrayOfArrays.length; i++) {
        if (gameState === true) {
            var successCount = 0;
            for (j = 0; j < (winSize - 1); j++) {
                var firstTest = parseInt(arrayOfArrays[i][j]) + 9;
                var secondTest = parseInt(arrayOfArrays[i][j + 1]);
                if (firstTest !== secondTest) {
                    gameState = true;
                }
                if (firstTest === secondTest) {
                    successCount++;
                    if (successCount === (winSize - 1)) {
                        return gameState = false;
                    }
                }

            }
        }
    }
}

function checkWin(arrayOfArrays) {
    checkRow(arrayOfArrays);
    checkColumn(arrayOfArrays);
    checkForwardDiagonal(arrayOfArrays);
    checkBackDiagonal(arrayOfArrays);
}
