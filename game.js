import {createPlayer, createShip} from "./index.js";

let player = createPlayer("human");
let computer = createPlayer("computer");
const gameboardDiv1 = document.querySelector("#gameboard1");
const gameboardDiv2 = document.querySelector("#gameboard2");
let currPlayer = player;

const addShipModal = document.querySelector("#add-ship-modal");
const submitShipButton = document.querySelector("#submit-ship");
const game = document.querySelector("#game");
game.style.display = "none";
const moveModal = document.querySelector("#player-move-modal");
moveModal.style.display = "none";
const shipType = document.querySelector("#ship-type");

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

const ships = [
    {type: "carrier", length: 5},
    {type: "battleship", length: 4},
    {type: "cruiser", length: 3},
    {type: "submarine", length: 3},
    {type: "destroyer", length: 2},
];

let currentShipIndex = 0;

shipType.innerText = `Add ${ships[currentShipIndex].type} (${ships[currentShipIndex].length}) ship (Player):`;


function placeComputerShip(ship) {
    let placed = false;

    while (!placed) {
        const orientation = Math.random() < 0.5; // false = horizontal, true = vertical
        const topCol = Math.floor(Math.random() * 20);
        const topRow = Math.floor(Math.random() * 20);
        const createdShip = createShip(ship.type, ship.length);

        if (
            computer.gameboard.placeShip(createdShip, topRow, topCol, orientation)
        ) {
            placed = true;
            console.log(
                `Placed ${ship.type} at ${topRow}, ${topCol} (${orientation})`
            );
        }
    }
}

function placeComputerShips() {
    ships.forEach((ship) => {
        placeComputerShip(ship);
    });
}


async function placePlayerShip(ship) {
    return new Promise((resolve) => {
        submitShipButton.onclick = (event) => handleClick(event, ship);

        async function handleClick(event, ship) {
            event.preventDefault();
            let row = parseInt(document.querySelector("#row").value) - 1;
            let col = parseInt(document.querySelector("#col").value) - 1;
            let orientation =
                document.querySelector("#orientation").value === "horizontal";
            let createdShip = createShip(ship.type, ship.length);
            if (!player.gameboard.placeShip(createdShip, row, col, orientation)) {
                alert("Invalid placement. Try again.");
                submitShipButton.onclick = null;
                await placePlayerShip(ship);
            }

            submitShipButton.onclick = null;
            resolve(true);
        }
    });
}


async function placePlayerShips() {
    addShipModal.style.display = "block";
    for (let ship of ships) {
        shipType.innerText = `Add ${ship.type} (${ship.length}) ship:`;
        await placePlayerShip(ship);
        alert(`${ship.type} placed successfully!`);
    }
    addShipModal.style.display = "none";
}

function getAvailableComputerMoves() {
    const moves = [];
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if (player.gameboard.board[i][j] === null) {
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
            renderGameboard(computer.gameboard, gameboardDiv2);
        });
    });
}

async function playGame() {
    placeComputerShips();
    await placePlayerShips();
    alert("All ships placed successfully!");
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

await playGame();