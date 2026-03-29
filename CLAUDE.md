# create-ai-engineering

> AI 工程化项目初始化 CLI 工具 — 让 AI 编程更可靠、更安全、更专业

---

## 项目目标

**解决问题**：
- AI 编写代码缺少质量把关
- 技术栈选择时机不对（CLI阶段用户还没想清楚）
- AI 工具配置缺少安全审计

**核心功能**：
1. 简化 CLI 初始化（只选平台，全量安装模板）
2. `/ai-init` 触发 brainstorming 进行需求探索
3. 对抗式 Agent 体系（Writer-Checker-Fixer）
4. 安全审计脚本

---

## 技术栈

| 类型 | 选择 |
|---|---|
| 语言 | JavaScript (ES Modules) |
| 运行环境 | Node.js >= 18.0.0 |
| CLI 框架 | commander |
| 交互问答 | inquirer |
| 终端颜色 | chalk |
| 文件操作 | fs-extra |
| 测试框架 | vitest |

---

## 测试状态

**当前状态**：✅ 有测试

```bash
npm test              # 运行测试
npm run test:watch    # 监听模式
npm run test:coverage # 覆盖率报告
```

**测试覆盖**：
- `tests/installer.test.js` — 9 个测试 ✅

---

## AI 工程化体系（已激活）

### 对抗式 Agent

| Agent | 职责 | 文件 |
|---|---|---|
| **Writer** | 编写代码 | `.claude/agents/writer.md` |
| **Checker** | 对抗审查 | `.claude/agents/checker.md` |
| **Fixer** | 精准修复 | `.claude/agents/fixer.md` |

### 可用 Skills

| Skill | 用途 | 触发时机 |
|---|---|---|
| `tdd-workflow` | TDD 工作流 | 新功能开发 |
| `systematic-debug` | 系统化调试 | 排查 Bug |
| `code-review` | 代码自检 | 提交前 |
| `secure-code` | 安全编码 | 处理输入/认证 |

### 可用 Commands

| Command | 用途 | 说明 |
|---|---|---|
| `/ai-init` | 需求探索 + 补全 | 新项目必执行 |
| `/ai-optimize` | 项目优化 | 分析已有代码 |
| `/audit` | 安全审计 | 安装工具前 |
| `/quality` | 质量门控 | 提交前检查 |
| `/harness` | Harness协调 | 管理开发流程 |

### 安全审计

```bash
./scripts/ai-tool-audit.sh mcp <package>     # MCP 包审计
./scripts/ai-tool-audit.sh skill <file>      # Skill 审计
./scripts/ai-tool-audit.sh project .         # 项目全面扫描
```

---

## 文档索引

| 文档 | 位置 |
|---|---|
| 技术栈声明 | `docs/ai-engineering/TECH_STACK.md` |
| 编码规范 | `docs/ai-engineering/CODE_STANDARDS.md` |
| 经验积累 | `docs/ai-engineering/LEARNINGS.md` |
| 实践指南 | `docs/ai-engineering/AI_ENGINEERING_GUIDE.md` |

---

## AI 辅助工作方式

- 遵循项目现有的代码风格和架构模式
- 修改代码前先理解上下文
- 不做计划之外的重构
- **新功能先写测试**（TDD）
- 提交前运行 `npm test` 确保测试通过