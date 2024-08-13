import { createPlayer, createShip } from "./index.js";

let player1 = createPlayer("human");
let player2 = createPlayer("computer");
let currPlayer = player1;

const renderGameboard = (gameboard, gameboardDiv) => {
  gameboardDiv.innerHTML = "";
  const gameboardDivChild = document.createElement("div");
  gameboardDivChild.style.display = "grid";
  gameboardDivChild.style.gridTemplateRows = `repeat(20, 1em)`;
  gameboardDivChild.style.gridTemplateColumns = `repeat(20, 1em)`;

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      if (gameboard.board[i][j] === "shipHit") {
        square.style.background = "red";
      } else if (gameboard.board[i][j] === "hit") {
        square.style.background = "black";
      }
      gameboardDivChild.appendChild(square);
    }
  }
  gameboardDiv.appendChild(gameboardDivChild);
};

const gameboardDiv1 = document.querySelector("#gameboard1");
const gameboardDiv2 = document.querySelector("#gameboard2");
const moveDiv = document.querySelector("#move");
moveDiv.textContent =
  currPlayer === player1 ? "Player's move" : "Computer's move";

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
}) ship (${currPlayer === player1 ? "Player" : "Computer"}):`;

const addShipForm = document.querySelector("#add-ship-form");
const addShipModal = document.querySelector("#add-ship-modal");
const game = document.querySelector("#game");
game.style.display = "none";
const moveModal = document.querySelector("#player-move-modal");
moveModal.style.display = "none";

async function nextShip() {
  currentShipIndex++;
  if (currentShipIndex < ships.length) {
    shipType.innerText = `Add ${ships[currentShipIndex].type} (${
      ships[currentShipIndex].length
    }) ship (${currPlayer === player1 ? "Player" : "Computer"}):`;
  } else {
    alert("All ships placed successfully!");
    if (currPlayer === player1) {
      currentShipIndex = 0;
      currPlayer = player2;
      shipType.innerText = `Add ${ships[currentShipIndex].type} (${
        ships[currentShipIndex].length
      }) ship (${currPlayer === player1 ? "Player" : "Computer"}):`;
    }
    if (currPlayer === player2 && currentShipIndex === ships.length) {
      addShipModal.style.display = "none";
      renderGameboard(player1.gameboard, gameboardDiv1);
      renderGameboard(player2.gameboard, gameboardDiv2);
      game.style.display = "block";
      while (!player1.gameboard.allSunk() && !player2.gameboard.allSunk()) {
        moveDiv.textContent = currPlayer === player1 ? "Player" : "Computer";
        if (currPlayer === player2) {
          const [i, j] = getComputerMove();
          player1.gameboard.receiveAttack(i, j);
          if (player1.gameboard.allSunk()) {
            alert("Computer wins!");
            game.style.display = "none";
          }
          renderGameboard(player1.gameboard, gameboardDiv1);
          currPlayer = player1;
        } else {
          moveModal.style.display = "block";
          const [i, j] = await getPlayerMove();
          player2.gameboard.receiveAttack(i, j);
          if (player2.gameboard.allSunk()) {
            alert("Player wins!");
            game.style.display = "none";
          }
          currPlayer = player2;
          moveModal.style.display = "none";
          renderGameboard(player2.gameboard, gameboardDiv2);
        }
      }
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

function getAvailableComputerMoves() {
  const moves = [];
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (player1.gameboard.board[i][j] === null) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
}

function getComputerMove() {
  const moves = getAvailableComputerMoves();
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

async function getPlayerMove() {
  return new Promise((resolve) => {
    const submitButton = document.querySelector("#submit-move");
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      const row = parseInt(document.querySelector("#move-row").value) - 1;
      const col = parseInt(document.querySelector("#move-col").value) - 1;
      resolve([row, col]);
      renderGameboard(player2.gameboard, gameboardDiv2);
    });
  });
}