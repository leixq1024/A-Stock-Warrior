function printStock(stock) {
  console.log('----------------------------------------');
  console.log(`代码: ${stock.code}  名称: ${stock.name}`);
  console.log(`价格: ${stock.price}  涨跌: ${stock.change} (${stock.changePct}%)`);
  console.log(`成交量: ${stock.volume}  成交额: ${stock.amount}`);
  if (stock.pe) console.log(`市盈率: ${stock.pe}`);
  if (stock.pb) console.log(`市净率: ${stock.pb}`);
  if (stock.marketCap) console.log(`总市值: ${(stock.marketCap / 1e8).toFixed(2)}亿`);
  if (stock.roe) console.log(`ROE: ${stock.roe}%`);
}

function printFund(fund) {
  console.log('----------------------------------------');
  console.log(`代码: ${fund.code}  名称: ${fund.name}`);
  console.log(`类型: ${fund.type}`);
  console.log(`规模: ${(fund.scale / 1e8).toFixed(2)}亿`);
  console.log(`单位净值: ${fund.unitNav}  累计净值: ${fund.accumNav}`);
  console.log(`日增长率: ${fund.dailyGrowth}%  年化收益: ${fund.annualReturn}%`);
  if (fund.managementFee) console.log(`管理费率: ${fund.managementFee}%`);
  if (fund.custodyFee) console.log(`托管费率: ${fund.custodyFee}%`);
}

function printResults(type, results) {
  console.log(`\n共筛选出 ${results.length} 只${type === 'stock' ? '股票' : '基金'}:\n`);
  
  if (type === 'stock') {
    results.forEach(printStock);
  } else {
    results.forEach(printFund);
  }
  
  console.log('\n========================================\n');
}

module.exports = {
  printStock,
  printFund,
  printResults
};
