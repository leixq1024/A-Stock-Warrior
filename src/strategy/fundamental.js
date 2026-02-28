function filterByFundamental(stocks, config) {
  return stocks.filter(stock => {
    if (config.peMin && stock.pe < config.peMin) return false;
    if (config.peMax && stock.pe > config.peMax) return false;
    if (config.pbMax && stock.pb > config.pbMax) return false;
    if (config.roeMin && stock.roe < config.roeMin) return false;
    if (config.marketCapMin && stock.marketCap < config.marketCapMin) return false;
    if (config.marketCapMax && stock.marketCap > config.marketCapMax) return false;
    return true;
  });
}

function filterByTechnical(stocks, config) {
  return stocks.filter(stock => {
    if (config.maPeriods && config.maPeriods.length >= 3) {
      if (stock.ma5 <= stock.ma10 || stock.ma10 <= stock.ma20) {
        return false;
      }
    }
    
    if (config.momentumMin && stock.changePct < config.momentumMin) {
      return false;
    }
    
    return true;
  });
}

module.exports = {
  filterByFundamental,
  filterByTechnical
};
