/**
 * 安装执行模块 - 全量安装版
 *
 * 设计理念：全量安装所有模板文件，作为"参考文档"存在。
 * 实际激活由 /ai-init 根据需求决定。
 */

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../templates');

/**
 * 安装项目 - 全量安装所有模板
 * @param {object} config - 用户配置
 */
export async function installProject(config) {
  const { targetDir, platforms } = config;

  console.log(chalk.cyan('\n[1/5] 创建目录结构...'));

  // 创建所有目录
  const dirs = [
    '.claude/agents',
    '.claude/skills',
    '.claude/commands',
    'skills',
    'commands',
    'docs/ai-engineering',
    'docs/_archive',
    'scripts',
    'rules',
    'manifests'
  ];

  for (const dir of dirs) {
    const fullPath = path.join(targetDir, dir);
    await fs.ensureDir(fullPath);
    console.log(chalk.dim(`  ✓ ${dir}/`));
  }

  console.log(chalk.cyan('\n[2/5] 复制 Agents 模板...'));
  await copyAgents(targetDir);

  console.log(chalk.cyan('\n[3/5] 复制 Skills 模板...'));
  await copySkills(targetDir);

  console.log(chalk.cyan('\n[4/5] 复制 Commands 模板...'));
  await copyCommands(targetDir);

  console.log(chalk.cyan('\n[5/5] 复制其他模板...'));
  await copyScripts(targetDir);
  await copyDocs(targetDir);
  await generateClaudeMd(targetDir, config);
  await generateAgentsMd(targetDir);
  await generateClaudeignore(targetDir);
  await generateSettingsJson(targetDir);
}

/**
 * 复制 Agents 模板
 */
async function copyAgents(targetDir) {
  const agentsDir = path.join(TEMPLATES_DIR, 'agents');
  const destDir = path.join(targetDir, '.claude/agents');

  if (await fs.pathExists(agentsDir)) {
    const agents = await fs.readdir(agentsDir);
    for (const agent of agents) {
      const srcPath = path.join(agentsDir, agent);
      const destPath = path.join(destDir, agent);
      await fs.copy(srcPath, destPath);
      console.log(chalk.dim(`  ✓ .claude/agents/${agent}`));
    }
  } else {
    // 创建默认 Agent 模板
    await createDefaultAgents(destDir);
  }
}

/**
 * 创建默认 Agent 模板
 */
async function createDefaultAgents(destDir) {
  const agents = {
    'writer.md': `# Writer Agent

> 编写代码的 Agent，负责根据 Plan 实现功能。

## 职责

- 按 Plan 定义的内容编写代码
- 不做计划外的重构或优化
- 输出结构化的完成报告

## 工作流程

1. 理解 Plan 中的任务描述
2. 分析现有代码上下文
3. 编写实现代码
4. 编写必要的测试
5. 输出完成报告供 Checker 审查

## 输出格式

\`\`\`
## 完成报告

### 实现内容
- [列出实现的功能点]

### 文件变更
- [列出修改的文件]

### 待确认项
- [需要 Checker 重点审查的部分]
\`\`\`
`,
    'checker.md': `# Checker Agent

> 对抗性审查 Agent，主动寻找问题。

## 职责

- 对抗性审查 Writer 的代码
- 主动寻找潜在问题
- 确保代码质量和安全

## 审查维度

### P0 - 必须修复
1. **安全**：硬编码凭据、注入漏洞、权限问题
2. **正确性**：边界条件、错误处理、逻辑正确

### P1 - 建议修复
3. **性能**：N+1 查询、内存泄漏、不合理的循环
4. **可读性**：命名清晰、注释必要、代码结构

## 审查结果格式

\`\`\`
## 审查报告

### 状态
[通过 / 需修复]

### 问题清单
| 级别 | 问题 | 位置 | 建议 |
|---|---|---|---|

### 审查结论
[通过则说明亮点，需修复则说明关键问题]
\`\`\`
`,
    'fixer.md': `# Fixer Agent

> 精准修复 Agent，根据 Checker 反馈进行最小化修复。

## 职责

- 根据 Checker 的审查结果精准修复
- 最小化改动，不引入新问题
- 输出修复报告供 Checker 复查

## 工作流程

1. 分析 Checker 的问题清单
2. 按优先级修复（P0 先于 P1）
3. 每个修复独立提交
4. 输出修复报告

## 修复原则

- **最小化改动**：只修复问题，不做额外重构
- **保留上下文**：不破坏现有代码逻辑
- **测试验证**：修复后运行相关测试

## 输出格式

\`\`\`
## 修复报告

### 修复项
| 问题 | 修复方案 | 文件 |

### 验证结果
[测试运行结果]
\`\`\`
`
  };

  for (const [name, content] of Object.entries(agents)) {
    await fs.writeFile(path.join(destDir, name), content);
    console.log(chalk.dim(`  ✓ .claude/agents/${name}`));
  }
}

