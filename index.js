const createShip = (length) => {
  return {
    length,
    timesHit,
    sunk,
    hit: () => timesHit++,
    isSunk: () => length == timesHit,
  };
};

module.exports = {
  createShip,
};
