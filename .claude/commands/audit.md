# /audit Command

> 安全审计 - 检查 AI 工具配置的安全性

## 功能说明

检查 MCP、Skill、Hook 等配置的安全性，防止恶意代码执行。

## 触发时机

- 安装新的 MCP 包前
- 安装新的 Skill 前
- 配置新的 Hook 前
- 定期安全检查

## 审计类型

```bash
./scripts/ai-tool-audit.sh mcp <package>     # MCP 包审计
./scripts/ai-tool-audit.sh skill <file>      # Skill 审计
./scripts/ai-tool-audit.sh hook <file>       # Hook 审计
./scripts/ai-tool-audit.sh project .         # 项目全面扫描
```

## 评分标准

| 得分 | 建议 |
|---|---|
| ≥ 8 | 可以安装 |
| 6-7 | 需要审查后决定 |
| < 6 | 不建议安装 |

## 审计维度

- 源码可读性
- 行为可预测性
- 依赖安全性
- 权限合理性
