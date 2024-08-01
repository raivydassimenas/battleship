import { createPlayer, createGameboard, createShip } from "./index.js";

const rowHeight = "1em";
const colWidth = "1em";

let player1 = createPlayer("human");
let player2 = createPlayer("human");
let currPlayer = player1;
let move = "Player 1";

const renderGameboard = (gameboard, gameboardDiv) => {
  const nrRows = gameboard.nrRows;
  const nrCols = gameboard.nrCols;
  const gameboardDivChild = document.createElement("div");
  gameboardDivChild.style.display = "grid";
  gameboardDivChild.style.gridTemplateRows = `repeat(${nrRows}, ${rowHeight})`;
  gameboardDivChild.style.gridTemplateColumns = `repeat(${nrCols}, ${colWidth})`;

  for (let i = 0; i < nrRows; i++) {
    for (let j = 0; j < nrCols; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      if (gameboard.board[i][j] === "shipHit") {
        square.style.background = "red";
      } else if (gameboard.board[i][j] === "hit") {
        square.style.background = "black";
      } else {
        square.addEventListener("click", (e) => {
          if (gameboard === player1.gameboard && move === "Player 2") {
            gameboard.receiveAttack(i, j);
            if (player1.gameboard.allSunk()) {
              alert("Player 2 wins!");
              game.style.display = "none";
            }
            move = "Player 1";
          } else if (gameboard === player2.gameboard && move === "Player 1") {
            gameboard.receiveAttack(i, j);
            if (player2.gameboard.allSunk()) {
              alert("Player 1 wins!");
              game.style.display = "none";
            }
            move = "Player 2";
          }
          moveDiv.textContent = move;
          gameboardDiv.innerHTML = "";
          renderGameboard(gameboard, gameboardDiv);
        });
      }
      gameboardDivChild.appendChild(square);
    }
  }
  gameboardDiv.appendChild(gameboardDivChild);
};

const gameboardDiv1 = document.querySelector("#gameboard1");
const gameboardDiv2 = document.querySelector("#gameboard2");
const moveDiv = document.querySelector("#move");
moveDiv.textContent = currPlayer === player1 ? "Player 1" : "Player 2";

const ships = [
  { type: "carrier", length: 5 },
  { type: "battleship", length: 4 },
  { type: "cruiser", length: 3 },
  { type: "submarine", length: 3 },
  { type: "destroyer", length: 2 },
];

let currentShipIndex = 0;
const shipType = document.querySelector("#ship-type");
shipType.innerText = `Add ${ships[currentShipIndex].type} (${
  ships[currentShipIndex].length
}) ship (${currPlayer === player1 ? "Player 1" : "Player 2"}):`;

const addShipForm = document.querySelector("#add-ship-form");
const addShipModal = document.querySelector("#add-ship-modal");
const game = document.querySelector("#game");
game.style.display = "none";

function nextShip() {
  currentShipIndex++;
  if (currentShipIndex < ships.length) {
    shipType.innerText = `Add ${ships[currentShipIndex].type} (${
      ships[currentShipIndex].length
    }) ship (${currPlayer === player1 ? "Player 1" : "Player 2"}):`;
  } else {
    alert("All ships placed successfully!");
    if (currPlayer === player1) {
      currentShipIndex = 0;
      currPlayer = player2;
      shipType.innerText = `Add ${ships[currentShipIndex].type} (${
        ships[currentShipIndex].length
      }) ship (${currPlayer === player1 ? "Player 1" : "Player 2"}):`;
    }
    if (currPlayer === player2 && currentShipIndex === ships.length) {
      addShipModal.style.display = "none";
      renderGameboard(player1.gameboard, gameboardDiv1);
      renderGameboard(player2.gameboard, gameboardDiv2);
      game.style.display = "block"; // Hide the form when all ships are placed
    }
  }
}

addShipForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const startX = parseInt(document.getElementById("col").value) - 1;
  const startY = parseInt(document.getElementById("row").value) - 1;
  const orientation =
    document.getElementById("orientation").value === "horizontal";
  const currentShip = ships[currentShipIndex];
  shipType.innerText = `Add ${currentShip.type} (${currentShip.length}) ship:`;

  const ship = createShip(currentShip.type, currentShip.length);
  if (currPlayer.gameboard.placeShip(ship, startY, startX, orientation)) {
    alert(`${currentShip.type} placed successfully!`);
    nextShip();
  } else {
    alert("Invalid placement. Try again.");
  }
});

function getAvailableMoves(player) {
  const moves = [];
  for (let i = 0; i < player.gameboard.nrRows; i++) {
    for (let j = 0; j < player.gameboard.nrCols; j++) {
      if (player.gameboard.board[i][j] === null) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
}

function getComputerMove(player) {
  const moves = getAvailableMoves(player);
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}
