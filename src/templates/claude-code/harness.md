---
description: Harness 协调器 — 管理功能开发的完整流程
---

# Harness 协调器

此命令启动 Harness 协调器，管理功能开发的完整流程，包括 Writer-Checker-Fixer 对抗循环。

## 用法

```bash
# 查看当前状态
/harness

# 初始化项目
./scripts/harness-init.sh init "项目名"

# 添加功能
./scripts/harness-init.sh add-feature "功能描述"

# 开始实现
./scripts/harness-init.sh start F001

# 执行一轮对抗循环
./scripts/harness-init.sh run-cycle

# 查看进度
./scripts/harness-init.sh status
```

## 功能状态

| 状态 | 说明 |
|---|---|
| `pending` | 待开始 |
| `in_progress` | 进行中 |
| `reviewing` | Checker 审查中 |
| `fixing` | Fixer 修复中 |
| `completed` | 已完成 |
| `failed` | 失败（超过最大尝试次数） |

## 对抗循环

```
Writer 编写代码
     ↓
Checker 审查
     ↓
┌────────────────┐
│ 通过 → 完成     │
│ 驳回 → Fixer   │ → Checker 复查
└────────────────┘
```

## 进度文件

Harness 进度保存在 `.claude/harness-progress.json`：

```json
{
  "project": "项目名",
  "features": [
    {
      "id": "F001",
      "description": "功能描述",
      "status": "in_progress",
      "attempts": 1,
      "current_agent": "writer"
    }
  ]
}
```

## 注意事项

- 每个 Feature 最多尝试 3 次
- Checker 驳回率应保持在 20-40%
- 如果驳回率 < 5%，审查 Checker 的 prompt 是否过于宽松