<script setup>
import { ref } from 'vue'

const strategyConfig = ref({
  weekAboveMA60: true,
  dayBelowMA60: true,
  backToWeekMA30: true,
  backWeekTolerance: 2
})

const strategyDesc = [
  { key: 'weekAboveMA60', title: '周线在60周线上方', desc: '牛市阶段，确认长期上涨趋势' },
  { key: 'dayBelowMA60', title: '日线在60日线下方', desc: '处于调整阶段，等待买入时机' },
  { key: 'backToWeekMA30', title: '回踩30周线2%内', desc: '回踩支撑位，可能是好的买入点' }
]

function saveConfig() {
  localStorage.setItem('stockStrategyConfig', JSON.stringify(strategyConfig.value))
  alert('配置已保存')
}

function loadConfig() {
  const saved = localStorage.getItem('stockStrategyConfig')
  if (saved) {
    strategyConfig.value = JSON.parse(saved)
  }
}

loadConfig()
</script>

<template>
  <div class="strategy-settings">
    <div class="header">
      <h2>策略设置</h2>
      <p class="subtitle">配置波段心法筛选条件</p>
    </div>

    <div class="settings-card">
      <h3>选标的条件</h3>

      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">周线在60周线上方</span>
          <span class="setting-desc">牛市阶段，确认长期上涨趋势</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="strategyConfig.weekAboveMA60" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">日线在60日线下方</span>
          <span class="setting-desc">处于调整阶段，等待买入时机</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="strategyConfig.dayBelowMA60" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">回踩30周线2%内</span>
          <span class="setting-desc">回踩支撑位，可能是好的买入点</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="strategyConfig.backToWeekMA30" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="settings-card">
      <h3>策略说明</h3>

      <div class="strategy-intro">
        <div class="intro-item">
          <h4>波段心法</h4>
          <ul>
            <li>周线在60周线上方 - 牛市阶段</li>
            <li>日线在60日线下方 - 处于调整阶段</li>
            <li>回踩30周线2%内 - 买入时机</li>
            <li>未形成死叉 - 可以买入</li>
          </ul>
        </div>

        <div class="intro-item">
          <h4>买入建议</h4>
          <ul>
            <li>KDJ.J > 20: 小幅买入</li>
            <li>KDJ.J >= 0: 普通买入</li>
            <li>KDJ.J < 0: 大幅/满仓</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="save-btn" @click="saveConfig">保存配置</button>
    </div>
  </div>
</template>

<style scoped>
.strategy-settings {
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

.settings-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.settings-card h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-title {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: #999;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4a90d9;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.strategy-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.intro-item h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #333;
}

.intro-item ul {
  margin: 0;
  padding-left: 20px;
}

.intro-item li {
  color: #666;
  font-size: 14px;
  line-height: 2;
}

.actions {
  margin-top: 24px;
}

.save-btn {
  padding: 12px 32px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #3a7bc8;
}
</style>
