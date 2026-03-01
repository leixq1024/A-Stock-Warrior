<script setup>
import { ref } from 'vue'
import {
  getETFWaveIndicators,
  filterByWaveStrategy,
  getBuySuggestion,
  defaultConfig
} from '../api/stock'

const etfCodes = ref('510300 512880 515120 588000')
const results = ref([])
const filteredResults = ref([])
const loading = ref(false)
const config = ref(defaultConfig)

async function analyze() {
  if (!etfCodes.value.trim()) return

  loading.value = true
  results.value = []
  filteredResults.value = []

  const codes = etfCodes.value.trim().split(/\s+/)

  for (const code of codes) {
    const result = await getETFWaveIndicators(code.trim())
    if (result) {
      results.value.push(result)
    }
  }

  filteredResults.value = filterByWaveStrategy(results.value, config.value)
  loading.value = false
}

function getStatusClass(etf) {
  if (etf.weekAboveMA60 === true && etf.dayBelowMA60 === true && etf.backToWeekMA30 === true) {
    return 'status-buy'
  }
  return 'status-wait'
}

function getStatusText(etf) {
  if (etf.weekAboveMA60 === true && etf.dayBelowMA60 === true && etf.backToWeekMA30 === true) {
    return '买入'
  }
  return '观望'
}

function formatNumber(num) {
  if (num == null) return '-'
  return num.toFixed(3)
}
</script>

<template>
  <div class="etf-analyze">
    <div class="header">
      <h2>ETF 波段分析</h2>
      <p class="subtitle">基于技术指标的ETF筛选工具</p>
    </div>

    <div class="input-section">
      <label>ETF 代码（空格分隔）</label>
      <div class="input-group">
        <input
          v-model="etfCodes"
          type="text"
          placeholder="例如: 510300 512880 515120 588000"
          @keyup.enter="analyze"
        />
        <button @click="analyze" :disabled="loading">
          {{ loading ? '分析中...' : '开始分析' }}
        </button>
      </div>
    </div>

    <div v-if="results.length > 0" class="results">
      <div class="results-header">
        <h3>分析结果</h3>
        <span class="badge">{{ filteredResults.length }} 只符合条件</span>
      </div>

      <div class="etf-grid">
        <div v-for="etf in results" :key="etf.code" class="etf-card" :class="getStatusClass(etf)">
          <div class="etf-header">
            <span class="etf-code">{{ etf.code }}</span>
            <span class="etf-name">{{ etf.name }}</span>
            <span class="etf-status" :class="getStatusClass(etf)">{{ getStatusText(etf) }}</span>
          </div>

          <div class="etf-price">
            <span class="price">{{ etf.price?.toFixed(3) }}</span>
            <span class="change" :class="etf.change >= 0 ? 'up' : 'down'">
              {{ etf.change >= 0 ? '+' : '' }}{{ etf.changePct?.toFixed(2) }}%
            </span>
          </div>

          <div class="etf-indicators">
            <div class="indicator-row">
              <span class="label">周线>60周线</span>
              <span
                class="value"
                :class="
                  etf.weekAboveMA60 === true ? 'pass' : etf.weekAboveMA60 === false ? 'fail' : ''
                "
              >
                {{ etf.weekAboveMA60 === true ? '✓' : etf.weekAboveMA60 === false ? '✗' : '-' }}
              </span>
            </div>
            <div class="indicator-row">
              <span class="label">日线<60日线</span>
              <span
                class="value"
                :class="
                  etf.dayBelowMA60 === true ? 'pass' : etf.dayBelowMA60 === false ? 'fail' : ''
                "
              >
                {{ etf.dayBelowMA60 === true ? '✓' : etf.dayBelowMA60 === false ? '✗' : '-' }}
              </span>
            </div>
            <div class="indicator-row">
              <span class="label">回踩30周线2%</span>
              <span
                class="value"
                :class="
                  etf.backToWeekMA30 === true ? 'pass' : etf.backToWeekMA30 === false ? 'fail' : ''
                "
              >
                {{ etf.backToWeekMA30 === true ? '✓' : etf.backToWeekMA30 === false ? '✗' : '-' }}
              </span>
            </div>
          </div>

          <div class="etf-details">
            <div class="detail-item">
              <span class="label">KDJ.J</span>
              <span class="value">{{ formatNumber(etf.kdjJ) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">建议</span>
              <span class="value">{{ getBuySuggestion(etf) }}</span>
            </div>
          </div>

          <div class="etf-ma">
            <div class="ma-item">
              <span class="label">日MA30</span>
              <span>{{ formatNumber(etf.dayMA30) }}</span>
            </div>
            <div class="ma-item">
              <span class="label">日MA60</span>
              <span>{{ formatNumber(etf.dayMA60) }}</span>
            </div>
            <div class="ma-item">
              <span class="label">周MA30</span>
              <span>{{ formatNumber(etf.weekMA30) }}</span>
            </div>
            <div class="ma-item">
              <span class="label">周MA60</span>
              <span>{{ formatNumber(etf.weekMA60) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="empty-state">
      <p>输入 ETF 代码，点击"开始分析"</p>
      <p class="tips">常用 ETF: 510300(沪深300) 512880(证券) 515120(科创50) 588000(上证50)</p>
    </div>
  </div>
</template>

<style scoped>
.etf-analyze {
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.subtitle {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

.input-section {
  margin-bottom: 24px;
}

.input-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.input-group {
  display: flex;
  gap: 12px;
}

.input-group input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.input-group input:focus {
  outline: none;
  border-color: #4a90d9;
}

.input-group button {
  padding: 12px 24px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.input-group button:hover:not(:disabled) {
  background: #3a7bc8;
}

.input-group button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.results-header h3 {
  margin: 0;
}

.badge {
  background: #4a90d9;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.etf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.etf-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.etf-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.etf-card.status-buy {
  border-color: #52c41a;
  background: #f6ffed;
}

.etf-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.etf-code {
  font-weight: 600;
  color: #333;
}

.etf-name {
  color: #666;
  font-size: 14px;
}

.etf-status {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.etf-status.status-buy {
  background: #52c41a;
  color: white;
}

.etf-status.status-wait {
  background: #faad14;
  color: white;
}

.etf-price {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.etf-price .price {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.etf-price .change {
  font-size: 14px;
}

.etf-price .change.up {
  color: #f5222d;
}

.etf-price .change.down {
  color: #52c41a;
}

.etf-indicators {
  margin-bottom: 12px;
}

.indicator-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
}

.indicator-row .label {
  color: #666;
}

.indicator-row .value {
  font-weight: 500;
}

.indicator-row .value.pass {
  color: #52c41a;
}

.indicator-row .value.fail {
  color: #f5222d;
}

.etf-details {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.detail-item {
  flex: 1;
}

.detail-item .label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.detail-item .value {
  font-weight: 500;
  color: #333;
}

.etf-ma {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ma-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state .tips {
  margin-top: 12px;
  font-size: 12px;
}
</style>
