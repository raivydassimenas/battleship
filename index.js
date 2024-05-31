const createShip = (length) => {
  return {
    length,
    timesHit: 0,
    sunk: false,
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

const createGameboard = (nrRows, nrCols) => {
  return {
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
          this.board[topRow][topCol + i] = "shipUnsunk";
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          if (this.board[topRow + i][topCol] !== null) {
            throw new Error("Illegal ship placement");
          }
          this.board[topRow + i][topCol] = "shipUnsunk";
        }
      }
      this.ships.push(ship);
    },
  };
};

module.exports = {
  createShip,
  createGameboard,
};
