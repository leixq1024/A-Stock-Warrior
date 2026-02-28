module.exports = {
  waveStrategy: {
    // 选标的条件：周K线在60周线上方
    weekAboveMA60: true,
    
    // 买入条件
    buy: {
      // 日K线在60日线下方
      dayBelowMA60: true,
      // 回踩30周线并站稳
      backToWeekMA30: true,
      // 之前形成死叉
      deadCrossFormed: true
    },
    
    // 停止买入信号
    stopBuy: {
      // 日K线上穿30日线，减少买入
      dayCrossMA30: false,
      // 日K线上穿60日线，停止买入
      dayCrossMA60: false
    },
    
    // 卖出条件
    sell: {
      // 突破前高后首现4%大阳线
      breakHighWith4Percent: false,
      // 日K线跌破30日线
      dayBreakMA30: false
    },
    
    // 清仓信号：周K线跌破60周线
    clearPosition: {
      weekBelowMA60: false
    }
  },
  cigButtStrategy: {
    peMin: 0,
    peMax: 15,
    pbMax: 1.5,
    roeMin: 10,
    dividendYieldMin: 2,
    pbRankMax: 30
  }
};