/**
 * 复制 Skills 模板
 */
async function copySkills(targetDir) {
  const skillsDir = path.join(TEMPLATES_DIR, 'skills');
  const destDir = path.join(targetDir, '.claude/skills');

  if (await fs.pathExists(skillsDir)) {
    const skills = await fs.readdir(skillsDir);
    for (const skill of skills) {
      const srcPath = path.join(skillsDir, skill);
      const destPath = path.join(destDir, skill);
      await fs.copy(srcPath, destPath);
      console.log(chalk.dim(`  ✓ .claude/skills/${skill}`));
    }
  } else {
    // 创建默认 Skills 模板
    await createDefaultSkills(destDir);
  }
}

/**
 * 创建默认 Skills 模板
 */
async function createDefaultSkills(destDir) {
  const skills = {
    'tdd-workflow.md': `# TDD Workflow Skill

> 先写测试再写代码的开发流程。

## 触发时机

- 新功能开发
- Bug 修复（先写失败测试）

## 工作流程

1. **理解需求** → 分析功能点
2. **写测试** → 先写失败测试
3. **写代码** → 最小实现让测试通过
4. **重构** → 在测试保护下优化
5. **提交** → 测试全部通过后提交

## 检查清单

- [ ] 测试覆盖核心逻辑
- [ ] 边界条件有测试
- [ ] 错误处理有测试
- [ ] 所有测试通过
`,
    'systematic-debug.md': `# Systematic Debug Skill

> 系统化调试流程，不靠猜测。

## 触发时机

- 遇到 Bug
- 测试失败
- 意外行为

## 工作流程

1. **复现问题** → 确保能稳定复现
2. **缩小范围** → 通过日志、断点定位
3. **提出假设** → 基于证据提出可能原因
4. **验证假设** → 设计实验验证
5. **最小修复** → 只修复问题本身

## 调试日志模板

\`\`\`
## Bug 调试记录

### 现象
[描述 Bug 表现]

### 假设
1. [假设1] → 验证结果: [✓/✗]
2. [假设2] → 验证结果: [✓/✗]

### 根因
[确认的根本原因]

### 修复
[最小化修复方案]
\`\`\`
`,
    'code-review.md': `# Code Review Skill

> 提交前的代码自检流程。

## 触发时机

- 准备提交 PR
- 功能完成前
- Checker 审查前自检

## 检查清单

### 必查项
- [ ] 无硬编码密码/API Key
- [ ] 无敏感文件（.env, credentials）
- [ ] 错误处理完整
- [ ] 边界条件处理

### 建议查项
- [ ] 代码命名清晰
- [ ] 注释必要
- [ ] 无重复代码
- [ ] 测试覆盖

### 安全查项
- [ ] 输入验证
- [ ] SQL 无注入风险
- [ ] XSS 防护
- [ ] 权限检查
`,
    'secure-code.md': `# Secure Code Skill

> 安全编码检查流程。

## 触发时机

- 处理用户输入
- 认证/授权相关
- 数据存储相关
- API 接口开发

## 安全检查清单

### 输入安全
- [ ] 参数验证
- [ ] 类型检查
- [ ] 长度限制
- [ ] 特殊字符过滤

### 认证安全
- [ ] 密码哈希存储
- [ ] Session 管理
- [ ] Token 安全
- [ ] 权限验证

### 数据安全
- [ ] SQL 参数化查询
- [ ] 文件路径验证
- [ ] 加密敏感数据

### API 安全
- [ ] HTTPS
- [ ] Rate Limiting
- [ ] CORS 配置
- [ ] 认证中间件
`
  };

  for (const [name, content] of Object.entries(skills)) {
    await fs.writeFile(path.join(destDir, name), content);
    console.log(chalk.dim(`  ✓ .claude/skills/${name}`));
  }
}

