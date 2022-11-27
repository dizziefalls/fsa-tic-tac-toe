// Write AI: first add computer functionality and random choices, then weight choices for available win locations.
// Add Computer setting for player 2.

// ******** GLOBAL VARIABLES ********
let state;
const WIN_COMBONATIONS = [
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
  [[0, 2], [1, 1], [2, 0]]
];


// ******** DOM QUERIES ********
const board = document.querySelector('.board');
const p1Input = document.querySelector('#player-1');
const p2Input = document.querySelector('#player-2');
const newRoundButton = document.querySelector('#next-game');
const playComputer = document.querySelector('#play-computer');
const resetButton = document.querySelector('#reset-button')

// ******** EVENT LISTENERS ********
//very frustrating js nonsense below
//write a function that calls a function because you can't use parameters in callback functions including the event you need to pass, but if you write an inline arrow function you can't remove the event listener. perfect sense. why can't we just reference the event listener and add a disabled method to it??
const boardListener = event => {
  tick(event, state);
}
function addBoardListener(){
  board.addEventListener('click', boardListener);
}

function removeBoardListener(){
  board.removeEventListener('click', boardListener);
}

p1Input.addEventListener('input', event => {
  setPlayerName(event, state);
})

p2Input.addEventListener('input', event => {
  setPlayerName(event, state);
})

newRoundButton.addEventListener('click', event => {
  toggleReset(event, state);
})

playComputer.addEventListener('click', event => {
  setComputerPlayer(state);
})

resetButton.addEventListener('click', () => {
  hardReset();
})
// ******** UI INIT ********
//Adding the paras after just using divs so I could center the text was one of the worst decisions I've ever made.
function populateBoard(){

  for (let i = 0; i < 3; i++){
    const dummyRow = document.createElement('div');
    dummyRow.classList.add('row');
    dummyRow.id = `row-${i}`;
    board.appendChild(dummyRow);
    for (let j = 0; j < 3; j++){
      const dummyCell = document.createElement('div');
      const dummyP = document.createElement('p');
      // to match id to board array indices
      dummyCell.classList.add('cell');
      dummyCell.id = `cell-${i}${j}`;
      dummyRow.appendChild(dummyCell);
      dummyP.classList.add('cell-text')
      dummyCell.appendChild(dummyP);
    }
  }
}

//Could be nice to wait for an enter on input
function printPlayers(state, player){
  //we need to check for each player so the other doesn't get overwritten.
  const p1DisplayName = document.querySelector('#p1-display')
  const p2DisplayName = document.querySelector('#p2-display')

  if(player === 0) {
    p1DisplayName.innerText = state.playerNames[0];
  }
  else if(player === 1) {
    p2DisplayName.innerText = state.playerNames[1];
  }
}

function setPlayerName(event, state){
  if (event.target.id === 'player-1'){
    state.playerNames[0] = event.target.value;
    printPlayers(state, 0);
  }
  else if (event.target.id === 'player-2'){
    state.playerNames[1] = event.target.value
    printPlayers(state, 1);
  }
}

// ******** GAME LOGIC ********
function checkForWin(state){
  const testBoard = state.board;

  //for each win, check if a char is in one of the right locations, then the next two
  WIN_COMBONATIONS.forEach((win) => {
    // would like to find out how to generalize this method
    if ((testBoard[win[0][0]][win[0][1]] === 'x') &&
        (testBoard[win[1][0]][win[1][1]] === 'x') &&
        (testBoard[win[2][0]][win[2][1]] === 'x')) {
          processWin(state, 'player1');
          console.log('ITS A WINNER');
          return
    }

    if ((testBoard[win[0][0]][win[0][1]] === 'o') &&
        (testBoard[win[1][0]][win[1][1]] === 'o') &&
        (testBoard[win[2][0]][win[2][1]] === 'o')) {
          processWin(state, 'player2');
          return
    }
  })

  //Don't check for a draw if the game is over.
  if(state.isGameEnd === false) {
    const draw = () => {
      // could probably be more elegant
      let nullCount = 0;
      testBoard.forEach(row => {
        row.forEach(cell => {
          if (cell === null){
            nullCount++;
          }
        })
      })
      return !nullCount;
    }
  
    if (draw()){
      processWin(state, 'draw');
    }
  }
}

function processWin(state, winner){
  if (winner === 'player1'){
    state.playerPoints[0]++;
  }
  else if (winner === 'player2') {
    state.playerPoints[1]++;
  }
  console.log(`The winner is: ${winner}!`)
  updatePoints(state);
  setGameEnd(state);
}

function setGameEnd(state){
  if (!state.isGameEnd){
    state.isGameEnd = true;
    newRoundButton.disabled = false;
    removeBoardListener(state);
  }
}

