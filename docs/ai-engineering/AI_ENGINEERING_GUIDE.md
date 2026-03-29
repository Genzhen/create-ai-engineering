# AI 工程化实践指南

> 团队使用 AI 编程的最佳实践指南。

---

## 核心原则

### 1. 对抗式开发

使用 Writer-Checker-Fixer 流程：
- Writer 写代码 → Checker 审查 → Fixer 修复 → Checker 复查

### 2. TDD 优先

重要功能开发遵循 TDD：
- 先写失败测试 → 最小实现 → 重构优化

### 3. 安全审计

安装任何 AI 工具前执行审计：
- MCP / Skill / Hook 都需要审计

### 4. 质量门控

提交前执行门控检查：
- `/quality pre-commit` 或配置 Git Hook

---

## 工作流程

### 新功能开发

```
1. /ai-init 或 /brainstorming  → 需求确认
2. /writing-plans              → 编写 Plan
3. /executing-plans            → 执行实现
4. Checker 审查                → 对抗审查
5. /quality pre-complete       → 完成检查
```

### Bug 修复

```
1. /systematic-debug           → 系统化调试
2. 写失败测试                  → 验证 Bug 存在
3. Fixer 修复                  → 最小化修复
4. 测试通过                    → 验证修复
```

---

## /ai-init 后自动填充

执行 `/ai-init` 后，AI 会根据项目特点补充更详细的指南。
