module.exports = {
  stock: {
    fundamental: {
      peMax: 50,
      peMin: 0,
      pbMax: 10,
      roeMin: 10,
      marketCapMin: 0,
      marketCapMax: 1e14
    },
    technical: {
      maPeriods: [5, 10, 20],
      momentumDays: 20,
      momentumMin: -10,
      volumeRatio: 0.5
    }
  },
  fund: {
    type: ['股票型', '混合型', '指数型'],
    scaleMin: 0,
    performanceMin: -50
  }
};
