import { createShip, createGameboard, createPlayer } from './index.js';

test("test createShip", () => {
  const ship = createShip(2);
  expect(ship.length).toBe(2);
  expect(ship.timesHit).toBe(0);
  ship.hit();
  expect(ship.timesHit).toBe(1);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("test createGameboard", () => {
  const gameboard = createGameboard(2, 2);
  expect(gameboard.board.length).toBe(2);
  expect(gameboard.board[0].length).toBe(2);
  const ship = createShip(1);
  gameboard.placeShip(ship, 0, 0, true);
  expect(gameboard.board[0][0]).toBe("shipUnhit");
  expect(gameboard.board[1][0]).toBe(null);
});

test("test receiveAttack", () => {
  const gameboard = createGameboard(2, 2);
  const ship = createShip(1);
  gameboard.placeShip(ship, 0, 0, true);
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  expect(gameboard.board[0][0]).toBe("shipHit");
  expect(ship.isSunk()).toBe(true);``
  expect(gameboard.board[1][0]).toBe("hit");
  expect(gameboard.allSunk()).toBe(true);
});
