const config = require('./config');
const output = require('./output/console');
const api = require('./api');

function filterByWaveStrategy(etfs, config) {
  const c = config.waveStrategy;
  
  return etfs.filter(etf => {
    if (!etf) return false;
    
    if (c.weekAboveMA60 && etf.weekAboveMA60 === false) return false;
    if (c.weekAboveMA60 && etf.weekAboveMA60 === null) return false;
    
    if (c.buy.dayBelowMA60 && etf.dayBelowMA60 === false) return false;
    if (c.buy.dayBelowMA60 && etf.dayBelowMA60 === null) return false;
    
    if (c.buy.backToWeekMA30 && etf.backToWeekMA30 === false) return false;
    
    if (etf.dayCrossMA30) return false;
    if (etf.dayCrossMA60) return false;
    
    return true;
  });
}

async function analyze(code) {
  console.log(`\n分析 ${code}...`);
  
  try {
    const indicators = await api.getETFWaveIndicators(code);
    
    if (!indicators) {
      console.log(`  ❌ 无法获取数据\n`);
      return null;
    }
    
    console.log(`  名称: ${indicators.name}`);
    console.log(`  价格: ${indicators.price} (${(indicators.changePct || 0).toFixed(2)}%)`);
    console.log(`  ─────────────────`);
    console.log(`  周线在60周线上方: ${indicators.weekAboveMA60 === true ? '✅' : indicators.weekAboveMA60 === false ? '❌' : '⚠️'}`);
    console.log(`  日线在60日线下方: ${indicators.dayBelowMA60 === true ? '✅' : indicators.dayBelowMA60 === false ? '❌' : '⚠️'}`);
    console.log(`  回踩30周线2%内: ${indicators.backToWeekMA30 === true ? '✅' : indicators.backToWeekMA30 === false ? '❌' : '⚠️'}`);
    console.log(`  ─────────────────`);
    console.log(`  dayMA30: ${indicators.dayMA30?.toFixed(3)}`);
    console.log(`  dayMA60: ${indicators.dayMA60?.toFixed(3)}`);
    console.log(`  weekMA30: ${indicators.weekMA30?.toFixed(3)}`);
    console.log(`  weekMA60: ${indicators.weekMA60?.toFixed(3)}`);
    console.log(`  ─────────────────`);
    console.log(`  KDJ.J: ${indicators.kdjJ?.toFixed(1)}`);
    console.log(`  建议: ${getBuySuggestion(indicators)}`);
    console.log(`  状态: ${getStatus(indicators)}`);
    console.log('');
    
    return indicators;
  } catch (e) {
    console.log(`  ❌ 错误: ${e.message}\n`);
    return null;
  }
}

function getBuySuggestion(etf) {
  if (!etf.kdjJ) return '-';
  if (etf.kdjJ > 20) return '小幅买入';
  if (etf.kdjJ >= 0) return '普通买入';
  return '大幅/满仓';
}

function getStatus(etf) {
  if (etf.dayCrossMA60) return '⏹️停买';
  if (etf.dayCrossMA30) return '⚡少买';
  return '✅买入';
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('用法: node src/index.js <ETF代码1> <ETF代码2> ...');
    console.log('示例: node src/index.js 510300 510500 512880 515120 588000');
    return;
  }
  
  console.log('\n\x1b[36m╔════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║\x1b[0m    \x1b[1;32mA-Stock-Warrior\x1b[0m 大A战士 v1.0      \x1b[36m║\x1b[0m');
  console.log('\x1b[36m╚════════════════════════════════════════╝\x1b[0m');
  
  console.log('\n\x1b[33m📊 波段心法策略分析\x1b[0m');
  
  const results = [];
  for (const code of args) {
    const result = await analyze(code);
    if (result) {
      results.push(result);
    }
  }
  
  const filtered = filterByWaveStrategy(results, config);
  
  console.log('\n\x1b[90m──────────────────────────────────────────────────\x1b[0m');
  
  if (filtered.length > 0) {
    console.log('\n\x1b[32m✅ 符合买入条件的ETF:\x1b[0m');
    output.printWaveETFTable(filtered);
  } else {
    console.log('\n\x1b[33m⚠️ 没有符合条件的ETF\x1b[0m');
  }
  
  console.log('\n');
}

main().catch(console.error);
