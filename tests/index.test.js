/**
 * index.js 测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DIR = path.join(__dirname, 'temp-index-test');

// Mock chalk
vi.mock('chalk', () => {
  const fn = (str) => str;
  return {
    default: {
      cyan: fn,
      green: fn,
      yellow: fn,
      red: fn,
      dim: fn,
      bold: {
        cyan: fn,
        green: fn,
        yellow: fn,
      }
    }
  };
});

// Mock prompts
vi.mock('../src/prompts.js', () => ({
  runPrompts: vi.fn().mockResolvedValue({ platforms: ['claude-code'] })
}));

// Mock installer
vi.mock('../src/installer.js', () => ({
  installProject: vi.fn().mockResolvedValue(undefined)
}));

describe('index', () => {
  let originalCwd;

  beforeEach(async () => {
    await fs.ensureDir(TEST_DIR);
    vi.clearAllMocks();
    originalCwd = process.cwd;
  });

  afterEach(async () => {
    await fs.remove(TEST_DIR);
    process.cwd = originalCwd;
    vi.resetModules();
  });

  describe('createProject', () => {
    it('应该在新目录中创建项目', async () => {
      process.cwd = () => TEST_DIR;

      const { createProject } = await import('../src/index.js');
      const installer = await import('../src/installer.js');

      await createProject('new-project', {});

      expect(installer.installProject).toHaveBeenCalled();
    });

    it('快速模式应该使用默认配置', async () => {
      process.cwd = () => TEST_DIR;

      const { createProject } = await import('../src/index.js');
      const prompts = await import('../src/prompts.js');
      const installer = await import('../src/installer.js');

      await createProject('quick-project', { quick: true });

      // 快速模式不应该调用 prompts
      expect(prompts.runPrompts).not.toHaveBeenCalled();

      const configArg = installer.installProject.mock.calls[0][0];
      expect(configArg.platforms).toContain('claude-code');
    });

    it('快速模式应该使用指定的平台', async () => {
      process.cwd = () => TEST_DIR;

      const { createProject } = await import('../src/index.js');
      const installer = await import('../src/installer.js');

      await createProject('custom-platform-project', {
        quick: true,
        platform: 'cursor'
      });

      const configArg = installer.installProject.mock.calls[0][0];
      expect(configArg.platforms).toContain('cursor');
    });

    it('应该在现有目录上添加（使用 --add-to-existing）', async () => {
      process.cwd = () => TEST_DIR;

      // 创建一个已存在的目录
      const existingDir = path.join(TEST_DIR, 'existing-project');
      await fs.ensureDir(existingDir);
      await fs.writeFile(path.join(existingDir, 'some-file.txt'), 'content');

      const { createProject } = await import('../src/index.js');
      const installer = await import('../src/installer.js');

      await createProject('existing-project', {
        addToExisting: true,
        quick: true
      });

      expect(installer.installProject).toHaveBeenCalled();
    });

    it('非空目录应该报错（未使用 --add-to-existing）', async () => {
      process.cwd = () => TEST_DIR;

      // 创建一个非空目录
      const nonEmptyDir = path.join(TEST_DIR, 'non-empty-project');
      await fs.ensureDir(nonEmptyDir);
      await fs.writeFile(path.join(nonEmptyDir, 'file.txt'), 'content');

      // Mock process.exit
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});

      const { createProject } = await import('../src/index.js');

      await createProject('non-empty-project', {});

      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });

    it('应该合并配置选项', async () => {
      process.cwd = () => TEST_DIR;

      const { createProject } = await import('../src/index.js');
      const installer = await import('../src/installer.js');

      await createProject('merge-config-project', {
        quick: true,
        platform: 'claude-code',
        customOption: 'test-value'
      });

      const configArg = installer.installProject.mock.calls[0][0];
      expect(configArg.projectName).toBe('merge-config-project');
      expect(configArg.customOption).toBe('test-value');
    });

    it('当前目录（.）应该使用目录名作为项目名', async () => {
      process.cwd = () => TEST_DIR;

      const { createProject } = await import('../src/index.js');
      const installer = await import('../src/installer.js');

      await createProject('.', {
        quick: true
      });

      const configArg = installer.installProject.mock.calls[0][0];
      expect(configArg.isCurrentDir).toBe(true);
    });
  });

  describe('printCompletion', () => {
    it('应该输出完成信息包含 /ai-init', async () => {
      process.cwd = () => TEST_DIR;

      const consoleSpy = vi.spyOn(console, 'log');

      const { createProject } = await import('../src/index.js');

      await createProject('completion-test', { quick: true });

      const output = consoleSpy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('/ai-init');

      consoleSpy.mockRestore();
    });

    it('应该提示 cd 命令（非当前目录）', async () => {
      process.cwd = () => TEST_DIR;

      const consoleSpy = vi.spyOn(console, 'log');

      const { createProject } = await import('../src/index.js');

      await createProject('cd-hint-test', { quick: true });

      const output = consoleSpy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('cd');

      consoleSpy.mockRestore();
    });
  });
});