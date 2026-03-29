/**
 * 交互式问答模块
 */

import inquirer from 'inquirer';

/**
 * 运行交互式问答
 * @param {object} options - CLI 选项
 * @returns {Promise<object>} 用户配置
 */
export async function runPrompts(options) {
  const questions = [];

  // 平台选择
  questions.push({
    type: 'checkbox',
    name: 'platforms',
    message: '选择目标平台:',
    choices: [
      { name: 'Claude Code', value: 'claude-code', checked: true },
      { name: 'Cursor', value: 'cursor' },
      { name: 'Codex (OpenAI)', value: 'codex' },
      { name: 'OpenCode', value: 'opencode' }
    ]
  });

  // Profile 选择
  questions.push({
    type: 'list',
    name: 'profile',
    message: '选择安装配置:',
    choices: [
      { name: 'developer (推荐) - 完整的 AI 工程化体系', value: 'developer' },
      { name: 'core - 最小化配置', value: 'core' },
      { name: 'security - 安全强化配置', value: 'security' },
      { name: 'full - 包含所有组件', value: 'full' }
    ],
    default: 'developer'
  });

  // 编程语言
  questions.push({
    type: 'checkbox',
    name: 'languages',
    message: '选择编程语言 (空格选择，回车确认):',
    choices: [
      { name: 'Python', value: 'Python' },
      { name: 'TypeScript / JavaScript', value: 'TypeScript' },
      { name: 'Go', value: 'Go' },
      { name: 'Rust', value: 'Rust' },
      { name: 'Java / Kotlin', value: 'Java' },
      { name: 'C# / .NET', value: 'C#' },
      { name: 'PHP', value: 'PHP' },
      { name: 'Ruby', value: 'Ruby' },
      { name: 'Swift / Objective-C', value: 'Swift' },
      { name: '其他 (手动输入)', value: '其他' }
    ]
  });

  // 如果选择了"其他"，询问具体语言
  questions.push({
    type: 'input',
    name: 'customLanguage',
    message: '请输入编程语言名称:',
    when: (answers) => answers.languages.includes('其他'),
    filter: (input) => input.trim() || '自定义语言'
  });

  // 后端框架
  questions.push({
    type: 'input',
    name: 'backend',
    message: '后端框架 (如 Gin, FastAPI, Express，待定则回车):',
    default: '待定'
  });

  // 前端框架
  questions.push({
    type: 'input',
    name: 'frontend',
    message: '前端框架 (如 React, Vue，无则填 无):',
    default: '待定'
  });

  // 数据库
  questions.push({
    type: 'input',
    name: 'database',
    message: '数据库 (如 PostgreSQL, MySQL，待定则回车):',
    default: '待定'
  });

  // 运行环境
  questions.push({
    type: 'input',
    name: 'infra',
    message: '运行环境 (如 Docker, K8s，待定则回车):',
    default: '待定'
  });

  const answers = await inquirer.prompt(questions);

  // 处理自定义语言
  if (answers.customLanguage) {
    const index = answers.languages.indexOf('其他');
    if (index > -1) {
      answers.languages[index] = answers.customLanguage;
    }
    delete answers.customLanguage;
  }

  return answers;
}