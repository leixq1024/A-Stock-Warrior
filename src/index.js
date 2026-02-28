const config = require('./config');
const output = require('./output/console');

const MOCK_ETF_DATA = [
  { code: '510300', name: '沪深300ETF', price: 3.856, change: 0.015, changePct: 0.39, volume: 18567432, amount: 7.15, pe: 12.5, pb: 1.32, waveScore: 85, trend: '上升' },
  { code: '510500', name: '500ETF', price: 5.672, change: -0.023, changePct: -0.40, volume: 8932451, amount: 5.06, pe: 18.2, pb: 1.65, waveScore: 72, trend: '震荡' },
  { code: '159919', name: '券商ETF', price: 1.245, change: 0.038, changePct: 3.15, volume: 45678234, amount: 5.68, pe: 22.5, pb: 1.89, waveScore: 92, trend: '上升' },
  { code: '159995', name: '券商ETF', price: 1.123, change: 0.025, changePct: 2.28, volume: 32456789, amount: 3.64, pe: 20.8, pb: 1.75, waveScore: 88, trend: '上升' },
  { code: '512880', name: '证券ETF', price: 1.567, change: 0.042, changePct: 2.75, volume: 28945678, amount: 4.53, pe: 21.3, pb: 1.82, waveScore: 90, trend: '上升' },
  { code: '159941', name: '纳指ETF', price: 2.345, change: -0.015, changePct: -0.64, volume: 12345678, amount: 2.89, pe: 28.5, pb: 3.2, waveScore: 65, trend: '下跌' },
  { code: '513050', name: '中概互联网ETF', price: 1.023, change: 0.008, changePct: 0.79, volume: 9876543, amount: 1.01, pe: 32.1, pb: 2.8, waveScore: 58, trend: '震荡' },
  { code: '159920', name: '香港ETF', price: 2.156, change: 0.056, changePct: 2.67, volume: 15678234, amount: 3.38, pe: 15.6, pb: 1.45, waveScore: 82, trend: '上升' },
  { code: '510500', name: '中证500ETF', price: 5.892, change: 0.034, changePct: 0.58, volume: 7654321, amount: 4.51, pe: 17.8, pb: 1.58, waveScore: 78, trend: '上升' },
  { code: '159808', name: '创业板50ETF', price: 0.987, change: -0.012, changePct: -1.20, volume: 21345678, amount: 2.11, pe: 35.2, pb: 4.5, waveScore: 45, trend: '下跌' }
];

const MOCK_STOCK_DATA = [
  { code: '600519', name: '贵州茅台', price: 1650.50, change: 25.30, changePct: 1.56, volume: 3245678, amount: 52.34, pe: 35.2, pb: 8.5, marketCap: 20700e8, roe: 30.5, dividendYield: 1.2, pbRank: 15 },
  { code: '601318', name: '中国平安', price: 48.30, change: 1.20, changePct: 2.55, volume: 3456789, amount: 16.54, pe: 9.5, pb: 1.1, marketCap: 8800e8, roe: 12.8, dividendYield: 3.5, pbRank: 5 },
  { code: '600036', name: '招商银行', price: 42.50, change: 0.80, changePct: 1.92, volume: 4567890, amount: 19.23, pe: 6.8, pb: 1.2, marketCap: 10700e8, roe: 15.2, dividendYield: 3.2, pbRank: 8 },
  { code: '000858', name: '五粮液', price: 158.20, change: -1.50, changePct: -0.94, volume: 567890, amount: 8.92, pe: 28.5, pb: 6.2, marketCap: 6100e8, roe: 25.8, dividendYield: 1.8, pbRank: 25 },
  { code: '600900', name: '长江电力', price: 23.50, change: 0.30, changePct: 1.29, volume: 1234567, amount: 2.89, pe: 18.5, pb: 2.8, marketCap: 5350e8, roe: 16.2, dividendYield: 3.8, pbRank: 35 },
  { code: '000333', name: '美的集团', price: 62.80, change: 0.50, changePct: 0.80, volume: 2345678, amount: 14.65, pe: 15.2, pb: 3.5, marketCap: 4400e8, roe: 24.5, dividendYield: 3.0, pbRank: 28 },
  { code: '601398', name: '工商银行', price: 5.12, change: 0.02, changePct: 0.39, volume: 23456789, amount: 12.01, pe: 4.8, pb: 0.65, marketCap: 18200e8, roe: 11.2, dividendYield: 5.2, pbRank: 3 },
  { code: '600028', name: '中国石化', price: 5.68, change: 0.08, changePct: 1.43, volume: 45678901, amount: 25.93, pe: 8.2, pb: 0.85, marketCap: 6850e8, roe: 9.5, dividendYield: 6.5, pbRank: 4 },
  { code: '601288', name: '农业银行', price: 2.89, change: 0.01, changePct: 0.35, volume: 56789012, amount: 16.41, pe: 4.2, pb: 0.55, marketCap: 10100e8, roe: 10.5, dividendYield: 6.8, pbRank: 2 },
  { code: '601988', name: '中国银行', price: 3.12, change: 0.02, changePct: 0.65, volume: 34567890, amount: 10.78, pe: 4.5, pb: 0.58, marketCap: 9150e8, roe: 10.8, dividendYield: 5.5, pbRank: 3 },
  { code: '600030', name: '中信证券', price: 19.85, change: 0.45, changePct: 2.32, volume: 12345678, amount: 24.50, pe: 15.8, pb: 1.45, marketCap: 2950e8, roe: 8.5, dividendYield: 2.8, pbRank: 18 },
  { code: '000001', name: '平安银行', price: 10.90, change: 0.03, changePct: 0.28, volume: 61222796, amount: 6.66, pe: 5.2, pb: 0.72, marketCap: 2110e8, roe: 11.5, dividendYield: 4.2, pbRank: 6 }
];

function filterByWaveStrategy(etfs, config) {
  return etfs.filter(etf => {
    if (etf.waveScore >= config.waveScoreMin) return false;
    if (etf.trend === '下跌') return false;
    return true;
  });
}

function filterByCigButtStrategy(stocks, config) {
  return stocks.filter(stock => {
    if (stock.pe < config.peMin || stock.pe > config.peMax) return false;
    if (stock.pb > config.pbMax) return false;
    if (stock.roe < config.roeMin) return false;
    if (stock.dividendYield < config.dividendYieldMin) return false;
    if (stock.pbRank > config.pbRankMax) return false;
    return true;
  });
}

async function main() {
  console.log('\n\x1b[36m╔════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║\x1b[0m    \x1b[1;32mA-Stock-Warrior\x1b[0m 大A战士 v1.0      \x1b[36m║\x1b[0m');
  console.log('\x1b[36m╚════════════════════════════════════════╝\x1b[0m\n');
  
  console.log('\x1b[33m📊 波段心法策略 - ETF筛选\x1b[0m');
  const waveFiltered = filterByWaveStrategy(MOCK_ETF_DATA, config.waveStrategy);
  output.printETFTable(waveFiltered);
  
  console.log('\x1b[33m📊 捡烟蒂策略 - 股票筛选\x1b[0m');
  const cigButtFiltered = filterByCigButtStrategy(MOCK_STOCK_DATA, config.cigButtStrategy);
  output.printStockTable(cigButtFiltered);
  
  console.log('\x1b[90m──────────────────────────────────────────────────\x1b[0m');
  console.log(`\x1b[35m📈 共筛选 ETF: ${waveFiltered.length} 只 | 股票: ${cigButtFiltered.length} 只\x1b[0m\n`);
}

main().catch(console.error);