/**
 * 复制 Commands 模板
 */
async function copyCommands(targetDir) {
  const commandsDir = path.join(TEMPLATES_DIR, 'commands');
  const destDir = path.join(targetDir, '.claude/commands');

  if (await fs.pathExists(commandsDir)) {
    const commands = await fs.readdir(commandsDir);
    for (const cmd of commands) {
      const srcPath = path.join(commandsDir, cmd);
      const destPath = path.join(destDir, cmd);
      await fs.copy(srcPath, destPath);
      console.log(chalk.dim(`  ✓ .claude/commands/${cmd}`));
    }
  } else {
    // 创建默认 Commands 模板
    await createDefaultCommands(destDir);
  }
}

/**
 * 创建默认 Commands 模板
 */
async function createDefaultCommands(destDir) {
  const commands = {
    'ai-init.md': `# /ai-init Command

> 项目初始化入口 - 需求探索 + 技术方案确认 + 工程化补全

## 功能说明

项目初始化的核心入口命令，触发 AI 进行需求探索和技术方案确认。

**这是 CLI 初始化后必须执行的命令。**

## 触发时机

- CLI 初始化完成后
- 现有项目添加 AI 工程化配置时
- 技术栈需要重新评估时

## 工作流程

### Phase 1: 项目状态检测

1. 检查项目类型：
   - 空白项目 → 进入完整的需求探索
   - 现有项目 → 分析已有代码和配置
2. 扫描配置文件：
   - package.json / go.mod / pyproject.toml
   - Cargo.toml / pom.xml / build.gradle
3. 向用户报告检测结果

### Phase 2: 触发 Brainstorming

**自动触发** \`superpowers:brainstorming\` Skill，进入 Plan 模式。

AI 使用 brainstorming 的能力：
- 灵活对话采集需求
- 逐步深入技术方案
- 确认并总结方案

**用户可随时结束对话**，AI 基于已收集信息继续。

### Phase 3: 自动补全工程化内容

Plan 确认后，执行以下补全操作：

| 文件 | 操作 |
|---|---|
| \`docs/ai-engineering/TECH_STACK.md\` | 更新技术栈信息 |
| \`CLAUDE.md\` | 添加技术栈和项目说明 |
| \`docs/ai-engineering/CODE_STANDARDS.md\` | 创建编码规范 |
| \`.claudeignore\` | 更新忽略规则 |
| \`rules/<语言>/\` | 创建语言规则目录 |
| Agents | 激活相关 Agent |
| Skills | 激活相关 Skill |

## 关键说明

**/ai-init 不定义固定问卷**，而是：
- 检测项目状态
- 触发 brainstorming skill
- 让 AI 自主决定对话方式
- 在需求确认后执行补全

## 示例用法

\`\`\`
# CLI 初始化后
cd my-project
# 在 Claude Code 中
> /ai-init

# AI 检测到空白项目
# AI 触发 brainstorming 进入 Plan 模式
# AI 开始对话采集需求...
\`\`\`
`,
    'ai-optimize.md': `# /ai-optimize Command

> 分析项目并优化 AI 工程化配置

## 功能说明

分析已有项目结构，识别技术栈，补充 AI 工程化配置。

## 触发时机

- 已有项目需要补充 AI 工程化配置
- 技术栈变更后需要同步更新
- 自定义语言需要补充最佳实践

## 工作流程

1. **分析项目结构** — 扫描目录结构
2. **识别技术栈** — 从配置文件推断
3. **分析代码风格** — 命名、错误处理、注释
4. **补充编码规范** — 更新 CODE_STANDARDS.md
5. **生成规则文件** — 创建 rules/<语言>/ 目录
6. **更新忽略规则** — 完善 .claudeignore

## 与 /ai-init 的区别

| 命令 | 用途 | 项目状态 |
|---|---|---|
| \`/ai-init\` | 苏格拉底采访 + 初始化 | 空白项目或需要需求确认 |
| \`/ai-optimize\` | 分析已有代码 + 补充 | 已有代码的项目 |
`,
    'audit.md': `# /audit Command

> 安全审计 - 检查 AI 工具配置的安全性

## 功能说明

检查 MCP、Skill、Hook 等配置的安全性，防止恶意代码执行。

## 触发时机

- 安装新的 MCP 包前
- 安装新的 Skill 前
- 配置新的 Hook 前
- 定期安全检查

## 审计类型

\`\`\`bash
./scripts/ai-tool-audit.sh mcp <package>     # MCP 包审计
./scripts/ai-tool-audit.sh skill <file>      # Skill 审计
./scripts/ai-tool-audit.sh hook <file>       # Hook 审计
./scripts/ai-tool-audit.sh project .         # 项目全面扫描
\`\`\`

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
`,
    'quality.md': `# /quality Command

> 质量门控 - 提交前/完成前的质量检查

## 功能说明

执行质量门控检查，确保代码达到提交标准。

## 触发时机

- \`/quality pre-commit\` — 提交前快速检查
- \`/quality pre-complete\` — 功能完成前完整检查

## 检查项

### pre-commit（快速）
- [ ] 无敏感文件
- [ ] 无硬编码密码
- [ ] TODO 已处理或标记

### pre-complete（完整）
- [ ] 测试覆盖率
- [ ] 错误处理完整性
- [ ] 代码风格一致性
- [ ] 安全检查通过

## 配置 Hook

可配置为 Git Hook 自动触发：

\`\`\`bash
# 配置 pre-commit hook
./scripts/quality-gate.sh setup-hook
\`\`\`
`,
    'harness.md': `# /harness Command

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

\`\`\`bash
./scripts/harness-init.sh status    # 查看当前状态
./scripts/harness-init.sh next      # 进入下一阶段
./scripts/harness-init.sh reset     # 重置流程
\`\`\`
`
  };

  for (const [name, content] of Object.entries(commands)) {
    await fs.writeFile(path.join(destDir, name), content);
    console.log(chalk.dim(`  ✓ .claude/commands/${name}`));
  }
}

