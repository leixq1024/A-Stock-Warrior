const { Table } = require('console-table-printer');

function printWaveETFTable(etfs) {
  if (etfs.length === 0) {
    console.log('  暂无符合条件的ETF\n');
    return;
  }
  
  const data = etfs.map(etf => ({
    代码: etf.code,
    名称: etf.name,
    价格: etf.price.toFixed(3),
    涨跌: (etf.changePct >= 0 ? '+' : '') + etf.changePct.toFixed(2) + '%',
    建议: getBuySuggestion(etf),
    状态: getStatus(etf)
  }));
  
  const t = new Table({
    columns: [
      { name: '代码', color: 'cyan', alignment: 'left' },
      { name: '名称', alignment: 'left' },
      { name: '价格', color: 'yellow', alignment: 'right' },
      { name: '涨跌', color: 'green', alignment: 'right' },
      { name: '建议', color: 'magenta', alignment: 'center' },
      { name: '状态', color: 'blue', alignment: 'center' }
    ]
  });
  
  t.addRows(data);
  t.printTable();
  console.log('');
}

function getBuySuggestion(etf) {
  if (!etf.kdjJ) return '-';
  if (etf.kdjJ > 20) {
    return '小幅';
  } else if (etf.kdjJ >= 0) {
    return '普通';
  } else {
    return '大幅/满仓';
  }
}

function getStatus(etf) {
  if (etf.breakHighWith4Percent && !etf.dayBreakMA30) {
    return '⚠️顶部';
  }
  if (etf.dayBreakMA30) {
    return '🔴卖出';
  }
  if (etf.dayCrossMA60) {
    return '⏹️停买';
  }
  if (etf.dayCrossMA30) {
    return '⚡少买';
  }
  return '✅买入';
}

function printStockTable(stocks) {
  if (stocks.length === 0) {
    console.log('  暂无符合条件的股票\n');
    return;
  }
  
  const data = stocks.map(stock => ({
    代码: stock.code,
    名称: stock.name,
    价格: stock.price.toFixed(2),
    涨跌幅: (stock.changePct >= 0 ? '+' : '') + stock.changePct.toFixed(2) + '%',
    PE: stock.pe?.toFixed(1) || '-',
    PB: stock.pb?.toFixed(2) || '-',
    ROE: (stock.roe || '-') + '%',
    股息: (stock.dividendYield || '-') + '%',
    市值: stock.marketCap ? (stock.marketCap / 1e8).toFixed(0) + '亿' : '-'
  }));
  
  const t = new Table({
    columns: [
      { name: '代码', color: 'cyan', alignment: 'left' },
      { name: '名称', alignment: 'left' },
      { name: '价格', color: 'yellow', alignment: 'right' },
      { name: '涨跌幅', color: 'green', alignment: 'right' },
      { name: 'PE', alignment: 'right' },
      { name: 'PB', alignment: 'right' },
      { name: 'ROE', alignment: 'right' },
      { name: '股息', alignment: 'right' },
      { name: '市值', alignment: 'right' }
    ]
  });
  
  t.addRows(data);
  t.printTable();
  console.log('');
}

module.exports = {
  printWaveETFTable,
  printStockTable
};
