import axios from 'axios'

const randHeader = () => {
  const head_connection = ['Keep-Alive', 'close']
  const head_accept = ['text/html, application/xhtml+xml, */*']
  const head_accept_language = [
    'zh-CN,fr-FR;q=0.5',
    'en-US,en;q=0.8,zh-Hans-CN;q=0.5,zh-Hans;q=0.3'
  ]
  const head_user_agent = [
    'Opera/8.0 (Macintosh; PPC Mac OS X; U; en)',
    'Opera/9.27 (Windows NT 5.2; U; zh-cn)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)',
    'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko'
  ]
  return {
    Connection: head_connection[0],
    Accept: head_accept[0],
    'Accept-Language': head_accept_language[1],
    'User-Agent': head_user_agent[Math.floor(Math.random() * head_user_agent.length)]
  }
}

function parseSinaStockData(data) {
  if (!data) return []
  const lines = data.split(';\n')
  const results = []

  for (const line of lines) {
    const match = line.match(/var hq_str_(sh\d+|sz\d+|us\w+)="([^"]+)"/)
    if (!match) continue

    const code = match[1]
    const fields = match[2].split(',')

    if (fields.length < 10) continue

    const name = fields[0]
    const open = parseFloat(fields[1]) || 0
    const preClose = parseFloat(fields[2]) || 0
    const price = parseFloat(fields[3]) || 0
    const high = parseFloat(fields[4]) || 0
    const low = parseFloat(fields[5]) || 0
    const volume = parseFloat(fields[8]) || 0
    const amount = parseFloat(fields[9]) || 0

    const change = price - preClose
    const changePct = preClose > 0 ? (change / preClose) * 100 : 0

    let fullCode = code
    if (code.startsWith('sh')) fullCode = code.substring(2)
    else if (code.startsWith('sz')) fullCode = code.substring(2)

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
    })
  }

  return results
}

async function httpGet(url, headers = {}) {
  try {
    const response = await axios.get(url, {
      headers: { ...randHeader(), ...headers },
      responseType: 'arraybuffer',
      timeout: 10000
    })
    const Buffer = require('buffer').Buffer
    const result = Buffer.from(response.data, 'binary').toString('GB18030')
    return result
  } catch (e) {
    throw new Error(e.message)
  }
}

export async function getStockQuote(code) {
  try {
    let sinaCode
    if (code.startsWith('6') || code.startsWith('5')) {
      sinaCode = `sh${code}`
    } else {
      sinaCode = `sz${code}`
    }
    const url = `https://hq.sinajs.cn/list=${sinaCode}`

    const str = await httpGet(url, {
      Referer: 'http://finance.sina.com.cn/'
    })
    const stocks = parseSinaStockData(str)
    return stocks[0] || null
  } catch (e) {
    console.log(`获取行情失败 ${code}:`, e.message)
    return null
  }
}

export async function getStockDataByCodes(codes) {
  if (!codes || codes.length === 0) return []

  try {
    const sinaCodes = codes.map((code) => {
      if (code.startsWith('6') || code.startsWith('5')) {
        return `sh${code}`
      }
      return `sz${code}`
    })

    const url = `https://hq.sinajs.cn/list=${sinaCodes.join(',')}`
    const str = await httpGet(url, {
      Referer: 'http://finance.sina.com.cn/'
    })
    return parseSinaStockData(str)
  } catch {
    return []
  }
}

export async function getKLineData(code, days = 500) {
  try {
    let tencentCode
    if (code.startsWith('6') || code.startsWith('5')) {
      tencentCode = `sh${code}`
    } else {
      tencentCode = `sz${code}`
    }
    const url = `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${tencentCode},day,,,${days},qr`

    const str = await httpGet(url, {
      Referer: 'https://finance.sina.com.cn/'
    })

    const data = JSON.parse(str)

    if (data.data && data.data[tencentCode] && data.data[tencentCode].day) {
      const klines = data.data[tencentCode].day
      return klines.map((k) => ({
        time: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5])
      }))
    }
    return []
  } catch (e) {
    console.log(`获取K线失败 ${code}:`, e.message)
    return []
  }
}

