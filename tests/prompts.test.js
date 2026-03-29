/**
 * prompts.js 测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock inquirer
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn()
  }
}));

describe('prompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('runPrompts', () => {
    it('应该返回平台选择结果', async () => {
      const inquirer = await import('inquirer');
      inquirer.default.prompt.mockResolvedValueOnce({
        platforms: ['claude-code']
      });

      const { runPrompts } = await import('../src/prompts.js');
      const result = await runPrompts({});

      expect(result.platforms).toEqual(['claude-code']);
    });

    it('应该返回多个平台选择', async () => {
      const inquirer = await import('inquirer');
      inquirer.default.prompt.mockResolvedValueOnce({
        platforms: ['claude-code', 'cursor']
      });

      const { runPrompts } = await import('../src/prompts.js');
      const result = await runPrompts({});

      expect(result.platforms).toEqual(['claude-code', 'cursor']);
    });

    it('应该只询问平台选择（无技术栈询问）', async () => {
      const inquirer = await import('inquirer');
      inquirer.default.prompt.mockResolvedValueOnce({
        platforms: ['claude-code']
      });

      const { runPrompts } = await import('../src/prompts.js');
      await runPrompts({});

      // 检查 prompt 只被调用一次（只有平台选择）
      expect(inquirer.default.prompt).toHaveBeenCalledTimes(1);

      // 检查传入的问题只有一个
      const callArgs = inquirer.default.prompt.mock.calls[0][0];
      expect(callArgs.length).toBe(1);
      expect(callArgs[0].name).toBe('platforms');
    });

    it('平台选择应该是多选（checkbox）', async () => {
      const inquirer = await import('inquirer');
      inquirer.default.prompt.mockResolvedValueOnce({
        platforms: ['claude-code']
      });

      const { runPrompts } = await import('../src/prompts.js');
      await runPrompts({});

      const callArgs = inquirer.default.prompt.mock.calls[0][0];
      expect(callArgs[0].type).toBe('checkbox');
    });

    it('应该包含所有平台选项', async () => {
      const inquirer = await import('inquirer');
      inquirer.default.prompt.mockResolvedValueOnce({
        platforms: ['claude-code']
      });

      const { runPrompts } = await import('../src/prompts.js');
      await runPrompts({});

      const callArgs = inquirer.default.prompt.mock.calls[0][0];
      const choices = callArgs[0].choices.map(c => c.value);

      expect(choices).toContain('claude-code');
      expect(choices).toContain('cursor');
      expect(choices).toContain('codex');
      expect(choices).toContain('opencode');
    });

    it('Claude Code 应该默认选中', async () => {
      const inquirer = await import('inquirer');
      inquirer.default.prompt.mockResolvedValueOnce({
        platforms: ['claude-code']
      });

      const { runPrompts } = await import('../src/prompts.js');
      await runPrompts({});

      const callArgs = inquirer.default.prompt.mock.calls[0][0];
      const claudeChoice = callArgs[0].choices.find(c => c.value === 'claude-code');

      expect(claudeChoice.checked).toBe(true);
    });
  });
});