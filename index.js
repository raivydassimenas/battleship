export const createShip = (length) => {
  return {
    length,
    timesHit: 0,
    sunk: false,
    coords: [],
    hit() {
      this.timesHit++;
      if (this.length === this.timesHit) {
        this.sunk = true;
      }
    },
    isSunk() {
      return this.sunk;
    },
  };
};

export const createGameboard = (nrRows, nrCols) => {
  return {
    nrRows,
    nrCols,
    board: Array.from({ length: nrRows }, () => new Array(nrCols).fill(null)),
    ships: [],
    placeShip(ship, topRow, topCol, horz) {
      if (
        (horz && (topRow > nrRows || topCol + ship.length > nrCols)) ||
        (!horz && (topRow + ship.length > nrRows || topCol > nrCols))
      ) {
        throw new Error("Illegal ship placement");
      }
      if (horz) {
        for (let i = 0; i < ship.length; i++) {
          if (this.board[topRow][topCol + i] !== null) {
            throw new Error("Illegal ship placement");
          }
          this.board[topRow][topCol + i] = "shipUnhit";
          ship.coords.push(JSON.stringify([topRow, topCol + i]));
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          if (this.board[topRow + i][topCol] !== null) {
            throw new Error("Illegal ship placement");
          }
          this.board[topRow + i][topCol] = "shipUnhit";
          ship.coords.push(JSON.stringify([topRow + i, topCol]));
        }
      }
      this.ships.push(ship);
    },
    receiveAttack(row, col) {
      if (this.board[row][col] === "shipUnhit") {
        this.board[row][col] = "shipHit";
        const coords = JSON.stringify([row, col]);
        this.ships.forEach((ship) => {
          if (ship.coords.some((coord) => coord === coords)) {
            ship.hit();
            if (ship.isSunk()) {
              console.log("Sunk ship!");
            }
          }
        });
      } else if (this.board[row][col] === null) {
        this.board[row][col] = "hit";
      } else {
        throw new Error("Already hit");
      }
      if (this.allSunk()) {
        console.log("All ships sunk!");
      }
    },
    allSunk() {
      return this.ships.every((ship) => ship.isSunk());
    },
  };
};

export const createPlayer = (type) => {
  return {
    type,
    gameboard: createGameboard(20, 20),
  };
}