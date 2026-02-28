# A-Stock-Warrior 项目开发提示词

## 项目简介

A-Stock-Warrior (大A战士) 是一个 Node.js 命令行工具，用于定期执行股票和ETF策略筛选。

## 技术栈

- **语言**: Node.js (JavaScript)
- **数据源**: 
  - 新浪财经 API (`hq.sinajs.cn`) - 股票/ETF实时行情
  - 东方财富 API (`fund.eastmoney.com`, `fundmobapi.eastmoney.com`) - 基金数据
- **依赖**: axios, cheerio, iconv-lite

## 项目结构

```
src/
├── index.js           # 入口文件，命令行解析
├── config/index.js    # 策略参数配置
├── api/
│   └── eastMoney.js   # 数据API封装 (新浪财经/东方财富)
├── data/
│   ├── stock.js       # 股票数据获取
│   └── fund.js       # 基金数据获取
├── strategy/
│   ├── index.js      # 策略入口
│   ├── fundamental.js # 基本面筛选
│   ├── technical.js   # 技术面筛选
│   └── fund.js       # 基金筛选
└── output/
    └── console.js    # 控制台输出
```

## 核心功能

1. **股票/ETF筛选**: 通过基本面(PE、PB、ROE、市值)和技术面(均线、动量、成交量)筛选
2. **基金筛选**: 按类型、规模、业绩筛选
3. **定时执行**: 可配合 cron 定期执行

## 开发规范

- 使用 ES6+ 语法
- 模块化设计，职责分离
- 请求需要处理编码 (GB18030)
- 添加请求 Referer 头
- 失败重试机制

## 常用命令

```bash
npm install          # 安装依赖
npm run stock 600519 # 分析股票
npm run fund 股票型  # 筛选基金
```

## 数据API说明

### 新浪财经股票接口
- URL: `https://hq.sinajs.cn/list=sh600519`
- 编码: GB18030
- Referer: `http://finance.sina.com.cn/`

### 东方财富基金接口
- 基金列表: `http://fund.eastmoney.com/js/fundcode_search.js`
- 基金净值: `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo`
