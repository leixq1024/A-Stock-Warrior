# A-Stock-Warrior (大A战士) v2.0

定期执行ETF波段策略筛选工具。

## 功能特性

- ETF实时行情（新浪财经API）
- K线数据获取（腾讯API）
- 技术指标计算（MA均线、KDJ）
- 波段心法策略筛选

## 安装

```bash
npm install
```

## 使用方法

```bash
# 分析指定的ETF
node src/index.js <ETF代码1> <ETF代码2> ...

# 示例
node src/index.js 510300 512880 515120 588000
```

## 策略说明

### 波段心法策略条件

- **周线在60周线上方** - 牛市阶段
- **日线在60日线下方** - 处于调整阶段
- **回踩30周线2%内** - 买入时机
- **未形成死叉** - 可以买入

### 买入建议

- KDJ.J > 20: 小幅买入
- KDJ.J >= 0: 普通买入  
- KDJ.J < 0: 大幅/满仓

## 数据来源

- 实时行情: 新浪财经 (hq.sinajs.cn)
- K线数据: 腾讯财经 (web.ifzq.gtimg.cn)

## 项目结构

```
src/
├── index.js          # 入口文件
├── config/          # 策略配置
├── api/             # 数据API
└── output/          # 输出模块
```
