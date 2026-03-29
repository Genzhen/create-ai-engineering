/**
 * 交互式问答模块 - 简化版
 *
 * 设计理念：CLI 只负责搭建基础框架，技术栈选择由 /ai-init 在 AI 辅助下完成。
 */

import inquirer from 'inquirer';

/**
 * 运行交互式问答
 * @param {object} options - CLI 选项
 * @returns {Promise<object>} 用户配置
 */
export async function runPrompts(options) {
  const questions = [];

  // 平台选择（唯一保留的交互）
  questions.push({
    type: 'checkbox',
    name: 'platforms',
    message: '选择目标平台:',
    choices: [
      { name: 'Claude Code (推荐)', value: 'claude-code', checked: true },
      { name: 'Cursor', value: 'cursor' },
      { name: 'Codex (OpenAI)', value: 'codex' },
      { name: 'OpenCode', value: 'opencode' }
    ]
  });

  const answers = await inquirer.prompt(questions);

  return answers;
}