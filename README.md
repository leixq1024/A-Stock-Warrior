# A-Stock-Warrior (大A战士)

定期执行股票和ETF策略筛选工具。

## 功能特性

- 股票/ETF实时行情（新浪财经API）
- 基金数据采集（净值、规模、业绩）
- 基本面选股策略（PE、PB、ROE、市值）
- 技术面选股策略（均线多头、动量筛选）
- 基金筛选（类型、规模、业绩排序）

## 安装

```bash
npm install
```

## 使用方法

### 股票/ETF分析

```bash
npm run stock 600519 000858
```

### 基金筛选

```bash
npm run fund 股票型
npm run fund 混合型
npm run fund 指数型
```

## 配置

修改 `src/config/index.js` 文件调整策略参数。

## 项目结构

```
src/
├── index.js          # 入口文件
├── config/          # 配置文件
├── api/             # 数据API (新浪财经/东方财富)
├── data/            # 数据获取
├── strategy/        # 策略引擎
└── output/          # 输出模块
```
