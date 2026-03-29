---
description: 质量门控 — 代码提交前的自动化检查
---

# 质量门控

此命令运行质量门控检查，确保代码符合项目标准。

## 用法

```bash
# 提交前快速检查
/quality pre-commit

# 完成功能前完整检查
/quality pre-complete

# 安全专项扫描
/quality security
```

## 检查内容

### pre-commit（快速检查）

1. **敏感文件检测**
   - 检查是否暂存了 `.env`、`.pem`、`.key` 等敏感文件
   - 检查代码中是否有硬编码凭据

2. **TODO/FIXME 标记**
   - 提醒未完成的 TODO/FIXME

### pre-complete（完整检查）

1. **安全扫描**
   - 运行 `ai-tool-audit.sh project .`

2. **Harness 状态**
   - 检查所有功能是否完成

3. **Git 状态**
   - 检查是否有未提交的变更

### security（安全专项）

1. **AI 工具安全**
   - MCP 配置检查
   - Skills 指令注入检查
   - Hooks 危险命令检查

2. **依赖安全**
   - 运行 `npm audit` 或等效命令

## 输出示例

```
质量门控检查
═══════════════════════════════════════

pre-commit:
  ✓ 无敏感文件
  ⚠ 发现 3 个 TODO 标记

pre-complete:
  ✓ 安全扫描通过
  ✓ Harness 所有功能已完成
  ⚠ 有 2 个未提交的变更

总体: 通过（有警告）
```

## 与 Hooks 集成

质量门控已集成到 Claude Code 的 Stop Hook 中，每次会话结束前自动运行 `pre-complete` 检查。

配置位置：`~/.claude/settings.json` 中的 `Stop` hook。