# A-Stock-Warrior (大A战士) - 设计文档

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    A-Stock-Warrior 大A战士                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ 命令行入口   │  │  配置管理   │  │    结果输出模块     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐ │
│  │                    策略分析引擎                         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │基本面选股策略 │  │技术面选股策略 │  │  基金筛选    │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │ │
│  └─────────┼─────────────────┼─────────────────┼─────────┘ │
│            │                 │                 │            │
│  ┌─────────┴─────────────────┴─────────────────┴─────────┐ │
│  │                     数据采集层                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  股票数据接口 │  │  基金数据接口 │  │  数据缓存    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┴───────────────────────────────┐ │
│  │                    东方财富API                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 2. 目录结构

```
量化选股/
├── src/
│   ├── index.js              # 入口文件
│   ├── config/
│   │   └── index.js          # 配置文件
│   ├── api/
│   │   ├── eastMoney.js      # 东方财富API封装
│   │   └── index.js          # API统一导出
│   ├── data/
│   │   ├── stock.js          # 股票数据获取
│   │   └── fund.js           # 基金数据获取
│   ├── strategy/
│   │   ├── index.js          # 策略入口
│   │   ├── fundamental.js     # 基本面策略
│   │   ├── technical.js      # 技术面策略
│   │   └── fund.js           # 基金筛选策略
│   └── output/
│       └── console.js        # 控制台输出
├── package.json
└── README.md
```

## 3. 模块设计

### 3.1 配置管理 (config/index.js)

```javascript
// 策略参数配置
{
  stock: {
    // 基本面参数
    fundamental: {
      peMax: 30,           // 市盈率上限
      peMin: 0,            // 市盈率下限
      pbMax: 5,            // 市净率上限
      roeMin: 15,          // 最小ROE(%)
      marketCapMin: 10e8,  // 最小市值(元)
      marketCapMax: 500e8  // 最大市值(元)
    },
    // 技术面参数
    technical: {
      maPeriods: [5, 10, 20],  // 均线周期
      momentumDays: 20,       # 动量筛选天数
      momentumMin: 0,         # 最小涨幅(%)
      volumeRatio: 1.5        # 成交量放大倍数
    }
  },
  fund: {
    type: ['股票型', '混合型', '指数型'],
    scaleMin: 1e8,     # 最小规模(元)
    performanceMin: 0  # 最小年化收益(%)
  }
}
```

### 3.2 东方财富API封装 (api/eastMoney.js)

- **getStockList**: 获取股票列表
- **getStockQuote**: 获取实时行情
- **getStockFundamental**: 获取基本面数据
- **getStockFinancial**: 获取财务指标
- **getFundList**: 获取基金列表
- **getFundDetail**: 获取基金详情

### 3.3 策略引擎 (strategy/index.js)

```javascript
// 策略执行流程
async function runStrategy(config) {
  // 1. 获取原始数据
  const stocks = await getStockData();
  
  // 2. 基本面筛选
  const fundamentalFiltered = filterByFundamental(stocks, config.fundamental);
  
  // 3. 技术面筛选
  const technicalFiltered = filterByTechnical(fundamentalFiltered, config.technical);
  
  // 4. 输出结果
  output(technicalFiltered);
}
```

## 4. 数据接口设计

### 4.1 股票数据模型

```typescript
interface Stock {
  code: string;           // 股票代码
  name: string;           // 股票名称
  price: number;          // 当前价格
  change: number;         // 涨跌幅(%)
  volume: number;         // 成交量
  amount: number;        // 成交额
  pe: number;             // 市盈率
  pb: number;             // 市净率
  marketCap: number;      // 总市值
  floatCap: number;       // 流通市值
  roe: number;            // ROE
  grossMargin: number;    # 毛利率
  netMargin: number;     # 净利率
  revenueGrowth: number;  # 营收增速
  ma5: number;            # 5日均线
  ma10: number;           # 10日均线
  ma20: number;           # 20日均线
}
```

### 4.2 基金数据模型

```typescript
interface Fund {
  code: string;           // 基金代码
  name: string;           // 基金名称
  type: string;           // 基金类型
  scale: number;          // 基金规模
  unitNav: number;        # 单位净值
  accumNav: number;       # 累计净值
  dailyGrowth: number;    # 日增长率
  annualReturn: number;   # 年化收益率
  managementFee: number;  # 管理费率
  custodyFee: number;     # 托管费率
  holdings: string[];      # 重仓股票
}
```

## 5. 关键技术实现

### 5.1 数据请求
- 使用 `axios` 发送HTTP请求
- 请求频率控制，避免触发反爬
- 失败重试机制

### 5.2 数据处理
- 使用 `cheerio` 解析HTML页面
- 使用 `iconv-lite` 处理编码问题

## 6. 扩展性设计

- **策略插件化**: 新增策略只需在 strategy 目录添加新文件
- **数据源可替换**: API层抽象，支持切换数据源
- **输出格式可扩展**: 可添加 JSON/CSV 等输出格式
