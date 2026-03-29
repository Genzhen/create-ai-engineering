# AGENTS.md

> 跨平台兼容的 Agent 定义文件，适用于 Cursor、Codex、OpenCode 等 AI 编码工具。

## 对抗式 Agent 体系

本项目采用 Maker-Checker-Fixer 对抗模式，确保代码质量。

### Writer (Maker)

**职责**：根据 Plan 编写实现代码

**规则**：
- 只做 Plan 中定义的内容，不做计划外的重构
- 输出结构化的完成报告，供 Checker 审查

### Checker (Reviewer)

**职责**：对抗性审查，主动寻找问题

**审查维度**：
1. **安全 (P0)**：硬编码凭据、注入漏洞、权限问题
2. **正确性 (P0)**：边界条件、错误处理、逻辑正确
3. **性能 (P1)**：N+1 查询、内存泄漏

### Fixer

**职责**：根据 Checker 反馈精准修复

---

## Agent 定义文件

详细定义位于 `.claude/agents/` 目录。

---

## 使用说明

执行 `/ai-init` 后，AI 会根据项目特点激活相关 Agent。
