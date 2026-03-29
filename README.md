# create-ai-engineering

> AI 工程化项目初始化 CLI — 一键配置对抗式 Agent、Skills、安全审计、质量门控

## 快速开始

```bash
# 创建新项目
npx create-ai-engineering my-project

# 在现有项目中添加 AI 工程化配置
npx create-ai-engineering --add-to-existing .
```

## 功能

- **对抗式 Agent 体系** — Writer/Checker/Fixer 三角色对抗，确保代码质量
- **Skills 工作流** — TDD、系统化调试、代码自检、安全编码
- **安全审计工具链** — MCP/Skill/Hook 全链路审计
- **质量门控** — 提交前/完成前自动化检查
- **多平台支持** — Claude Code、Cursor、Codex、OpenCode

## 使用方式

### 交互式创建

```bash
npx create-ai-engineering my-project
```

根据提示选择：
- 目标平台（可多选）
- 安装配置（core/developer/security/full）
- 编程语言
- 技术栈详情

### 快速模式

```bash
npx create-ai-engineering my-project --quick --profile developer --platform claude-code
```

### 添加到现有项目

```bash
cd existing-project
npx create-ai-engineering --add-to-existing .
```

初始化完成后，在 Claude Code 中执行 `/ai-optimize` 命令，AI 将自动分析项目并补充完整内容。

## 生成的结构

```
my-project/
├── .claude/
│   └── agents/           # 对抗式 Agent 定义
├── skills/               # 工作流 Skills
├── commands/             # Slash Commands
├── docs/
│   └── ai-engineering/   # 团队共享文档
├── scripts/              # 工具脚本
├── rules/                # 编码规则
├── CLAUDE.md             # AI 项目规范
├── AGENTS.md             # 跨平台 Agent 定义
└── .claudeignore         # AI 上下文排除规则
```

## 安装配置

| Profile | 描述 |
|---|---|
| `core` | 最小化配置，基础 Agents 和 Skills |
| `developer` | 完整的 AI 工程化体系（推荐） |
| `security` | 安全强化配置 |
| `full` | 包含所有组件 |

## 支持的平台

| 平台 | 支持程度 |
|---|---|
| Claude Code | 完整支持 |
| Cursor | 部分支持（.cursorrules, commands） |
| Codex | 部分支持（AGENTS.md, instructions） |
| OpenCode | 部分支持（AGENTS.md, instructions） |

## /ai-optimize 命令

初始化完成后，在 Claude Code 中执行 `/ai-optimize`：

1. 分析项目结构（配置文件、源代码目录）
2. 识别技术栈（从 package.json/go.mod/pyproject.toml 等）
3. 分析代码风格（命名、错误处理、注释）
4. 补充 CODE_STANDARDS.md
5. 生成 rules/<语言>/ 规则文件
6. 更新 .claudeignore
7. 更新 TECH_STACK.md

## 开发

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/create-ai-engineering.git
cd create-ai-engineering

# 安装依赖
npm install

# 本地测试
npm link
create-ai-engineering test-project
```

## License

MIT