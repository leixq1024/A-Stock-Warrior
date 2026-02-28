# Commit Message 规范

## 格式

```
<type>: <description>

[optional body]
```

## Type 类别

| Type | 说明 | Emoji |
|------|------|-------|
| `feat` | 新功能 | ✨ |
| `fix` | Bug修复 | 🐛 |
| `docs` | 文档更新 | 📝 |
| `style` | 代码格式调整 | 💄 |
| `refactor` | 代码重构 | ♻️ |
| `perf` | 性能优化 | ⚡ |
| `test` | 测试相关 | ✅ |
| `chore` | 构建/工具更新 | 🔧 |
| `release` | 发布版本 | 🎉 |

## 示例

```
feat: 添加ETF筛选功能

fix: 修复股票数据解析错误

docs: 更新需求文档

refactor: 重构API请求模块

perf: 优化基金数据获取性能
```

## 使用方式

```bash
git commit -m "feat: 添加股票筛选功能"
git commit -m "fix: 修复请求超时问题

修复新浪API连接超时的问题，添加重试机制"
```
