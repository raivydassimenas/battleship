import { createPlayer, createShip } from "./index.js";

let player = createPlayer("human");
let computer = createPlayer("computer");
const gameboardDiv1 = document.querySelector("#gameboard1");
const gameboardDiv2 = document.querySelector("#gameboard2");
let currPlayer = player;

const addShipForm = document.querySelector("#add-ship-form");
const addShipModal = document.querySelector("#add-ship-modal");
const game = document.querySelector("#game");
game.style.display = "none";
const moveModal = document.querySelector("#player-move-modal");
moveModal.style.display = "none";

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

// const moveDiv = document.querySelector("#move");
// moveDiv.textContent =
//   currPlayer === player1 ? "Player's move" : "Computer's move";

const ships = [
  { type: "carrier", length: 5 },
  { type: "battleship", length: 4 },
  { type: "cruiser", length: 3 },
  { type: "submarine", length: 3 },
  { type: "destroyer", length: 2 },
];

let currentShipIndex = 0;
const shipType = document.querySelector("#ship-type");
shipType.innerText = `Add ${ships[currentShipIndex].type} (${ships[currentShipIndex].length}) ship (Player):`;

function nextShip() {
  currentShipIndex++;
  if (currentShipIndex < ships.length) {
    shipType.innerText = `Add ${ships[currentShipIndex].type} (${ships[currentShipIndex].length}) ship (Player):`;
  } else {
    alert("All ships placed successfully!");
    // if (currPlayer === player1) {
    //   currentShipIndex = 0;
    //   currPlayer = player2;
    //   shipType.innerText = `Add ${ships[currentShipIndex].type} (${
    //     ships[currentShipIndex].length
    //   }) ship (${currPlayer === player1 ? "Player" : "Computer"}):`;
    // }
    // if (currPlayer === player2 && currentShipIndex === ships.length) {
  }
}
// }

// addShipForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   await placePlayerShips();

// const startX = parseInt(document.getElementById("col").value) - 1;
// const startY = parseInt(document.getElementById("row").value) - 1;
// const orientation =
//   document.getElementById("orientation").value === "horizontal";
// const currentShip = ships[currentShipIndex];
// shipType.innerText = `Add ${currentShip.type} (${currentShip.length}) ship:`;

// const ship = createShip(currentShip.type, currentShip.length);
// if (currPlayer.gameboard.placeShip(ship, startY, startX, orientation)) {
//   alert(`${currentShip.type} placed successfully!`);
//   nextShip();
// } else {
//   alert("Invalid placement. Try again.");
//   }
// );

function placeComputerShip(ship) {
  let placed = false;

  while (!placed) {
    let orientation = Math.random() < 0.5; // false = horizontal, true = vertical
    let startX = Math.floor(Math.random() * 20);
    let startY = Math.floor(Math.random() * 20);

    if (computer.placeShip(ship, startY, startX, orientation)) {
      placed = true;
    }

    // if (orientation == "vertical") {
    //   // Vertical
    //   if (startY + ship.size <= boardSize) {
    //     let canPlace = true;
    //     for (let i = 0; i < ship.size; i++) {
    //       if (computer.gameboard[startY + i][startX] !== 0) {
    //         canPlace = false;
    //         break;
    //       }
    //     }
    //     if (canPlace) {
    //       for (let i = 0; i < ship.size; i++) {
    //         computerBoard[startY + i][startX] = 1;
    //       }
    //       placed = true;
    //     }
    //   }
    // } else {
    //   // Horizontal
    //   if (startX + ship.size <= boardSize) {
    //     let canPlace = true;
    //     for (let i = 0; i < ship.size; i++) {
    //       if (computerBoard[startY][startX + i] !== 0) {
    //         canPlace = false;
    //         break;
    //       }
    //     }
    //     if (canPlace) {
    //       for (let i = 0; i < ship.size; i++) {
    //         computerBoard[startY][startX + i] = 1;
    //       }
    //       placed = true;
    //     }
    //   }
    // }
  }
}

function placeComputerShips() {
  for (let ship in ships) {
    placeComputerShip(ship);
  }
}

async function placePlayerShip(ship) {
  return new Promise((resolve) => {
    const submitButton = document.querySelector("#submit-ship");
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      const row = parseInt(document.querySelector("#row").value) - 1;
      const col = parseInt(document.querySelector("#col").value) - 1;
      const orientation =
        document.querySelector("#orientation").value === "horizontal";
      if (player.placeShip(ship, row, col, orientation)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function placePlayerShips() {
  addShipModal.style.display = "block";
  // const startX = parseInt(document.getElementById("col").value) - 1;
  // const startY = parseInt(document.getElementById("row").value) - 1;
  // const orientation =
  //   document.getElementById("orientation").value === "horizontal";
  // const currentShip = ships[currentShipIndex];
  // shipType.innerText = `Add ${currentShip.type} (${currentShip.length}) ship:`;

  // const ship = createShip(currentShip.type, currentShip.length);
  // if (player.gameboard.placeShip(ship, startY, startX, orientation)) {
  //   alert(`${currentShip.type} placed successfully!`);
  //   nextShip();
  // } else {
  //   alert("Invalid placement. Try again.");
  for (let ship in ships) {
    let placed = false;
    while (!placed) {
      const success = await placePlayerShip(ship);
      if (success) {
        placed = true;
      } else {
        alert("Invalid placement. Try again.");
      }
    }
  }
  addShipModal.style.display = "none";
}

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

async function playGame() {
  placeComputerShips();
  await placePlayerShips();
  renderGameboard(player.gameboard, gameboardDiv1);
  renderGameboard(computer.gameboard, gameboardDiv2);
  game.style.display = "block";
  while (!player.gameboard.allSunk() && !computer.gameboard.allSunk()) {
    if (currPlayer === computer) {
      const [i, j] = getComputerMove();
      player.gameboard.receiveAttack(i, j);
      if (player.gameboard.allSunk()) {
        alert("Computer wins!");
        game.style.display = "none";
      }
      renderGameboard(player.gameboard, gameboardDiv1);
      currPlayer = player;
    } else {
      moveModal.style.display = "block";
      const [i, j] = await getPlayerMove();
      computer.gameboard.receiveAttack(i, j);
      if (computer.gameboard.allSunk()) {
        alert("Player wins!");
        game.style.display = "none";
      }
      currPlayer = computer;
      moveModal.style.display = "none";
      renderGameboard(computer.gameboard, gameboardDiv2);
    }
  }
}

playeGame();