function calculateMA(data, period) {
  if (data.length < period) return null
  const sum = data.slice(-period).reduce((a, b) => a + b, 0)
  return sum / period
}

function calculateKDJ(data, period = 9) {
  if (data.length < period) return null

  const rsv = []
  for (let i = period - 1; i < data.length; i++) {
    const high = Math.max(...data.slice(i - period + 1, i + 1).map((d) => d.high))
    const low = Math.min(...data.slice(i - period + 1, i + 1).map((d) => d.low))
    const close = data[i].close
    if (high === low) rsv.push(50)
    else rsv.push(((close - low) / (high - low)) * 100)
  }

  let k = 50,
    d = 50,
    j = 50
  for (const r of rsv) {
    k = (2 * k + r) / 3
    d = (2 * d + k) / 3
    j = 3 * k - 2 * d
  }

  return { k, d, j }
}

function calculateWeeklyMA(data) {
  const weeklyData = []
  for (let i = 4; i < data.length; i += 5) {
    const weekData = data.slice(i - 4, i + 1)
    if (weekData.length > 0) {
      weeklyData.push({
        close: weekData[weekData.length - 1].close,
        high: Math.max(...weekData.map((d) => d.high)),
        low: Math.min(...weekData.map((d) => d.low))
      })
    }
  }

  const closes = weeklyData.map((d) => d.close)
  return {
    ma60: calculateMA(closes, 60),
    ma30: calculateMA(closes, 30)
  }
}

export async function getETFWaveIndicators(code) {
  const [quote, klines] = await Promise.all([getStockQuote(code), getKLineData(code, 300)])

  if (!quote) {
    return null
  }

  if (klines.length === 0) {
    return { ...quote, error: 'K线数据获取失败' }
  }

  const closes = klines.map((d) => d.close)

  const dayMA60 = calculateMA(closes, 60)
  const dayMA30 = calculateMA(closes, 30)
  const kdj = calculateKDJ(klines)
  const weekMA = calculateWeeklyMA(klines)

  const lastClose = closes[closes.length - 1]

  return {
    code,
    name: quote.name,
    price: quote.price,
    change: quote.change,
    changePct: quote.changePct,
    volume: quote.volume,
    amount: quote.amount,
    weekAboveMA60: weekMA.ma60 ? lastClose > weekMA.ma60 : null,
    dayBelowMA60: dayMA60 ? lastClose < dayMA60 : null,
    backToWeekMA30: weekMA.ma30 ? Math.abs(lastClose - weekMA.ma30) / weekMA.ma30 < 0.02 : null,
    kdjJ: kdj ? kdj.j : null,
    dayMA60,
    dayMA30,
    weekMA60: weekMA.ma60,
    weekMA30: weekMA.ma30
  }
}

export function filterByWaveStrategy(etfs, config) {
  const c = config.waveStrategy

  return etfs.filter((etf) => {
    if (!etf) return false

    if (c.weekAboveMA60 && etf.weekAboveMA60 === false) return false
    if (c.weekAboveMA60 && etf.weekAboveMA60 === null) return false

    if (c.buy.dayBelowMA60 && etf.dayBelowMA60 === false) return false
    if (c.buy.dayBelowMA60 && etf.dayBelowMA60 === null) return false

    if (c.buy.backToWeekMA30 && etf.backToWeekMA30 === false) return false

    return true
  })
}

export function getBuySuggestion(etf) {
  if (!etf.kdjJ) return '-'
  if (etf.kdjJ > 20) return '小幅买入'
  if (etf.kdjJ >= 0) return '普通买入'
  return '大幅/满仓'
}

export function getStatus(etf) {
  if (etf.dayCrossMA60) return '停买'
  if (etf.dayCrossMA30) return '少买'
  return '买入'
}

export const defaultConfig = {
  waveStrategy: {
    weekAboveMA60: true,
    buy: {
      dayBelowMA60: true,
      backToWeekMA30: true
    }
  }
}
