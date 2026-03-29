/**
 * create-ai-engineering 主模块 - 简化版
 *
 * 设计理念：CLI 只负责搭建基础框架，全量安装模板文件。
 * 技术栈选择和工程化内容补全由 /ai-init 在 AI 辅助下完成。
 */

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { runPrompts } from './prompts.js';
import { installProject } from './installer.js';

/**
 * 创建项目
 * @param {string} projectName - 项目名称或路径
 * @param {object} options - CLI 选项
 */
export async function createProject(projectName, options) {
  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, projectName);
  const isCurrentDir = projectName === '.' || projectName === './';

  // 检查目录
  if (!options.add && fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    if (!options.addToExisting) {
      console.log(chalk.yellow(`⚠ 目录 ${targetDir} 已存在且非空`));
      console.log(chalk.dim('  使用 --add-to-existing 添加到现有项目'));
      process.exit(1);
    }
  }

  // 收集用户输入（只收集平台选择）
  let config;
  if (options.quick) {
    config = getDefaultConfig(options);
  } else {
    config = await runPrompts(options);
  }

  // 合并选项
  config = {
    ...config,
    projectName: isCurrentDir ? path.basename(targetDir) : projectName,
    targetDir,
    isCurrentDir,
    ...options
  };

  // 执行安装（全量安装）
  await installProject(config);

  // 输出完成信息
  printCompletion(config);
}

/**
 * 获取默认配置（快速模式）
 */
function getDefaultConfig(options) {
  return {
    platforms: [options.platform || 'claude-code']
  };
}

/**
 * 输出完成信息 - 强调下一步执行 /ai-init
 */
function printCompletion(config) {
  console.log(chalk.bold.green('\n✓ 项目初始化完成!\n'));

  // 核心提示：下一步必须执行 /ai-init
  console.log(chalk.bold.yellow('═══════════════════════════════════════════════'));
  console.log(chalk.bold.yellow('  重要：下一步必须执行 /ai-init'));
  console.log(chalk.bold.yellow('═══════════════════════════════════════════════\n'));

  console.log(chalk.cyan('AI 将通过苏格拉底式对话帮你：'));
  console.log(chalk.dim('  1. 分析项目需求'));
  console.log(chalk.dim('  2. 确认技术方案'));
  console.log(chalk.dim('  3. 补全工程化配置'));
  console.log(chalk.dim('  4. 激活相关功能\n'));

  console.log(chalk.dim('已安装的功能模块（参考文档状态）：'));
  console.log(chalk.dim('  .claude/agents/     — 对抗式 Agent (Writer/Checker/Fixer)'));
  console.log(chalk.dim('  skills/             — 工作流 Skills (TDD/调试/审查等)'));
  console.log(chalk.dim('  commands/           — Slash Commands'));
  console.log(chalk.dim('  docs/ai-engineering/— 团队共享文档'));
  console.log(chalk.dim('  scripts/            — 工具脚本'));
  console.log(chalk.dim('  CLAUDE.md           — AI 项目规范'));
  console.log(chalk.dim('  AGENTS.md           — 跨平台 Agent 定义\n'));

  if (!config.isCurrentDir) {
    console.log(chalk.bold.cyan(`cd ${config.projectName}`));
  }
  console.log(chalk.bold.cyan('在 Claude Code 中执行: /ai-init'));
  console.log('');
}