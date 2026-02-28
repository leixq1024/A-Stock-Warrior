const api = require('../api');

async function getFundData(type = '股票型') {
  const funds = await api.getFundList(type);
  
  if (funds.length === 0) return [];
  
  const codes = funds.slice(0, 20).map(f => f.code);
  const details = await api.getFundDetailsByCodes(codes);
  
  const detailMap = {};
  details.forEach(d => {
    detailMap[d.code] = d;
  });
  
  return funds.map(f => {
    const detail = detailMap[f.code];
    return {
      ...f,
      unitNav: detail ? detail.unitNav : f.unitNav || 0,
      accumNav: detail ? detail.accumNav : f.accumNav || 0,
      dailyGrowth: detail ? detail.dailyGrowth : f.dailyGrowth || 0,
      name: detail && detail.name ? detail.name : f.name
    };
  });
}

async function getFundDetails(codes = []) {
  if (codes.length === 0) return [];
  return await api.getFundDetailsByCodes(codes);
}

module.exports = {
  getFundData,
  getFundDetails
};