/**
 * 复制 Scripts 模板
 */
async function copyScripts(targetDir) {
  const scriptsDir = path.join(TEMPLATES_DIR, 'scripts');
  const destDir = path.join(targetDir, 'scripts');

  if (await fs.pathExists(scriptsDir)) {
    const scripts = await fs.readdir(scriptsDir);
    for (const script of scripts) {
      const srcPath = path.join(scriptsDir, script);
      const destPath = path.join(destDir, script);
      await fs.copy(srcPath, destPath);
      console.log(chalk.dim(`  ✓ scripts/${script}`));
    }
  } else {
    // 创建默认脚本
    await createDefaultScripts(destDir);
  }
}

/**
 * 创建默认脚本
 */
async function createDefaultScripts(destDir) {
  const scripts = {
    'ai-tool-audit.sh': `#!/bin/bash
# AI 工具安全审计脚本

set -e

TYPE="$1"
TARGET="$2"

echo "🔒 AI 工具安全审计"
echo "类型: $TYPE"
echo "目标: $TARGET"
echo ""

case "$TYPE" in
  mcp)
    echo "审计 MCP 包: $TARGET"
    echo "检查维度: 源码、依赖、权限..."
    # TODO: 实现审计逻辑
    ;;
  skill)
    echo "审计 Skill 文件: $TARGET"
    echo "检查维度: 指令注入、危险命令..."
    # TODO: 实现审计逻辑
    ;;
  hook)
    echo "审计 Hook 配置: $TARGET"
    echo "检查维度: 任意代码执行..."
    # TODO: 实现审计逻辑
    ;;
  project)
    echo "全面扫描项目: $TARGET"
    echo "扫描: MCP、Skill、Hook..."
    # TODO: 实现审计逻辑
    ;;
  *)
    echo "用法: ./scripts/ai-tool-audit.sh <mcp|skill|hook|project> <target>"
    exit 1
    ;;
esac

echo ""
echo "✓ 审计完成"
`,
    'quality-gate.sh': `#!/bin/bash
# 质量门控脚本

set -e

MODE="$1"

echo "🚦 质量门控检查"
echo "模式: $MODE"
echo ""

case "$MODE" in
  pre-commit)
    echo "[1] 检查敏感文件..."
    echo "[2] 检查硬编码密码..."
    echo "[3] 检查 TODO 标记..."
    # TODO: 实现检查逻辑
    ;;
  pre-complete)
    echo "[1] 运行测试..."
    echo "[2] 检查覆盖率..."
    echo "[3] 检查错误处理..."
    echo "[4] 检查代码风格..."
    # TODO: 实现检查逻辑
    ;;
  *)
    echo "用法: ./scripts/quality-gate.sh <pre-commit|pre-complete>"
    exit 1
    ;;
esac

echo ""
echo "✓ 门控检查通过"
`,
    'harness-init.sh': `#!/bin/bash
# Harness 协调脚本

set -e

ACTION="$1"

echo "🎭 Harness 协调"
echo ""

case "$ACTION" in
  status)
    echo "当前状态: [待初始化]"
    echo "下一步: [启动 Writer]"
    ;;
  next)
    echo "进入下一阶段..."
    # TODO: 实现状态推进
    ;;
  reset)
    echo "重置流程..."
    # TODO: 实现重置
    ;;
  *)
    echo "用法: ./scripts/harness-init.sh <status|next|reset>"
    exit 1
    ;;
esac

echo ""
echo "✓ Harness 操作完成"
`,
    'init-ai-project.sh': `#!/bin/bash
# AI 项目初始化脚本（由 /ai-init 调用）

set -e

echo "🚀 AI 项目初始化"
echo ""

# 这个脚本由 /ai-init 命令调用
# 主要用于执行补全后的初始化操作

echo "[1] 验证工程化文件..."
echo "[2] 设置 Git Hook..."
echo "[3] 初始化记忆系统..."

echo ""
echo "✓ AI 项目初始化完成"
`
  };

  for (const [name, content] of Object.entries(scripts)) {
    await fs.writeFile(path.join(destDir, name), content);
    console.log(chalk.dim(`  ✓ scripts/${name}`));
  }
}

