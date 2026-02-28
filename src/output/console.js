const { Table, printTable } = require('console-table-printer');

function printETFTable(etfs) {
  if (etfs.length === 0) {
    console.log('  暂无符合条件的ETF\n');
    return;
  }
  
  const data = etfs.map(etf => ({
    代码: etf.code,
    名称: etf.name,
    价格: etf.price.toFixed(3),
    涨跌幅: (etf.changePct >= 0 ? '+' : '') + etf.changePct.toFixed(2) + '%',
    波段: etf.waveScore,
    趋势: etf.trend
  }));
  
  const t = new Table({
    columns: [
      { name: '代码', color: 'cyan', alignment: 'left' },
      { name: '名称', alignment: 'left' },
      { name: '价格', color: 'yellow', alignment: 'right' },
      { name: '涨跌幅', color: 'green', alignment: 'right' },
      { name: '波段', color: 'magenta', alignment: 'right' },
      { name: '趋势', color: 'blue', alignment: 'center' }
    ]
  });
  
  t.addRows(data);
  t.printTable();
  console.log('');
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
  printETFTable,
  printStockTable
};
