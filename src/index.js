const config = require('./config');
const stockData = require('./data/stock');
const fundData = require('./data/fund');
const strategy = require('./strategy');
const output = require('./output/console');

async function runStockStrategy(codes) {
  console.log('开始获取股票数据...\n');
  
  const stocks = await stockData.getStockData(codes);
  
  if (stocks.length === 0) {
    console.log('未能获取到股票数据');
    return;
  }
  
  console.log(`获取到 ${stocks.length} 只股票`);
  console.log('开始执行策略筛选...\n');
  
  const fundamentalFiltered = strategy.fundamental.filterByFundamental(
    stocks,
    config.stock.fundamental
  );
  
  const technicalFiltered = strategy.technical.filterByMomentum(
    fundamentalFiltered,
    config.stock.technical.momentumDays,
    config.stock.technical.momentumMin
  );
  
  output.printResults('stock', technicalFiltered);
}

async function runFundStrategy(type = '股票型') {
  console.log(`开始获取${type}基金数据...\n`);
  
  const funds = await fundData.getFundData(type);
  
  if (funds.length === 0) {
    console.log('未能获取到基金数据');
    return;
  }
  
  console.log(`获取到 ${funds.length} 只基金`);
  console.log('开始执行筛选...\n');
  
  const filtered = strategy.fund.filterFunds(funds, config.fund);
  const sorted = strategy.fund.sortFunds(filtered, 'annualReturn', true);
  
  output.printResults('fund', sorted);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'stock') {
    const codes = args.slice(1);
    await runStockStrategy(codes);
  } else if (command === 'fund') {
    const type = args[1] || '股票型';
    await runFundStrategy(type);
  } else {
    console.log(`
量化选股系统
用法:
  node src/index.js stock <股票代码...>  - 分析股票
  node src/index.js fund [基金类型]       - 筛选基金

基金类型: 股票型, 混合型, 指数型

示例:
  node src/index.js stock 600519 000858
  node src/index.js fund 混合型
    `.trim());
  }
}

main().catch(console.error);
