/**
 * create-ai-engineering 主模块
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

  // 收集用户输入
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

  // 执行安装
  await installProject(config);

  // 输出完成信息
  printCompletion(config);
}

/**
 * 获取默认配置（快速模式）
 */
function getDefaultConfig(options) {
  return {
    platforms: [options.platform || 'claude-code'],
    profile: options.profile || 'developer',
    languages: [],
    backend: '待定',
    frontend: '待定',
    database: '待定',
    infra: '待定'
  };
}

/**
 * 输出完成信息
 */
function printCompletion(config) {
  console.log(chalk.bold.green('\n✓ 项目初始化完成!\n'));

  if (config.languages.length === 0 || config.languages.includes('其他')) {
    console.log(chalk.yellow('⚠ 自定义语言或技术栈待补充\n'));
    console.log(chalk.dim('💡 下一步:'));
    console.log(chalk.dim('  1. 在 Claude Code 中打开项目'));
    console.log(chalk.dim('  2. 执行 /ai-optimize 命令'));
    console.log(chalk.dim('  3. AI 将自动分析项目并补充完整的 AI 工程化内容\n'));
  }

  console.log(chalk.dim('已创建:'));
  console.log(chalk.dim('  .claude/agents/     — 对抗式 Agent'));
  console.log(chalk.dim('  skills/             — 工作流 Skills'));
  console.log(chalk.dim('  commands/           — Slash Commands'));
  console.log(chalk.dim('  docs/ai-engineering/— 团队共享文档'));
  console.log(chalk.dim('  scripts/            — 工具脚本'));
  console.log(chalk.dim('  CLAUDE.md           — AI 项目规范'));
  console.log(chalk.dim('  AGENTS.md           — 跨平台 Agent 定义\n'));

  if (!config.isCurrentDir) {
    console.log(chalk.cyan(`cd ${config.projectName}`));
  }
  console.log(chalk.cyan('git add . && git commit -m "初始化 AI 工程化配置"'));
  console.log('');
}