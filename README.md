# create-ai-engineering

> **AI 工程化项目初始化工具** — 让 AI 编程更可靠、更安全、更专业

## 为什么需要这个工具？

如果你使用 Claude Code、Cursor 等 AI 编程工具，可能会遇到这些问题：

- **AI 写的代码有 bug**，但你不一定能发现
- **AI 偷懒**，没有写测试、没有处理错误
- **AI 不知道项目规范**，每次都要重新解释
- **安全问题**，AI 可能会写出有漏洞的代码

这个工具通过一套**"对抗式"工作流**解决这些问题。

---

## 核心概念（新手也能懂）

### 🎭 对抗式 Agent 体系

想象一个工厂的质量管理：

| 角色 | 职责 | 类比 |
|---|---|---|
| **Writer** | 写代码 | 工人生产产品 |
| **Checker** | 找问题 | 质检员挑毛病 |
| **Fixer** | 修复问题 | 返工修复缺陷 |

**工作流程**：
```
Writer 写代码 → Checker 审查 → 没问题就通过 / 有问题就 Fixer 修复 → Checker 复查
```

**为什么要这样？** 因为如果只有一个 AI 写代码，它不会认真检查自己的工作。让两个 AI 互相"对抗"，质量会高很多。

### 📋 Skills 工作流

Skills 就像是**给 AI 的操作手册**，告诉 AI 应该按什么步骤做事：

| Skill | 用途 | 触发时机 |
|---|---|---|
| `tdd-workflow` | 先写测试再写代码 | 新功能开发时 |
| `systematic-debug` | 系统化调试，不要瞎猜 | 遇到 bug 时 |
| `code-review` | 提交前自我检查 | 准备提交代码时 |
| `secure-code` | 安全编码检查 | 处理用户输入、认证时 |

### 🔒 安全审计

检查 AI 工具本身是否安全：

- **MCP 审计**：检查安装的 MCP 插件有没有恶意行为
- **Skill 审计**：检查 Skill 文件有没有指令注入
- **Hook 审计**：检查 Hook 有没有执行危险命令

### 🚦 质量门控

就像考驾照前的体检，提交代码前自动检查：

- 有没有硬编码密码？
- 有没有漏掉错误处理？
- 测试覆盖率够不够？

---

## 快速开始（三步流程）

### Step 1: CLI 初始化

```bash
# 创建新项目
npx create-ai-engineering my-project

# 或添加到现有项目
cd existing-project
npx create-ai-engineering --add-to-existing .
```

CLI 会：
- 创建目录结构
- 全量安装所有模板文件（Agent、Skills、Commands、Scripts）
- 作为"参考文档"存在

### Step 2: 进入项目

```bash
cd my-project
```

### Step 3: 执行 `/ai-init` ⭐ **关键步骤**

在 Claude Code 中执行：

```
/ai-init
```

AI 会：
1. **检测项目状态**（空白项目 vs 现有项目）
2. **触发 brainstorming** 进入 Plan 模式
3. **灵活对话采集需求**（苏格拉底式）
4. **确认技术方案**
5. **自动补全工程化内容**

---

## 为什么这样设计？

### CLI 不询问技术栈的原因

**问题**：在 CLI 初始化阶段，用户还没有深入思考项目需求，技术栈选择往往是盲目的。

**解决**：让 `/ai-init` 在 AI 辅助下采集需求，然后确定技术栈。

### `/ai-init` 的设计理念

**不固定问卷**：AI 自主决定怎么和用户对话，根据项目特点灵活调整问题。

**触发 brainstorming**：复用已有的需求探索能力，不重新发明轮子。

**自动补全**：需求确认后，AI 自动执行所有补全操作。

---

## 生成的结构