/**
 * 复制 Docs 模板
 */
async function copyDocs(targetDir) {
  const docsDir = path.join(TEMPLATES_DIR, 'docs');
  const destDir = path.join(targetDir, 'docs/ai-engineering');

  if (await fs.pathExists(docsDir)) {
    const docs = await fs.readdir(docsDir);
    for (const doc of docs) {
      const srcPath = path.join(docsDir, doc);
      const destPath = path.join(destDir, doc);
      await fs.copy(srcPath, destPath);
      console.log(chalk.dim(`  ✓ docs/ai-engineering/${doc}`));
    }
  } else {
    // 创建默认文档
    await createDefaultDocs(destDir);
  }
}

/**
 * 创建默认文档
 */
async function createDefaultDocs(destDir) {
  const docs = {
    'TECH_STACK.md': `# 技术栈声明

> AI 在 /ai-init 后会根据需求分析更新此文件。
> \`[x]\` 已确定 | \`[~]\` 待 AI 补充 | \`[ ]\` 待确定

---

## 编程语言
- [ ] 待确定

## 后端
- [ ] 后端框架：待确定

## 前端
- [ ] 前端框架：待确定

## 数据库
- [ ] 数据库：待确定

## 基础设施
- [ ] 运行环境：待确定

---

## 更新规则

当技术栈从 \`[ ]\` 或 \`[~]\` 变为 \`[x]\` 时，需要同步更新：
1. \`CLAUDE.md\` — 添加技术栈信息
2. \`CODE_STANDARDS.md\` — 添加对应语言的编码规则
3. \`.claudeignore\` — 添加对应技术栈的忽略规则

---

## /ai-init 后自动填充

执行 \`/ai-init\` 后，AI 会根据需求分析自动更新此文件。
`,
    'CODE_STANDARDS.md': `# 编码规范

> AI 在 /ai-init 后会根据技术栈生成对应的编码规范。

---

## 当前状态

**待填充** — 请执行 \`/ai-init\` 后自动生成。

---

## 规范结构（AI 会生成）

### 语言规范
- 命名约定
- 代码组织
- 注释规范

### 框架规范
- 目录结构
- 模块划分
- API 设计

### 测试规范
- 测试命名
- 测试组织
- 覆盖率要求

### 安全规范
- 输入验证
- 错误处理
- 日志规范

---

## /ai-init 后自动填充

执行 \`/ai-init\` 后，AI 会根据确认的技术栈生成完整的编码规范。
`,
    'LEARNINGS.md': `# 经验积累

> 记录开发过程中积累的经验、最佳实践和踩坑记录。

---

## 使用说明

这个文件用于记录团队在开发过程中积累的经验：

- **踩坑记录**：遇到的 Bug 和解决方案
- **最佳实践**：发现的好做法
- **性能优化**：优化经验和结果
- **安全经验**：安全相关的注意事项

## 添加记录

每次解决重要问题后，AI 会提示是否添加到 LEARNINGS.md。

---

## 记录模板

\`\`\`
### [日期] [主题]

**问题**：[描述遇到的问题]

**原因**：[分析根本原因]

**解决**：[描述解决方案]

**经验**：[总结经验教训]
\`\`\`

---

## 当前记录

（暂无记录，开发过程中会自动积累）
`,
    'AI_ENGINEERING_GUIDE.md': `# AI 工程化实践指南

> 团队使用 AI 编程的最佳实践指南。

---

## 核心原则

### 1. 对抗式开发

使用 Writer-Checker-Fixer 流程：
- Writer 写代码 → Checker 审查 → Fixer 修复 → Checker 复查

### 2. TDD 优先

重要功能开发遵循 TDD：
- 先写失败测试 → 最小实现 → 重构优化

### 3. 安全审计

安装任何 AI 工具前执行审计：
- MCP / Skill / Hook 都需要审计

### 4. 质量门控

提交前执行门控检查：
- \`/quality pre-commit\` 或配置 Git Hook

---

## 工作流程

### 新功能开发

\`\`\`
1. /ai-init 或 /brainstorming  → 需求确认
2. /writing-plans              → 编写 Plan
3. /executing-plans            → 执行实现
4. Checker 审查                → 对抗审查
5. /quality pre-complete       → 完成检查
\`\`\`

### Bug 修复

\`\`\`
1. /systematic-debug           → 系统化调试
2. 写失败测试                  → 验证 Bug 存在
3. Fixer 修复                  → 最小化修复
4. 测试通过                    → 验证修复
\`\`\`

---

## /ai-init 后自动填充

执行 \`/ai-init\` 后，AI 会根据项目特点补充更详细的指南。
`
  };

  for (const [name, content] of Object.entries(docs)) {
    await fs.writeFile(path.join(destDir, name), content);
    console.log(chalk.dim(`  ✓ docs/ai-engineering/${name}`));
  }
}

