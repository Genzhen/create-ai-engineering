---
description: 安全审计 — 检查 AI 工具和项目配置的安全性
---

# 安全审计

此命令运行项目的安全审计，检查 AI 工具链和项目配置的安全性。

## 执行流程

### 第 1 步：运行 AI 工具审计

```bash
./scripts/ai-tool-audit.sh project .
```

检查内容：
- MCP 配置安全
- Skills 指令注入
- Hooks 任意代码执行
- CLAUDE.md 污染

### 第 2 步：检查敏感文件

扫描项目中是否有：
- 硬编码凭据（API Key、密码）
- 敏感配置文件（`.env`、`credentials.json`）
- 私钥文件（`.pem`、`.key`）

### 第 3 步：检查依赖安全

根据项目类型运行：
- `npm audit`（Node.js）
- `pip audit`（Python）
- `cargo audit`（Rust）
- `govulncheck`（Go）

### 第 4 步：输出报告

```
安全审计报告
═══════════════════════════════════════

AI 工具安全:
  ✓ MCP 配置 — 无危险配置
  ✓ Skills — 无指令注入
  ✓ Hooks — 无危险命令
  ✓ CLAUDE.md — 无污染

依赖安全:
  ✓ npm audit — 0 漏洞
  ⚠ 发现 2 个过期依赖

敏感文件:
  ✓ 无硬编码凭据
  ✓ 无敏感文件暴露

总体评分: 9/10 (通过)
```

## 修复建议

如果发现问题，输出修复建议：

```
⚠ 发现问题:

1. settings.json 中的 Hook 执行了危险命令
   修复: 移除或限制该 Hook 的权限

2. 依赖 lodash@4.17.15 有已知漏洞 CVE-2020-8204
   修复: 升级到 lodash@4.17.21 或更高版本
```