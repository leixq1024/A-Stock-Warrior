const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const http = require('http');
const https = require('https');

const BASE_URL = 'http://quote.eastmoney.com';

async function request(url, options = {}) {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        ...options
      });
      return response.data;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error(`请求失败: ${url}`, error.message);
        throw error;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function parseSinaStockData(data) {
  const lines = data.split(';\n');
  const results = [];
  
  for (const line of lines) {
    const match = line.match(/var hq_str_(sh\d+|sz\d+|us\w+)="([^"]+)"/);
    if (!match) continue;
    
    const code = match[1];
    const fields = match[2].split(',');
    
    if (fields.length < 10) continue;
    
    const name = fields[0];
    const open = parseFloat(fields[1]) || 0;
    const preClose = parseFloat(fields[2]) || 0;
    const price = parseFloat(fields[3]) || 0;
    const high = parseFloat(fields[4]) || 0;
    const low = parseFloat(fields[5]) || 0;
    const volume = parseFloat(fields[8]) || 0;
    const amount = parseFloat(fields[9]) || 0;
    
    const change = price - preClose;
    const changePct = preClose > 0 ? (change / preClose) * 100 : 0;
    
    let fullCode = code;
    if (code.startsWith('sh')) fullCode = code.substring(2);
    else if (code.startsWith('sz')) fullCode = code.substring(2);
    
    results.push({
      code: fullCode,
      name,
      price,
      change,
      changePct,
      open,
      high,
      low,
      preClose,
      volume,
      amount
    });
  }
  
  return results;
}