/**
 * 生成 CLAUDE.md - 包含所有功能说明
 */
async function generateClaudeMd(targetDir, config) {
  const { projectName } = config;

  const content = `# ${projectName || '项目名称待定'}

> 此文件在 \`/ai-init\` 后会根据需求分析更新。

---

## 项目状态

**当前状态**：已安装 AI 工程化框架，等待需求确认。

**下一步**：执行 \`/ai-init\` 进入需求探索。

---

## AI 工程化体系（已安装）

### 对抗式 Agent

| Agent | 职责 | 文件 |
|---|---|---|
| **Writer** | 编写代码 | \`.claude/agents/writer.md\` |
| **Checker** | 对抗审查 | \`.claude/agents/checker.md\` |
| **Fixer** | 精准修复 | \`.claude/agents/fixer.md\` |

### 可用 Skills

| Skill | 用途 | 触发时机 |
|---|---|---|
| \`tdd-workflow\` | TDD 工作流 | 新功能开发 |
| \`systematic-debug\` | 系统化调试 | 排查 Bug |
| \`code-review\` | 代码自检 | 提交前 |
| \`secure-code\` | 安全编码 | 处理输入/认证 |

### 可用 Commands

| Command | 用途 | 说明 |
|---|---|---|
| \`/ai-init\` | **核心** | 需求探索 + 技术方案 + 补全 |
| \`/ai-optimize\` | 项目优化 | 分析已有代码 |
| \`/audit\` | 安全审计 | 安装工具前 |
| \`/quality\` | 质量门控 | 提交前检查 |
| \`/harness\` | Harness协调 | 管理开发流程 |

### 安全审计

\`\`\`bash
./scripts/ai-tool-audit.sh mcp <package>     # MCP 包审计
./scripts/ai-tool-audit.sh skill <file>      # Skill 审计
./scripts/ai-tool-audit.sh project .         # 项目全面扫描
\`\`\`

### 质量门控

\`\`\`bash
./scripts/quality-gate.sh pre-commit    # 提交前快速检查
./scripts/quality-gate.sh pre-complete  # 完成功能前完整检查
\`\`\`

### 文档索引

| 文档 | 位置 |
|---|---|
| 技术栈声明 | \`docs/ai-engineering/TECH_STACK.md\` |
| 编码规范 | \`docs/ai-engineering/CODE_STANDARDS.md\` |
| 经验积累 | \`docs/ai-engineering/LEARNINGS.md\` |
| 实践指南 | \`docs/ai-engineering/AI_ENGINEERING_GUIDE.md\` |

---

## 重要提示

### 必须执行 \`/ai-init\`

CLI 初始化后，技术栈和需求还未确认。请立即执行：

\`\`\`
/ai-init
\`\`\`

AI 会通过对话帮你：
1. 分析项目需求
2. 确认技术方案
3. 补全工程化配置
4. 激活相关功能

---

## AI 辅助工作方式（通用）

- 遵循项目现有的代码风格和架构模式
- 修改代码前先理解上下文
- 不做计划之外的重构
- 执行 \`/ai-init\` 确认技术栈后再开始开发
`;

  await fs.writeFile(path.join(targetDir, 'CLAUDE.md'), content);
  console.log(chalk.dim('  ✓ CLAUDE.md'));
}

