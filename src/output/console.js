function printETF(etf) {
  console.log(`  ${etf.code}  ${etf.name.padEnd(12)}  ${etf.price.toFixed(3)}  ${etf.change >= 0 ? '+' : ''}${etf.changePct.toFixed(2)}%  波段:${etf.waveScore}  趋势:${etf.trend}`);
}

function printStock(stock) {
  const marketCap = stock.marketCap ? (stock.marketCap / 1e8).toFixed(0) + '亿' : '-';
  console.log(`  ${stock.code}  ${stock.name.padEnd(8)}  ${stock.price.toFixed(2)}  ${stock.change >= 0 ? '+' : ''}${stock.changePct.toFixed(2)}%  PE:${(stock.pe || '-').toString().padEnd(5)}  PB:${(stock.pb || '-').toString().padEnd(4)}  ROE:${(stock.roe || '-') + '%'}  股息:${(stock.dividendYield || '-') + '%'}  市值:${marketCap}`);
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
  if (results.length === 0) {
    console.log('  暂无符合条件的标的\n');
    return;
  }
  
  if (type === 'etf') {
    console.log('  代码      名称          价格      涨跌幅     波段  趋势');
    console.log('  ' + '─'.repeat(60));
    results.forEach(printETF);
  } else if (type === 'stock') {
    console.log('  代码     名称      价格      涨跌幅    PE    PB    ROE    股息    市值');
    console.log('  ' + '─'.repeat(80));
    results.forEach(printStock);
  } else if (type === 'fund') {
    results.forEach(printFund);
  }
  
  console.log('\n');
}

module.exports = {
  printStock,
  printETF,
  printFund,
  printResults
};
