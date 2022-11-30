// ******** GLOBAL VARIABLES ********
let state;
const WIN_COMBINATIONS = [
  //row wins
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  //col wins
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  //diag
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

// ******** DOM QUERIES ********
const board = document.querySelector(".board");
const p1Input = document.querySelector("#player-1");
const p2Input = document.querySelector("#player-2");
const newRoundButton = document.querySelector("#next-game");
const playComputer = document.querySelector("#play-computer");
const resetButton = document.querySelector("#reset-button");
const infoText = document.querySelector("#game-info");

// ******** EVENT LISTENERS ********
//very frustrating js nonsense below
const boardListener = (event) => {
  tick(event, state);
};
function addBoardListener() {
  board.addEventListener("click", boardListener);
}

function removeBoardListener() {
  board.removeEventListener("click", boardListener);
}

p1Input.addEventListener("input", (event) => {
  setPlayerName(event, state);
});

p2Input.addEventListener("input", (event) => {
  setPlayerName(event, state);
});

newRoundButton.addEventListener("click", () => {
  toggleReset(state);
});

playComputer.addEventListener("click", () => {
  setComputerPlayer(state);
});

resetButton.addEventListener("click", () => {
  hardReset(state);
});
// ******** UI INIT ********
//Adding the paras after just using divs so I could center the text was one of the worst decisions I've ever made.
function populateBoard() {
  for (let i = 0; i < 3; i++) {
    const dummyRow = document.createElement("div");
    dummyRow.classList.add("row");
    dummyRow.id = `row-${i}`;
    board.appendChild(dummyRow);
    for (let j = 0; j < 3; j++) {
      const dummyCell = document.createElement("div");
      const dummyP = document.createElement("p");
      // to match id to board array indices
      dummyCell.classList.add("cell");
      dummyCell.id = `cell-${i}${j}`;
      dummyRow.appendChild(dummyCell);
      dummyP.classList.add("cell-text");
      dummyCell.appendChild(dummyP);
    }
  }
}

//Could be nice to wait for an enter on input
function printPlayers(state, player) {
  //we need to check for each player so the other doesn't get overwritten.
  const p1DisplayName = document.querySelector("#p1-display");
  const p2DisplayName = document.querySelector("#p2-display");

  if (player === 0) {
    p1DisplayName.innerText = state.playerNames[0];
  } else if (player === 1) {
    p2DisplayName.innerText = state.playerNames[1];
  }
}

function setPlayerName(event, state) {
  if (event.target.id === "player-1") {
    state.playerNames[0] = event.target.value;
    printPlayers(state, 0);
  } else if (event.target.id === "player-2") {
    state.playerNames[1] = event.target.value;
    printPlayers(state, 1);
  }
}

function infoHandler(state) {
  let info = "Mmm mmm I love ttt-ing";
  if (state.turn === 0) {
    info = "Howdy, let's triple T baby!";
  }
  if (state.isGameEnd && state.isDraw) {
    info =
      "Well that's how the cookie crumbles sometimes... Give her another go!";
  }
  if (state.isGameEnd && !state.isDraw) {
    info = `End! Looks like ${state.currentWinner} takes the point!`;
  }
  infoText.textContent = info;
}

// ******** GAME LOGIC ********
function checkForWin(state) {
  const testBoard = state.board;

  //for each win, check if a char is in one of the right locations, then the next two
  WIN_COMBINATIONS.forEach((win) => {
    // would like to find out how to generalize this method
    if (
      testBoard[win[0][0]][win[0][1]] === "x" &&
      testBoard[win[1][0]][win[1][1]] === "x" &&
      testBoard[win[2][0]][win[2][1]] === "x"
    ) {
      processWin(state, "player1");
      console.log("ITS A WINNER");
      return;
    }

    if (
      testBoard[win[0][0]][win[0][1]] === "o" &&
      testBoard[win[1][0]][win[1][1]] === "o" &&
      testBoard[win[2][0]][win[2][1]] === "o"
    ) {
      processWin(state, "player2");
      return;
    }
  });

  //Don't check for a draw if the game is over.
  if (state.isGameEnd === false) {
    const draw = () => {
      // could probably be more elegant
      let nullCount = 0;
      testBoard.forEach((row) => {
        row.forEach((cell) => {
          if (cell === null) {
            nullCount++;
          }
        });
      });
      return !nullCount;
    };

    if (draw()) {
      state.isDraw = true;
      processWin(state, "draw");
    }
  }
}

function processWin(state, winner) {
  if (winner === "player1") {
    state.playerPoints[0]++;
    state.currentWinner = state.playerNames[0];
  } else if (winner === "player2") {
    state.playerPoints[1]++;
    state.currentWinner = state.playerNames[1];
  }
  updatePoints(state);
  setGameEnd(state);
}

function setGameEnd(state) {
  if (!state.isGameEnd) {
    state.isGameEnd = true;
    newRoundButton.disabled = false;
    removeBoardListener(state);
  }
}

function toggleReset(state) {
  if (state.isGameEnd) {
    state.isGameEnd = false;
    newRoundButton.disabled = true;
    resetBoard(state);
    addBoardListener(state);
    printPage(state);
  }
}

// Disables computer player if the game has begun
function checkIfBoardPlayed(state) {
  state.board.forEach((row) => {
    row.forEach((cell) => {
      if (cell !== null) {
        playComputer.disabled = true;
        return;
      }
    });
  });
}

function setComputerPlayer(state) {
  state.isComputerP2 = true;
  state.playerNames[1] = "Compy!";
  printPlayers(state, 1);
  p2Input.disabled = true;
  playComputer.disabled = true;
  printPage(state);
}

// ******** COMPUTER BEHAVIOR ********
function compMarkBoard(state) {
  const compysChoice = compCellChoice(state);
  state.board[compysChoice[0]][compysChoice[1]] = "o";
  state.turn++;
}

function compCellChoice(state) {
  //minmax algo goes here ish
  const availableCells = [];
  state.board.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (cell === null) {
        availableCells.push([rIdx, cIdx]);
      }
    });
  });
  const compysChoice = Math.floor(Math.random() * availableCells.length);
  return availableCells[compysChoice];
}