function toggleReset(event, state){
  if (state.isGameEnd){
    state.isGameEnd = false;
    newRoundButton.disabled = true;
    resetBoard(state);
    addBoardListener(state);
    tick(event, state)
  }
}

function setComputerPlayer(state){
  state.isComputerP2 = true;
  state.playerNames[1] = 'Compy!';
  printPlayers(state, 1);
  p2Input.disabled = true;
  playComputer.disabled = true;
  printPage(state);
}

// Disables computer player if the game has begun
function checkIfBoardPlayed(state){
  state.board.forEach(row => {
    row.forEach(cell => {
      if (cell !== null){
        playComputer.disabled = true;
        return
      }
    })
  })
}

//Move event handler funcs to separate category.
function markBoard(event, state){
  let cellId;
  if (event.target.classList[0] === 'cell-text'){
    cellId = event.target.parentElement.id.slice(5).split('');
    //event.target.parentElement.classList.add('cell-disabled');
  }
  else if (event.target.classList[0] === 'cell') {
    cellId = event.target.id.slice(5).split('');
    event.target.classList.add('cell-disabled');
  }
  console.log(cellId);
  if(cellId !== undefined) {
    const row = cellId[0];
    const col = cellId[1];
    // will have to update for computer
    if(!state.board[row][col]) {
      state.board[row][col] = state.playerMarks[state.turn%2];
      state.turn++;
  
    }
  }
}

function updatePoints(state){
  const p1PointDisplay = document.querySelector('.p1-points-name');
  const p2PointDisplay = document.querySelector('.p2-points-name');

  p1PointDisplay.innerText = `Points: ${state.playerPoints[0]}`;
  p2PointDisplay.innerText = `Points: ${state.playerPoints[1]}`;
}

// ******** COMPUTER BEHAVIOR ********
function compMarkBoard(state){
  //choose a valid location on the board
  const compysChoice = compCellChoice(state);
  //mark the location
  state.board[compysChoice[0]][compysChoice[1]] = 'o';
  //increment the turn
  state.turn++
}

function compCellChoice(state){
  //first just grab an open available cell
  //then update to choose a cell based on an algorithm - minmax is common
  const availableCells = [];
  state.board.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (cell === null){
        availableCells.push([rIdx, cIdx]);
      }
    })
  })
  const compysChoice = Math.floor(Math.random() * availableCells.length);
  return availableCells[compysChoice];
}


// ******** PAGE UPDATING ********
function printBoard(state){
  const cells = [...document.querySelectorAll('.cell-text')]

  for (let i = 0; i < state.board.length; i++){
    for (let j = 0; j < state.board[i].length; j++){
        const currentCell = `${i * 3 + j}`
        cells[currentCell].innerText = state.board[i][j];
    }
  }
}

function printPage(state){
  //update the page with new values
  printBoard(state);
  updatePoints(state);
}

//Ensures that markBoard() only receives board elements
function checkValidMove(event, state) {
  if (!(event.target.id === 'next-game') && !(event.target.id === 'play-computer')){
    markBoard(event, state);
  }
}

function compOr2Player(event, state){
  if (!state.isComputerP2){
    checkValidMove(event, state)
  }
  else {
    // if there is a computer, only mark the board on even turns
    if (!(state.turn % 2)) {
      checkValidMove(event, state)
    }
  }
}

function tick(event, state){
  //only mark the board if two-player or it's the user's turn
  compOr2Player(event, state);
  if(!state.isComputerP2) {
    checkIfBoardPlayed(state);
  }
  printPage(state);


  // Compy is first in subsequent games
  // tick is calling compy on in valid clicks
  if(state.isComputerP2){
    compMarkBoard(state);
    setTimeout(() => {
      printPage(state)
    }, 400);
  }

  checkForWin(state);
}


// ******** STATE BOOTSTRAPING AND HANDLING ********
function resetState(){
  state = {
    playerMarks: ['x', 'o'],
    playerNames: ['', ''],
    playerPoints: ['0','0'],
    isComputerP2: false,
    currentPlayer: null,
    turn: 0,
    isGameEnd: false,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  }

  return state;
}

function resetBoard(state){
  state.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  state.turn = 0;
  setCellsActive();
}

function setCellsActive(){
  board.childNodes.forEach(row => {
    row.childNodes.forEach(cell =>{
      cell.classList.remove('cell-disabled')
    })
  })
}

function hardReset(){
  const reset = confirm('Are you sure you want to reset? This will wipe all progress. This enables you to toggle the computer player.')
  if (reset){
    printPage(resetState());
    playComputer.disabled = false;
  }
}

// ******** PAGE INIT ********
resetState();
populateBoard();
updatePoints(state);
addBoardListener(state);



//TODO: Clicking too quickly throws a type error line:121. Consider turning off click listener until board is updated
//FIXME: The next game button might still have some odd behavior