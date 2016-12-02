var boardDOMElement = document.getElementById("board");
var resultDOMElement = document.getElementById("winner-text");
var resetDOMElement = document.getElementById("reset-game");






var rows = 6;
var columns = 7;

// column and row variables set the size of the board
// current iteration supports board sie up to 10 x 10
// small change required to change to booard up tp 100 x 100

var clickerCount = 0; //Keeps track of whose turn it is
var gameState = true; //gameState true means that game is playable - ie not won or drawn
var gameWinner; //stores the winner
var winSize = 4; //how many matches constitute a win
var allianceIds = [];
var imperialIds = [];

//createBoard draws the game board. It also resets game variables and is called when
// the game is reset

function createBoard() {
    boardDOMElement.innerHTML = "";
    resultDOMElement.innerHTML = "";
    resetDOMElement.classList.add("hidden");
    clickerCount = 0;
    gameState = true;
    gameWinner = undefined;
    for (i = 0; i < rows; i++) {
        var boardRow = document.createElement("div");
        boardRow.classList.add("row");
        for (j = 0; j < columns; j++) {
            var boardBox = document.createElement("div");
            boardBox.classList.add("col-md-4", "board-box");
            boardBox.id = (i + 1) + "" + (j);
            boardRow.appendChild(boardBox);

        }
        boardDOMElement.appendChild(boardRow);



    }
    startBottomRow();
}

createBoard();


// startBottomRow adds the class empty to all blocks on the bottom row

function startBottomRow() {
    for (i = 0; i < columns; i++) {
        var bottomBlock = rows.toString() + i.toString();
        document.getElementById(bottomBlock).classList.add("empty");

    }

}

// Create an event listener that changes the class of the box on click
// Click event should change class of box clicked on - but only if class is empty


// This is a potential target for refactor as there is some repeated code

boardDOMElement.addEventListener("click", function() {

    var allianceCombos = [];
    var imperialCombos = [];
    if ((clickerCount % 2 === 0) && gameState === true) {
        turnStructure("imperial");
        generateOwnedArrays();
        if (imperialIds.length >= winSize) {
            getCombinations(imperialIds, winSize, 0, [], imperialCombos);
            checkWin(imperialCombos);
        }
        if (gameState === false) {
            gameWinner = "Imperials *";
        }


    } else if ((clickerCount % 2 !== 0) && gameState === true) {
        turnStructure("alliance");
        generateOwnedArrays();
        if (allianceIds.length >= winSize) {
            getCombinations(allianceIds, winSize, 0, [], allianceCombos);
            checkWin(allianceCombos);
        }
        if (gameState === false) {
            gameWinner = "Alliance @";
        }
        if (clickerCount === (rows * columns)) {
            gameState = false;
        }
    }

    if (gameState === false) {
        printWinner();
    }
});

// turn structure takes the argument of player based on which players turn it is

function turnStructure(player) {
    var validPlay;
    var clickedBox = event.target;
    var clickedId = parseInt(event.target.id);
    for (i = 1; i <= rows; i++) {
        if (clickedBox.classList.contains("empty")) {
            clickedBox.classList.add(player, "in-play");
            clickedBox.classList.remove("empty", "alliance-hover", "imperial-hover");
            validPlay = true;
            break;
        } else {
            clickedId = clickedId + 10;
            clickedBox = document.getElementById(clickedId);
        }
    }
    if (validPlay === true) {
        clickerCount++;
        stackPlay(clickedId);
        validPlay = undefined;
    }


}

// stackPlay takes the ID of the last played box and makes the box above it playable


function stackPlay(id) {
    var boxAbove = parseInt(id) - 10;
    if (boxAbove >= 10) {
        document.getElementById(boxAbove).classList.add("empty");
    }
}

// printWinner displays the results of the game

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
// getCombinations is a recursive function which is fairly complex
// in english it grabs every possible combination of a particular size from elements in an array
// this is used create an array containing arrays of every combination of elements in play
// Win checks are then run on each of these arrays



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


boardDOMElement.addEventListener("mouseover", function() {
    if (gameState === true) {
        var hoveredBox = event.target;
        var hoveredId = parseInt(event.target.id);
        var i = hoveredId;
        for (i; i <= 66; i += 10) {
            if (hoveredBox.classList.contains("empty")) {
                if (clickerCount % 2 === 0) {
                    hoveredBox.classList.add("imperial-hover");
                } else if (clickerCount % 2 !== 0) {
                    hoveredBox.classList.add("alliance-hover");
                }
                break;
            } else {
                hoveredId = hoveredId + 10;
                hoveredBox = document.getElementById(hoveredId);
            }
        }
    }
});

boardDOMElement.addEventListener("mouseout", function() {
    var hoveredBox = event.target;
    var hoveredId = parseInt(event.target.id);
    var i = hoveredId;

    if (gameState === true) {
        for (i; i <= 66; i += 10) {
        if (hoveredBox.classList.contains("empty")) {
            if (clickerCount % 2 === 0) {
                hoveredBox.classList.remove("imperial-hover");
            } else if (clickerCount % 2 !== 0) {
                hoveredBox.classList.remove("alliance-hover");
            }
            break;
        } else {
            hoveredId = hoveredId + 10;
            hoveredBox = document.getElementById(hoveredId);
        }
    }
}

});
