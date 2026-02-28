function filterByMomentum(stocks, days = 20, minReturn = 0) {
  return stocks.filter(stock => {
    const momentum = stock.cumulativeReturn || stock.changePct;
    return momentum >= minReturn;
  });
}

function filterByVolume(stocks, ratio = 1.5) {
  return stocks.filter(stock => {
    return stock.volumeRatio >= ratio;
  });
}

function checkMAMultiline(stock, periods = [5, 10, 20]) {
  const maValues = periods.map(p => stock[`ma${p}`]);
  return maValues[0] > maValues[1] && maValues[1] > maValues[2];
}

module.exports = {
  filterByMomentum,
  filterByVolume,
  checkMAMultiline
};