async function getStockQuote(code) {
  return new Promise((resolve, reject) => {
    const sinaCode = code.startsWith('6') ? `sh${code}` : `sz${code}`;
    const url = `https://hq.sinajs.cn/list=${sinaCode}`;
    
    const req = https.get(url, {
      headers: {
        'Referer': 'http://finance.sina.com.cn/',
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        try {
          const buf = Buffer.concat(data);
          const str = iconv.decode(buf, 'GB18030');
          const stocks = parseSinaStockData(str);
          resolve(stocks[0] || null);
        } catch (error) {
          console.error('解析股票数据失败:', error.message);
          resolve(null);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('获取股票数据失败:', error.message);
      resolve(null);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function getStockDataByCodes(codes) {
  if (!codes || codes.length === 0) return [];
  
  return new Promise((resolve, reject) => {
    const sinaCodes = codes.map(code => 
      code.startsWith('6') ? `sh${code}` : `sz${code}`
    );
    
    const url = `https://hq.sinajs.cn/list=${sinaCodes.join(',')}`;
    
    const req = https.get(url, {
      headers: {
        'Referer': 'http://finance.sina.com.cn/',
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        try {
          const buf = Buffer.concat(data);
          const str = iconv.decode(buf, 'GB18030');
          const stocks = parseSinaStockData(str);
          resolve(stocks);
        } catch (error) {
          console.error('解析股票数据失败:', error.message);
          resolve([]);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('获取股票数据失败:', error.message);
      resolve([]);
    });
  });
}

async function getFundList(type = '股票型') {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const url = 'http://fund.eastmoney.com/js/fundcode_search.js';
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const match = data.match(/var r = (\[[\s\S]*\]);/);
          if (!match) {
            resolve([]);
            return;
          }
          
          const funds = JSON.parse(match[1]);
          const typeMap = {
            '股票型': ['股票型'],
            '混合型': ['混合型'],
            '指数型': ['指数型'],
            '债券型': ['债券型']
          };
          
          const filteredFunds = funds
            .filter(item => {
              if (type === '全部') return true;
              const fundType = item[3];
              return fundType && fundType.includes(type.split('-')[0]);
            })
            .slice(0, 50)
            .map(item => ({
              code: item[0],
              name: item[2],
              type: item[3]
            }));
          
          resolve(filteredFunds);
        } catch (error) {
          console.error('解析基金列表失败:', error.message);
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.error('获取基金列表失败:', error.message);
      resolve([]);
    });
  });
}

async function getFundDetailsByCodes(codes) {
  if (!codes || codes.length === 0) return [];
  
  const validCodes = codes.filter(c => c && c.length > 0);
  if (validCodes.length === 0) return [];
  
  const url = 'https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo';
  const params = {
    pageIndex: 1,
    pageSize: validCodes.length,
    plat: 'Android',
    appType: 'ttjj',
    product: 'EFund',
    version: '1',
    deviceid: 'test',
    Fcodes: validCodes.join(',')
  };
  
  try {
    const response = await axios.get(url, { params, timeout: 15000 });
    if (response.data && response.data.Datas) {
      return response.data.Datas.map(item => ({
        code: item.FCODE,
        name: item.SHORTNAME || item.NAME,
        type: item.FUNDTYPE || '',
        unitNav: parseFloat(item.NAV) || 0,
        accumNav: parseFloat(item.ACCNAV) || 0,
        dailyGrowth: parseFloat(item.NAVCHGRT) || 0
      }));
    }
  } catch (error) {
    console.error('获取基金详情失败:', error.message);
  }
  
  return [];
}

async function getFundDetail(code) {
  const url = `https://fund.eastmoney.com/${code}.html`;
  
  try {
    const response = await request(url);
    const $ = cheerio.load(response);
    
    const result = { code };
    
    $('.infoOfFund tr').each((trIndex, tr) => {
      $(tr).find('td').each((tdIndex, td) => {
        const text = $(td).text();
        if (text.includes('基金规模')) {
          const match = text.match(/基金规模：(.*)/);
          if (match) result.scale = match[1];
        }
        if (text.includes('基金经理')) {
          const match = text.match(/基金经理：(.*)/);
          if (match) result.manager = match[1];
        }
      });
    });
    
    const navData = $('.dataOfFund');
    if (navData.length) {
      result.latest1m = navData.find('.dataItem01 dd:nth-child(3) span').text();
      result.latest3m = navData.find('.dataItem02 dd:nth-child(3) span').text();
      result.latest6m = navData.find('.dataItem03 dd:nth-child(3) span').text();
      result.latest12m = navData.find('.dataItem01 dd:nth-child(4) span').text();
    }
    
    return result;
  } catch (error) {
    console.error(`获取基金 ${code} 详情失败`);
    return { code };
  }
}

async function getFundRank(type = '股票型', sort = 'rzdf') {
  const typeMap = {
    '股票型': 'gp',
    '混合型': 'hh',
    '指数型': 'zs',
    '债券型': 'zq'
  };
  
  const url = 'https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo';
  const params = {
    pageIndex: 1,
    pageSize: 50,
    plat: 'Android',
    appType: 'ttjj',
    product: 'EFund',
    version: '1.0.0',
    deviceid: 'test',
    Fcodes: ''
  };
  
  try {
    const response = await axios.get(url, { params, timeout: 15000 });
    if (response.data && response.data.Datas) {
      return response.data.Datas.map(item => ({
        code: item.FCODE,
        name: item.NAME,
        type: item.FUNDTYPE || type,
        scale: item.MARKETVALUE || 0,
        unitNav: parseFloat(item.NAV),
        accumNav: parseFloat(item.ACCNAV),
        dailyGrowth: parseFloat(item.DAYGrowth || 0),
        annualReturn: parseFloat(item.Yield || 0),
        managementFee: parseFloat(item.MANAGEFEE || 0),
        custodyFee: parseFloat(item.CUSTODYFEE || 0)
      }));
    }
  } catch (error) {
    console.error('获取基金排行失败:', error.message);
  }
  
  return [];
}

module.exports = {
  getStockQuote,
  getStockDataByCodes,
  getFundList,
  getFundDetail,
  getFundDetailsByCodes
};
