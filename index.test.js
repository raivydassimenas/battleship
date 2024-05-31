const index = require("./index.js");

test("test createShip", () => {
  const ship = index.createShip(2);
  expect(ship.length).toBe(2);
  expect(ship.timesHit).toBe(0);
  ship.hit();
  expect(ship.timesHit).toBe(1);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("test createGameboard", () => {
  const gameboard = index.createGameboard(2, 2);
  expect(gameboard.board.length).toBe(2);
  expect(gameboard.board[0].length).toBe(2);
  const ship = index.createShip(1);
  gameboard.placeShip(ship, 0, 0, true);
  expect(gameboard.board[0][0]).toBe("shipUnsunk");
  expect(gameboard.board[1][0]).toBe(null);
});
