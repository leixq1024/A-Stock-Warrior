const api = require('../api');

const MOCK_DATA = {
  '600519': { code: '600519', name: '贵州茅台', price: 1650.50, change: 25.30, changePct: 1.56, volume: 3245678, amount: 52.34, pe: 35.2, pb: 8.5, marketCap: 20700e8, roe: 30.5 },
  '000858': { code: '000858', name: '五粮液', price: 158.20, change: -1.50, changePct: -0.94, volume: 567890, amount: 8.92, pe: 28.5, pb: 6.2, marketCap: 6100e8, roe: 25.8 },
  '600036': { code: '600036', name: '招商银行', price: 42.50, change: 0.80, changePct: 1.92, volume: 4567890, amount: 19.23, pe: 6.8, pb: 1.2, marketCap: 10700e8, roe: 15.2 },
  '601318': { code: '601318', name: '中国平安', price: 48.30, change: 1.20, changePct: 2.55, volume: 3456789, amount: 16.54, pe: 9.5, pb: 1.1, marketCap: 8800e8, roe: 12.8 },
  '000333': { code: '000333', name: '美的集团', price: 62.80, change: 0.50, changePct: 0.80, volume: 2345678, amount: 14.65, pe: 15.2, pb: 3.5, marketCap: 4400e8, roe: 24.5 },
  '600900': { code: '600900', name: '长江电力', price: 23.50, change: 0.30, changePct: 1.29, volume: 1234567, amount: 2.89, pe: 18.5, pb: 2.8, marketCap: 5350e8, roe: 16.2 }
};

async function getStockData(codes = []) {
  const stocks = [];
  
  if (codes.length === 0) {
    console.log('未指定股票代码，请通过参数指定');
    return stocks;
  }
  
  const realCodes = [];
  const mockCodes = [];
  
  for (const code of codes) {
    if (MOCK_DATA[code]) {
      mockCodes.push(code);
    } else {
      realCodes.push(code);
    }
  }
  
  if (mockCodes.length > 0) {
    mockCodes.forEach(code => {
      stocks.push({ ...MOCK_DATA[code] });
    });
  }
  
  if (realCodes.length > 0) {
    try {
      const realStocks = await api.getStockDataByCodes(realCodes);
      stocks.push(...realStocks);
    } catch (error) {
      console.error('获取实时股票数据失败:', error.message);
    }
  }
  
  return stocks;
}

async function getStockWithFundamental(codes = []) {
  return await getStockData(codes);
}

module.exports = {
  getStockData,
  getStockWithFundamental
};
