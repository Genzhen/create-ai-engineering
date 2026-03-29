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

## 如何使用？

### 自动触发 vs 手动触发

| 功能 | 触发方式 | 说明 |
|---|---|---|
| **对抗式 Agent** | 手动 | 写完代码后，告诉 AI "请 Checker 审查" |
| **Skills** | 手动或自动 | 根据场景选择使用哪个 Skill |
| **安全审计** | 手动 | 安装新工具前运行 |
| **质量门控** | 自动 | 配置 Hook 后自动触发 |

### 日常使用示例

#### 场景 1：开发新功能

```bash
# 1. 你告诉 AI 需求
"帮我实现用户登录功能"

# 2. AI (Writer) 开始写代码
# 3. 代码写完后，你说：
"请 Checker 审查这段代码"

# 4. Checker 会检查：
#    - 有没有安全漏洞？
#    - 错误处理完整吗？
#    - 代码风格对吗？

# 5. 如果 Checker 驳回，Fixer 会修复
# 6. 如果 Checker 通过，你可以提交代码
```

#### 场景 2：遇到 Bug

```bash
# 使用 systematic-debug Skill
/debug

# AI 会按科学流程调试：
# 1. 先复现问题
# 2. 缩小范围
# 3. 提出假设
# 4. 验证假设
# 5. 最小化修复
```

#### 场景 3：安装新的 AI 工具

```bash
# 安装前先审计
./scripts/ai-tool-audit.sh mcp @some/mcp-package

# 得分 ≥ 8 才能安装
```

#### 场景 4：提交代码前

```bash
# 自动触发（如果配置了 Hook）
# 或手动触发
/quality pre-commit

# 检查：
# ✓ 无敏感文件
# ✓ 无硬编码密码
# ✓ 有 TODO 的地方已处理
```

---

## 快速开始

```bash
# 创建新项目（推荐）
npx create-ai-engineering my-project

# 在现有项目中添加 AI 工程化配置
cd existing-project
npx create-ai-engineering --add-to-existing .
```

## 安装

```bash
# 使用 npx（推荐，无需安装）
npx create-ai-engineering my-project

# 或全局安装
npm install -g create-ai-engineering
create-ai-engineering my-project
```

---

## 生成的结构

```
my-project/
├── .claude/
│   └── agents/           # 对抗式 Agent 定义
│       ├── writer.md     # 写代码的 Agent
│       ├── checker.md    # 审查的 Agent
│       └── fixer.md      # 修复的 Agent
│
├── skills/               # 工作流 Skills
│   ├── tdd-workflow/     # TDD 工作流
│   ├── systematic-debug/ # 系统化调试
│   ├── code-review/      # 代码自检
│   └── secure-code/      # 安全编码
│
├── commands/             # Slash Commands
│   ├── ai-optimize.md    # AI 自动优化项目
│   ├── audit.md          # 安全审计
│   ├── harness.md        # 管理开发流程
│   └── quality.md        # 质量门控
│
├── docs/
│   └── ai-engineering/   # 团队共享文档
│       ├── TECH_STACK.md # 技术栈声明
│       ├── CODE_STANDARDS.md # 编码规范
│       └── LEARNINGS.md  # 经验积累
│
├── scripts/              # 工具脚本
│   ├── ai-tool-audit.sh  # 安全审计
│   ├── quality-gate.sh   # 质量门控
│   └── harness-init.sh   # 流程管理
│
├── rules/                # 编码规则
│
├── CLAUDE.md             # AI 项目规范（Claude Code 读取）
├── AGENTS.md             # 跨平台 Agent 定义
└── .claudeignore         # AI 忽略文件
```

---

## 安装配置说明

| Profile | 描述 | 适合人群 |
|---|---|---|
| `core` | 最小化配置 | 只想要基础功能 |
| `developer` | 完整配置（推荐） | 大多数开发者 |
| `security` | 安全强化 | 对安全要求高的项目 |
| `full` | 包含所有组件 | 需要完整功能 |

---

## 多平台支持

| 平台 | 支持程度 | 说明 |
|---|---|---|
| Claude Code | ✅ 完整支持 | 所有功能可用 |
| Cursor | ⚠️ 部分支持 | .cursorrules, commands |
| Codex | ⚠️ 部分支持 | AGENTS.md, instructions |
| OpenCode | ⚠️ 部分支持 | AGENTS.md, instructions |

---

## `/ai-optimize` 命令详解

初始化完成后，在 Claude Code 中执行 `/ai-optimize`，AI 会自动：

1. **分析项目结构** — 扫描配置文件、源代码目录
2. **识别技术栈** — 从 package.json/go.mod/pyproject.toml 等
3. **分析代码风格** — 命名、错误处理、注释习惯
4. **补充编码规范** — 更新 CODE_STANDARDS.md
5. **生成规则文件** — 创建 rules/<语言>/ 目录
6. **更新忽略规则** — 完善 .claudeignore

**适用场景**：
- 自定义语言需要补充最佳实践
- 已有项目需要补充 AI 工程化配置
- 技术栈变更后需要同步更新

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

## 常见问题

### Q: 我不会编程，能用这个工具吗？

可以！这个工具主要是**给 AI 用的**。你只需要：
1. 初始化项目
2. 告诉 AI 你的需求
3. AI 会按照这套规范帮你写代码
4. Checker 会帮你检查代码质量

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

---

## License

MIT