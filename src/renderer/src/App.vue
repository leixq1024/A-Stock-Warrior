<script setup>
import { ref } from 'vue'
import ETFAnalyze from './components/ETFAnalyze.vue'
import StrategySettings from './components/StrategySettings.vue'

const currentPage = ref('analyze')

const menuItems = [
  { key: 'analyze', label: 'ETF分析', icon: '📊' },
  { key: 'strategy', label: '策略设置', icon: '⚙️' }
]

function switchPage(key) {
  currentPage.value = key
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">📈</span>
        <span class="logo-text">大A战士</span>
      </div>

      <nav class="menu">
        <div
          v-for="item in menuItems"
          :key="item.key"
          class="menu-item"
          :class="{ active: currentPage === item.key }"
          @click="switchPage(item.key)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <span class="version">v1.0.0</span>
      </div>
    </aside>

    <main class="main-content">
      <ETFAnalyze v-if="currentPage === 'analyze'" />
      <StrategySettings v-else-if="currentPage === 'strategy'" />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  color: #333;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.menu {
  flex: 1;
  padding: 16px 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
  margin-bottom: 4px;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-item.active {
  background: #4a90d9;
  color: white;
}

.menu-icon {
  font-size: 18px;
}

.menu-label {
  font-size: 14px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.version {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
}
</style>
