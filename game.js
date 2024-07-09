import { createPlayer, createGameboard } from './index.js';

const rowHeight = '1em';
const colWidth = '1em';

const player1 = createPlayer('human');
const player2 = createPlayer('human');
const currPlayer = player1;


const renderGameboard = (gameboard, gameboardDiv) => {
    const nrRows = gameboard.nrRows;
    const nrCols = gameboard.nrCols;
    const gameboardDivChild = document.createElement('div');
    gameboardDivChild.style.display = 'grid';
    gameboardDivChild.style.gridTemplateRows = `repeat(${nrRows}, ${rowHeight})`;
    gameboardDivChild.style.gridTemplateColumns = `repeat(${nrCols}, ${colWidth})`

    for (let i = 0; i < nrRows; i++) {
        for (let j = 0; j < nrCols; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if (gameboard.board[i][j] === 'shipHit') {
                square.style.background = 'red';
            } else if (gameboard.board[i][j] === 'hit') {
                square.style.background = 'black';
            } else {
                square.addEventListener('click', e => {
                    if (gameboard === player1.gameboard && move === 'Player 2') {
                        gameboard.receiveAttack(i, j);
                        move = 'Player 1';
                    } else if (gameboard === player2.gameboard && move === 'Player 1') {
                        gameboard.receiveAttack(i, j);
                        move = 'Player 2';
                    }
                    moveDiv.textContent = move;
                    gameboardDiv.innerHTML = '';
                    renderGameboard(gameboard, gameboardDiv);
                });
            }
            gameboardDivChild.appendChild(square);
        }
    }
    gameboardDiv.appendChild(gameboardDivChild);
}

const gameboardDiv1 = document.querySelector("#gameboard1");
const gameboardDiv2 = document.querySelector("#gameboard2");
const moveDiv = document.querySelector('#move');
moveDiv.textContent = currPlayer === player1 ? 'Player 1' : 'Player 2';

renderGameboard(player1.gameboard, gameboardDiv1);
renderGameboard(player2.gameboard, gameboardDiv2);

const ships = [
  { type: "carrier", length: 5 },
  { type: "battleship", length: 4 },
  { type: "cruiser", length: 3 },
  { type: "submarine", length: 3 },
  { type: "destroyer", length: 2 },
];

let currentShipIndex = 0;
const shipType = document.querySelector("#ship-type");
shipType.innerText = `Add ${ships[currentShipIndex].type} (${ships[currentShipIndex].length}) ship:`;

const addShipForm = document.querySelector('#add-ship-form');
const addShipModal = document.querySelector('#add-ship-modal');

function nextShip() {
  currentShipIndex++;
  if (currentShipIndex < ships.length) {
    shipType.innerText = `Add ${ships[currentShipIndex].type} (${ships[currentShipIndex].length}) ship:`;
  } else {
    alert("All ships placed successfully!");
    if (currPlayer === player1) {
      currentShipIndex = 0;
      currPlayer = player2;
      shipType.innerText = `Add ${ships[currentShipIndex].type} (${ships[currentShipIndex].length}) ship:`;
    }
    addShipModal.style.display = "none"; // Hide the form when all ships are placed
  }
}

addShipForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const startX = parseInt(document.getElementById("col").value);
  const startY = parseInt(document.getElementById("row").value);
  const orientation = document.getElementById("orientation").value === "horizontal";
  const currentShip = ships[currentShipIndex];
  shipType.innerText = `Add ${currentShip.type} (${currentShip.length}) ship:`;
  console.log(startX, startY, orientation, currentShip.length, currentShip.type);

  if (
    currPlayer.gameboard.placeShip(currentShip.length, startX, startY, orientation)
  ) {
    alert(`${currentShip.type} placed successfully!`);
    nextShip();
  } else {
    alert("Invalid placement. Try again.");
  }
});