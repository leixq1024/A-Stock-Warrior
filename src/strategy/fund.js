function filterFunds(funds, config) {
  return funds.filter(fund => {
    if (config.type && config.type.length > 0) {
      const fundTypeStr = typeof fund.type === 'string' ? fund.type : '';
      const match = config.type.some(t => fundTypeStr.includes(t));
      if (!match) return false;
    }
    
    if (config.scaleMin && fund.scale < config.scaleMin) {
      return false;
    }
    
    if (config.performanceMin && fund.annualReturn < config.performanceMin) {
      return false;
    }
    
    return true;
  });
}

function sortFunds(funds, by = 'annualReturn', desc = true) {
  return funds.sort((a, b) => {
    return desc ? b[by] - a[by] : a[by] - b[by];
  });
}

module.exports = {
  filterFunds,
  sortFunds
};
