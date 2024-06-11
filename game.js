import { createPlayer, createGameboard } from './index.js';

const rowHeight = '1em';
const colWidth = '1em';

const player1 = createPlayer('human');
const player2 = createPlayer('human');

const renderGameboard = (gameboard, gameboardDiv) => {
    const nrRows = gameboard.nrRows;
    const nrCols = gameboard.nrCols;
    gameboardDiv.style.display = 'grid';
    gameboardDiv.style.gridTemplateRows = `repeat(${nrRows}, ${rowHeight})`;
    gameboardDiv.style.gridTemplateColumns = `repeat(${nrCols}, ${colWidth})`

    for (let i = 0; i < nrRows; i++) {
        for (let j = 0; j < nrCols; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            gameboardDiv.appendChild(square);
        }
    }
}

const gameboard1 = document.querySelector("#gameboard1");
const gameboard2 = document.querySelector("#gameboard2");

renderGameboard(player1.gameboard, gameboard1);
renderGameboard(player2.gameboard, gameboard2);