// ******** PAGE UPDATING ********
function markBoard(event, state) {
  let cellId;
  if (event.target.classList[0] === "cell") {
    cellId = event.target.id.slice(5).split("");
    event.target.classList.add("cell-disabled");
  }
  console.log(cellId);
  if (cellId !== undefined) {
    const row = cellId[0];
    const col = cellId[1];
    if (!state.board[row][col]) {
      state.board[row][col] = state.playerMarks[state.turn % 2];
      state.turn++;
    }
  }
}

function updatePoints(state) {
  const p1PointDisplay = document.querySelector(".p1-points-name");
  const p2PointDisplay = document.querySelector(".p2-points-name");

  p1PointDisplay.innerText = `Points: ${state.playerPoints[0]}`;
  p2PointDisplay.innerText = `Points: ${state.playerPoints[1]}`;
}

function printBoard(state) {
  const cells = [...document.querySelectorAll(".cell-text")];

  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      const currentCell = `${i * 3 + j}`;
      cells[currentCell].innerText = state.board[i][j];
    }
  }
}

function printCurrentPlayer(state) {
  const currentPlayer = document.querySelector("#current-player");
  state.turn % 2
    ? (state.currentPlayer = document.querySelector("#p2-display").textContent)
    : (state.currentPlayer = document.querySelector("#p1-display").textContent);
  currentPlayer.innerText = state.currentPlayer;
}

function printPage(state) {
  //update the page with new values
  printBoard(state);
  updatePoints(state);
  printCurrentPlayer(state);
}

//Ensures that markBoard() only receives board elements
function checkValidMove(event, state) {
  if (
    !(event.target.id === "next-game") &&
    !(event.target.id === "play-computer")
  ) {
    markBoard(event, state);
  }
}

function compOr2Player(event, state) {
  if (!state.isComputerP2) {
    checkValidMove(event, state);
  } else {
    // if there is a computer, only mark the board on even turns
    if (!(state.turn % 2)) {
      checkValidMove(event, state);
    }
  }
}

function tick(event, state) {
  //only mark the board if two-player or it's the user's turn
  compOr2Player(event, state);
  if (!state.isComputerP2) {
    checkIfBoardPlayed(state);
  }
  printPage(state);
  checkForWin(state);

  if (state.isComputerP2 && state.isGameEnd === false && state.turn % 2) {
    compMarkBoard(state);
    setTimeout(() => {
      printPage(state);
    }, 400);
    checkForWin(state);
  }
  infoHandler(state);
}

// ******** STATE BOOTSTRAPING AND RESETTING ********
function resetState() {
  state = {
    playerMarks: ["x", "o"],
    playerNames: ["", ""],
    playerPoints: ["0", "0"],
    isComputerP2: false,
    currentPlayer: null,
    turn: 0,
    isGameEnd: false,
    isDraw: false,
    currentWinner: null,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };

  return state;
}

function resetBoard(state) {
  state.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  state.turn = 0;
  state.isDraw = false;
  setCellsActive();
  infoHandler(state);
}

function setCellsActive() {
  board.childNodes.forEach((row) => {
    row.childNodes.forEach((cell) => {
      cell.classList.remove("cell-disabled");
    });
  });
}

function hardReset(state) {
  const reset = confirm(
    "Are you sure you want to reset? This will wipe all progress. This enables you to toggle the computer player."
  );
  if (reset) {
    setCellsActive();
    printPage(resetState());
    removeBoardListener();
    addBoardListener();
    playComputer.disabled = false;
    infoHandler(state);
  }
}

// ******** PAGE INIT ********
resetState();
populateBoard();
updatePoints(state);
addBoardListener(state);
infoHandler(state);

//TODO: Clicking too quickly throws a type error line:121. Consider turning off click listener until board is updated
//Update AI.
//Get rid of some fluff - clean css
