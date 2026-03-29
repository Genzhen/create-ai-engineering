/**
 * 安装执行模块
 */

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, 'templates');

/**
 * 安装项目
 * @param {object} config - 用户配置
 */
export async function installProject(config) {
  const { targetDir, platforms, profile, isCurrentDir, addToExisting } = config;

  console.log(chalk.cyan('\n[1/4] 创建目录结构...'));

  // 创建目录
  const dirs = [
    '.claude/agents',
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

  console.log(chalk.cyan('\n[2/4] 复制模板文件...'));

  // 为每个平台复制文件
  for (const platform of platforms) {
    await copyPlatformFiles(targetDir, platform, config);
  }

  console.log(chalk.cyan('\n[3/4] 生成配置文件...'));

  // 生成 CLAUDE.md
  await generateClaudeMd(targetDir, config);

  // 生成 AGENTS.md
  await generateAgentsMd(targetDir);

  // 生成 TECH_STACK.md
  await generateTechStackMd(targetDir, config);

  // 生成 .claudeignore
  await generateClaudeignore(targetDir, config);

  // 复制脚本
  await copyScripts(targetDir);

  console.log(chalk.cyan('\n[4/4] 完成配置...'));

  // 生成 package.json（如果不存在）
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (!await fs.pathExists(packageJsonPath)) {
    await generatePackageJson(targetDir, config);
  }
}

/**
 * 复制平台特定文件
 */
async function copyPlatformFiles(targetDir, platform, config) {
  const platformTemplates = {
    'claude-code': ['skills', 'commands', 'agents', 'docs'],
    'cursor': ['cursorrules', 'commands'],
    'codex': ['agents-md', 'instructions'],
    'opencode': ['agents-md', 'instructions']
  };

  console.log(chalk.dim(`  平台: ${platform}`));

  // 这里应该从模板目录复制实际文件
  // 由于模板目录是空的，我们只创建占位符
}

/**
 * 生成 CLAUDE.md
 */
async function generateClaudeMd(targetDir, config) {
  const { projectName, languages, backend, frontend, database, infra } = config;

  let techStackSection = '';
  if (languages && languages.length > 0) {
    techStackSection = `
## 技术栈

### 编程语言
${languages.map(l => `- ${l}`).join('\n')}
`;
  }

  const content = `# ${projectName}

${techStackSection}
## AI 辅助工作方式

- 遵循项目现有的代码风格和架构模式
- 修改代码前先理解上下文
- 不做计划之外的重构

## AI 工程化体系

### 多层记忆架构

| 层级 | 位置 | 特点 | 内容 |
|---|---|---|---|
| **项目知识** | \`docs/ai-engineering/\`（git 管理） | 团队共享 | 技术栈、编码规范、积累的经验 |
| **个人记忆** | \`~/.claude/projects/\`（本地） | 个人的 | 个人偏好、上下文 |

### 对抗式 Agent

1. **Writer** (\`.claude/agents/writer.md\`) — 编写代码
2. **Checker** (\`.claude/agents/checker.md\`) — 对抗性审查
3. **Fixer** (\`.claude/agents/fixer.md\`) — 精准修复

### 可用 Skills

| Skill | 用途 | 触发时机 |
|---|---|---|
| \`tdd-workflow\` | TDD 工作流 | 新功能开发 |
| \`systematic-debug\` | 系统化调试 | 排查 Bug |
| \`code-review\` | 提交前自检 | 准备 PR 时 |
| \`secure-code\` | 安全编码 | 处理输入/认证/权限时 |

### 可用 Commands

| Command | 用途 | 触发时机 |
|---|---|---|
| \`/ai-optimize\` | AI 工程化自动优化 | 初始化后补充完整内容 |
| \`/audit\` | 安全审计 | 安装工具或提交前 |
| \`/harness\` | Harness 协调 | 管理功能开发流程 |
| \`/quality\` | 质量门控 | 提交前/完成前检查 |

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
| 团队实践指南 | \`docs/ai-engineering/AI_ENGINEERING_GUIDE.md\` |
| 编码标准 | \`docs/ai-engineering/CODE_STANDARDS.md\` |
| 技术栈声明 | \`docs/ai-engineering/TECH_STACK.md\` |
| 团队经验 | \`docs/ai-engineering/LEARNINGS.md\` |
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
`;

  await fs.writeFile(path.join(targetDir, 'AGENTS.md'), content);
  console.log(chalk.dim('  ✓ AGENTS.md'));
}

/**
 * 生成 TECH_STACK.md
 */
async function generateTechStackMd(targetDir, config) {
  const { languages, backend, frontend, database, infra } = config;

  const langItems = (languages || []).map(l => {
    const isCustom = !['Python', 'TypeScript', 'Go', 'Rust', 'Java', 'C#', 'PHP', 'Ruby', 'Swift'].includes(l);
    return `- ${isCustom ? '[~]' : '[x]'} ${l}`;
  }).join('\n');

  const content = `# 技术栈声明

> AI 在 Plan 模式后会根据此文件更新相关文档。
> \`[x]\` 已确定 | \`[~]\` 待 AI 补充 | \`[ ]\` 待确定

---

## 编程语言
${langItems || '- [ ] 待确定'}

## 后端
- ${backend && backend !== '待定' ? `[x] ${backend}` : '[ ] 后端框架：待定'}

## 前端
- ${frontend && frontend !== '待定' && frontend !== '无' ? `[x] ${frontend}` : '[ ] 前端框架：' + (frontend || '待定')}

## 数据库
- ${database && database !== '待定' ? `[x] ${database}` : '[ ] 数据库：待定'}

## 基础设施
- ${infra && infra !== '待定' ? `[x] ${infra}` : '[ ] 运行环境：待定'}

---

## 更新规则

当技术栈从 \`[ ]\` 或 \`[~]\` 变为 \`[x]\` 时，需要同步更新：
1. \`CLAUDE.md\` — 添加技术栈信息
2. \`docs/ai-engineering/CODE_STANDARDS.md\` — 添加对应语言的编码规则
3. \`.claudeignore\` — 添加对应技术栈的忽略规则
`;

  await fs.writeFile(path.join(targetDir, 'docs/ai-engineering/TECH_STACK.md'), content);
  console.log(chalk.dim('  ✓ docs/ai-engineering/TECH_STACK.md'));
}

/**
 * 生成 .claudeignore
 */
async function generateClaudeignore(targetDir, config) {
  const { languages } = config;

  let langIgnores = '';

  if (languages?.includes('Python')) {
    langIgnores += `
# Python
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
*.egg-info/
`;
  }

  if (languages?.includes('TypeScript') || languages?.includes('JavaScript')) {
    langIgnores += `
# TypeScript/JavaScript
node_modules/
dist/
*.tsbuildinfo
`;
  }

  if (languages?.includes('Go')) {
    langIgnores += `
# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
`;
  }

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
${langIgnores}
# IDE
.idea/
.vscode/
.DS_Store
`;

  await fs.writeFile(path.join(targetDir, '.claudeignore'), content);
  console.log(chalk.dim('  ✓ .claudeignore'));
}

/**
 * 复制脚本
 */
async function copyScripts(targetDir) {
  // 由于我们在模板目录，这里应该复制脚本
  // 简化处理，创建占位符
  const scripts = [
    'init-ai-project.sh',
    'harness-init.sh',
    'quality-gate.sh',
    'ai-tool-audit.sh'
  ];

  for (const script of scripts) {
    const scriptPath = path.join(targetDir, 'scripts', script);
    if (!await fs.pathExists(scriptPath)) {
      // 创建占位符，实际使用时应该从模板复制
      await fs.writeFile(scriptPath, `#!/bin/bash\n# ${script}\n`);
    }
  }

  console.log(chalk.dim('  ✓ scripts/'));
}

/**
 * 生成 package.json
 */
async function generatePackageJson(targetDir, config) {
  const content = {
    name: config.projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: '',
    scripts: {
      init: './scripts/init-ai-project.sh',
      audit: './scripts/ai-tool-audit.sh project .',
      quality: './scripts/quality-gate.sh pre-commit'
    }
  };

  await fs.writeJson(path.join(targetDir, 'package.json'), content, { spaces: 2 });
  console.log(chalk.dim('  ✓ package.json'));
}