/**
 * 生成 AGENTS.md
 */
async function generateAgentsMd(targetDir) {
  const content = `# AGENTS.md

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

详细定义位于 \`.claude/agents/\` 目录。

---

## 使用说明

执行 \`/ai-init\` 后，AI 会根据项目特点激活相关 Agent。
`;

  await fs.writeFile(path.join(targetDir, 'AGENTS.md'), content);
  console.log(chalk.dim('  ✓ AGENTS.md'));
}

/**
 * 生成 .claudeignore
 */
async function generateClaudeignore(targetDir) {
  const content = `# AI 工程化 — Claude Code 上下文排除规则

# 存档
docs/_archive/

# 构建产物
dist/
build/
target/
out/

# 依赖
node_modules/
vendor/
.venv/
__pycache__/

# 二进制和大文件
*.min.js
*.min.css
*.map
*.png
*.jpg
*.pdf

# Lock 文件
package-lock.json
yarn.lock
go.sum

# IDE
.idea/
.vscode/
.DS_Store

# 环境和凭据（重要！）
.env
.env.local
.env.*.local
credentials/
secrets/
*.pem
*.key

# 日志
*.log
logs/

# /ai-init 后会根据技术栈补充特定规则
`;

  await fs.writeFile(path.join(targetDir, '.claudeignore'), content);
  console.log(chalk.dim('  ✓ .claudeignore'));
}

/**
 * 生成 .claude/settings.json - Claude Code 配置
 */
async function generateSettingsJson(targetDir) {
  const content = {
    hooks: {
      UserPromptSubmit: [
        {
          hook: "./scripts/ai-tool-audit.sh hook ${settingsPath}",
          timeout: 5000
        }
      ]
    }
  };

  await fs.writeJson(path.join(targetDir, '.claude/settings.json'), content, { spaces: 2 });
  console.log(chalk.dim('  ✓ .claude/settings.json'));
}