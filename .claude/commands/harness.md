# /harness Command

> Harness 协调 - 管理功能开发流程

## 功能说明

协调 Writer-Checker-Fixer 对抗式工作流。

## 触发时机

- 开始重要功能开发
- 需要 AI 团队协作完成

## 工作流程

1. **启动 Harness** → 初始化工作流
2. **Writer 编写** → 按 Plan 实现
3. **Checker 审查** → 对抗性检查
4. **Fixer 修复** → 精准修复问题
5. **Checker 复查** → 确认修复通过

## 状态管理

```bash
./scripts/harness-init.sh status    # 查看当前状态
./scripts/harness-init.sh next      # 进入下一阶段
./scripts/harness-init.sh reset     # 重置流程
```
