// ******** GLOBAL VARIABLES ********
let state;


// ******** DOM QUERIES ********
const board = document.querySelector('.board');
const p1Input = document.querySelector('#player-1');
const p2Input = document.querySelector('#player-2');

// ******** EVENT LISTENERS ********
board.addEventListener('click', event => {
  markBoard(event, state);
})
p1Input.addEventListener('input', event => {
  setPlayerName(event, state)
})
p2Input.addEventListener('input', event => {
  setPlayerName(event, state)
})

// ******** UI INIT ********
//Needs a rewrite to separate rows for nicer layout
function populateBoard(){

  for (let i = 0; i < 3; i++){
    const dummyRow = document.createElement('div');
    dummyRow.classList.add('row');
    dummyRow.id = `row-${i}`;
    board.appendChild(dummyRow);
    for (let j = 0; j < 3; j++){
      const dummyCell = document.createElement('div');
      // to match id to board array indices
      dummyCell.classList.add('cell')
      dummyCell.id = `cell-${i}${j}`
      dummyRow.appendChild(dummyCell);
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


function checkForWin(state){
  //row win: 0j, 1j, 2j 
  //col win: i0, i1, i2
  //dia win: 00, 11, 22 or 02, 11, 20
  const testBoard = state.board;

  //testBoard[0][1]
  const winCombinations = [
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
  ]

  //for each win, check if a char is in one of the right locations, then the next two

  winCombinations.forEach((win) => {
    // need to find out how to generalize this method
    if ((testBoard[win[0][0]][win[0][1]] === 'x') &&
        (testBoard[win[1][0]][win[1][1]] === 'x') &&
        (testBoard[win[2][0]][win[2][1]] === 'x')) {
          processWin(state, 'player1');
          console.log('ITS A WINNER');
    }

    if ((testBoard[win[0][0]][win[0][1]] === 'o') &&
        (testBoard[win[1][0]][win[1][1]] === 'o') &&
        (testBoard[win[2][0]][win[2][1]] === 'o')) {
          processWin(state, 'player2');
    }
  })
}

function processWin(state, winner){
  if (winner === 'player1'){
    state.playerPoints[0]++;
  }
  else {
    state.playerPoints[1]++;
  }
  console.log(`The winner is: ${winner}!`)
  // Add reset button and block click listener until called
  resetBoard(state);
}

//Move event handler funcs to separate category.
function markBoard(event, state){
  cellId = event.target.id.slice(5).split('');
  console.log(cellId);
  const row = cellId[0];
  const col = cellId[1];
  // will have to update for computer
  if(!state.board[row][col]) {
    state.board[row][col] = state.playerMarks[state.turn%2];
    state.turn++;
  }
}

function updatePoints(state){
  const p1PointDisplay = document.querySelector('.p1-points-name');
  const p2PointDisplay = document.querySelector('.p2-points-name');

  p1PointDisplay.innerText = `Points: ${state.playerPoints[0]}`;
  p2PointDisplay.innerText = `Points: ${state.playerPoints[1]}`;
}

function printBoard(state){
  //const boardChildren = [...board.childNodes];
  const cells = [...document.querySelectorAll('.cell')]

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

function tick(state){
  printPage(state);
  checkForWin(state);
}


// ******** STATE BOOTSTRAPING ********
function resetState(){
  state = {
    playerMarks: ['x', 'o'],
    playerNames: ['', ''],
    playerPoints: ['0','0'],
    currentPlayer: null,
    turn: 0,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  }
}

function resetBoard(state){
  state.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  state.turn = 0;
}

resetState();
populateBoard();
//See if this can be replaced by calling printPage on every click
setInterval(() => {
    tick(state)
  }, 50)


//TODO: Clicking too quickly throws a type error line:121. Consider turning off click listener until board is updated
//Rewrite everything so the GODDAMN marks center