import { createPlayer, createGameboard } from './index.js';

const rowHeight = '1em';
const colWidth = '1em';

const player1 = createPlayer('human');
const player2 = createPlayer('human');

let move = 'Player 1';

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

const placeShips = (ships, player) => {
    for (let ship in ships) {

    }
}


const gameboardDiv1 = document.querySelector("#gameboard1");
const gameboardDiv2 = document.querySelector("#gameboard2");
const moveDiv = document.querySelector('#move');
moveDiv.textContent = move;

renderGameboard(player1.gameboard, gameboardDiv1);
renderGameboard(player2.gameboard, gameboardDiv2);

const addShipForm = document.querySelector('#add-ship-form');
addShipForm.addEventListener('submit', e => {
    e.preventDefault();
    const shipType = addShipForm.querySelector('#ship-type').value;
    const shipTopRow = parseInt(addShipForm.querySelector('#row').value);
    const shipTopCol = parseInt(addShipForm.querySelector('#col').value);
    const shipHorz = addShipForm.querySelector('#orientation').value === 'horizontal';
    try {
        player1.gameboard.placeShip(shipType, shipTopRow, shipTopCol, shipHorz);
        gameboardDiv1.innerHTML = '';
        renderGameboard(player1.gameboard, gameboardDiv1);
    } catch (e) {
        alert(e);
    }
});