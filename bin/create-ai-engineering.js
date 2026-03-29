#!/usr/bin/env node

/**
 * create-ai-engineering CLI 入口
 *
 * 用法:
 *   npx create-ai-engineering [project-name]
 *   npx create-ai-engineering --add-to-existing .
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from '../src/index.js';

const program = new Command();

program
  .name('create-ai-engineering')
  .description('AI 工程化项目初始化 CLI')
  .version('0.1.0')
  .argument('[project-name]', '项目名称', '.')
  .option('-p, --profile <profile>', '安装配置 (core|developer|security|full)', 'developer')
  .option('-q, --quick', '快速模式（跳过交互）', false)
  .option('--add-to-existing', '添加到已存在的项目', false)
  .option('--platform <platform>', '目标平台 (claude-code|cursor|codex|opencode)', 'claude-code')
  .action(async (projectName, options) => {
    console.log(chalk.bold.cyan('\n═══════════════════════════════════════════════'));
    console.log(chalk.bold('  AI 工程化项目初始化'));
    console.log(chalk.bold.cyan('═══════════════════════════════════════════════\n'));

    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red(`\n✗ 错误: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();