```
my-project/
├── .claude/
│   ├── agents/           # 对抗式 Agent 定义
│   │   ├── writer.md     # 写代码的 Agent
│   │   ├── checker.md    # 审查的 Agent
│   │   └── fixer.md      # 修复的 Agent
│   ├── skills/           # 工作流 Skills
│   │   ├── tdd-workflow.md
│   │   ├── systematic-debug.md
│   │   ├── code-review.md
│   │   └── secure-code.md
│   └── commands/         # Slash Commands
│       ├── ai-init.md    # 核心初始化命令 ⭐
│       ├── ai-optimize.md
│       ├── audit.md
│       ├── quality.md
│       └── harness.md
│
├── docs/
│   └── ai-engineering/   # 团队共享文档
│       ├── TECH_STACK.md # 技术栈声明（/ai-init 后填充）
│       ├── CODE_STANDARDS.md # 编码规范
│       ├── LEARNINGS.md  # 经验积累
│       └── AI_ENGINEERING_GUIDE.md
│
├── scripts/              # 工具脚本
│   ├── ai-tool-audit.sh  # 安全审计
│   ├── quality-gate.sh   # 质量门控
│   ├── harness-init.sh   # 流程管理
│   └── init-ai-project.sh
│
├── rules/                # 编码规则（/ai-init 后创建）
│
├── CLAUDE.md             # AI 项目规范
├── AGENTS.md             # 跨平台 Agent 定义
└── .claudeignore         # AI 忽略文件
```

---

## `/ai-init` 命令详解

初始化完成后，在 Claude Code 中执行 `/ai-init`，AI 会自动：

### Phase 1: 项目状态检测

- 检查是空白项目还是现有项目
- 扫描配置文件（package.json, go.mod, pyproject.toml 等）
- 向用户报告检测结果

### Phase 2: Brainstorming（需求探索）

AI 进入 Plan 模式，灵活对话采集需求：

**基础需求**：
- 项目目的、目标用户、项目规模、时间约束、参考项目

**技术方案**：
- 编程语言、后端框架、前端框架、数据库、API设计、认证、性能、部署

**用户可随时结束对话**，AI 基于已收集信息继续。

### Phase 3: 自动补全

- 更新 `TECH_STACK.md`
- 更新 `CLAUDE.md`
- 创建 `CODE_STANDARDS.md`
- 更新 `.claudeignore`
- 创建 `rules/<语言>/` 目录
- 激活相关 Agent 和 Skills

---

## 多平台支持

| 平台 | 支持程度 | 配置文件 |
|---|---|---|
| Claude Code | ✅ 完整支持 | CLAUDE.md, .claude/* |
| Cursor | ⚠️ 部分支持 | .cursorrules, AGENTS.md |
| Codex | ⚠️ 部分支持 | AGENTS.md, instructions/ |
| OpenCode | ⚠️ 部分支持 | AGENTS.md, instructions/ |

---

## 功能激活策略

| 功能 | 默认状态 | 激活条件 |
|---|---|---|
| 对抗式 Agent | 参考（未激活） | `/ai-init` 确认需要 |
| TDD Skill | 参考 | 用户确认需要测试流程 |
| 安全审计脚本 | 安装（可用） | 始终可用 |
| 质量门控脚本 | 安装（可用） | 始终可用，可配置 Hook |

---

## 常见问题

### Q: 我不会编程，能用这个工具吗？

可以！这个工具主要是**给 AI 用的**。你只需要：
1. 初始化项目
2. 执行 `/ai-init`
3. 回答 AI 的问题
4. AI 会帮你写代码、审查代码

### Q: 必须用三个 Agent 吗？

不是必须的。小型改动可以只用 Writer。重要功能建议走完整流程。

### Q: Skills 是自动触发的吗？

默认手动触发。你可以配置 Hook 让特定场景自动触发。

### Q: 和普通 AI 编程有什么区别？

| 普通模式 | AI 工程化模式 |
|---|---|
| AI 写完就提交 | Checker 审查后才提交 |
| Bug 靠发现后修 | TDD 先写测试再写代码 |
| 每次重新解释规范 | 规范写在 CLAUDE.md 里 |
| 安全问题靠运气 | 安全审计强制检查 |
| 技术栈靠猜 | `/ai-init` 确认后确定 |

### Q: `/ai-init` 和 `/ai-optimize` 有什么区别？

| 命令 | 用途 | 项目状态 |
|---|---|
| `/ai-init` | 苏格拉底采访 + 初始化 | 空白项目或需要需求确认 |
| `/ai-optimize` | 分析已有代码 + 补充 | 已有代码的项目 |

---

## 开发与贡献

```bash
# 克隆仓库
git clone https://github.com/Genzhen/create-ai-engineering.git
cd create-ai-engineering

# 安装依赖
npm install

# 本地测试
npm link
create-ai-engineering test-project
```

---

## License

MIT