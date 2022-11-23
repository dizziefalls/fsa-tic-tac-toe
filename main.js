// ******** GLOBAL VARIABLES ********
let state;


// ******** DOM QUERIES ********
const board = document.querySelector('.board');
const p1Input = document.querySelector('#player-1');
const p2Input = document.querySelector('#player-2');

// ******** EVENT LISTENERS ********
board.addEventListener('click', e => {
  console.log(e.target.id);
})
p1Input.addEventListener('input', event => {
  setPlayerName(event, state)
})
p2Input.addEventListener('input', event => {
  setPlayerName(event, state)
})

// Board population
// Swap innerText for state{} prop
function populateBoard(){

  for (let i = 0; i < 9; i++){
    const dummyCell = document.createElement('div');
    dummyCell.classList.add('cell')
    dummyCell.id = `cell-${i}`
    board.appendChild(dummyCell);
  }
  const boardChildren = [...board.childNodes]

  boardChildren.forEach(child => {
    child.innerText = 'Test';
  })
}

// ******** UI INIT ********
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

function determineTurn(state){
  //if even...
  return !(state.turn % 2);
}

//Change display name and points allocation
function playerControl(state){
  if (determineTurn(state)){
    //player1
  } 
  else {
    //player2
  }
}

function markBoard(){

}

function printPage(){
  //update the page with new values
}


// ******** STATE BOOTSTRAPING ********
function resetState(){
  state = {
    players: ['x', 'o'],
    playerNames: ['', ''],
    turn: 0,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  }
}

resetState();
populateBoard();

//add listeners to inputs and set name variables