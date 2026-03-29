/**
 * installer.js 测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DIR = path.join(__dirname, 'temp-test-project');

// 模拟 chalk - 使用 default export
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

describe('installer', () => {
  beforeEach(async () => {
    // 创建测试目录
    await fs.ensureDir(TEST_DIR);
  });

  afterEach(async () => {
    // 清理测试目录
    await fs.remove(TEST_DIR);
  });

  describe('目录结构创建', () => {
    it('应该创建所有必要的目录', async () => {
      const { installProject } = await import('../src/installer.js');

      const config = {
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      };

      await installProject(config);

      const expectedDirs = [
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

      for (const dir of expectedDirs) {
        const fullPath = path.join(TEST_DIR, dir);
        expect(await fs.pathExists(fullPath)).toBe(true);
      }
    });
  });

  describe('Agent 文件创建', () => {
    it('应该创建 writer.md', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      });

      const writerPath = path.join(TEST_DIR, '.claude/agents/writer.md');
      expect(await fs.pathExists(writerPath)).toBe(true);

      const content = await fs.readFile(writerPath, 'utf-8');
      expect(content).toContain('Writer Agent');
    });

    it('应该创建 checker.md', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      });

      const checkerPath = path.join(TEST_DIR, '.claude/agents/checker.md');
      expect(await fs.pathExists(checkerPath)).toBe(true);

      const content = await fs.readFile(checkerPath, 'utf-8');
      expect(content).toContain('Checker Agent');
    });

    it('应该创建 fixer.md', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      });

      const fixerPath = path.join(TEST_DIR, '.claude/agents/fixer.md');
      expect(await fs.pathExists(fixerPath)).toBe(true);

      const content = await fs.readFile(fixerPath, 'utf-8');
      expect(content).toContain('Fixer Agent');
    });
  });

  describe('Skills 文件创建', () => {
    it('应该创建所有 Skill 文件', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      });

      const expectedSkills = [
        'tdd-workflow.md',
        'systematic-debug.md',
        'code-review.md',
        'secure-code.md'
      ];

      for (const skill of expectedSkills) {
        const skillPath = path.join(TEST_DIR, '.claude/skills', skill);
        expect(await fs.pathExists(skillPath)).toBe(true);
      }
    });
  });

  describe('Commands 文件创建', () => {
    it('应该创建 ai-init.md（核心命令）', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      });

      const aiInitPath = path.join(TEST_DIR, '.claude/commands/ai-init.md');
      expect(await fs.pathExists(aiInitPath)).toBe(true);

      const content = await fs.readFile(aiInitPath, 'utf-8');
      expect(content).toContain('/ai-init');
      expect(content).toContain('brainstorming');
    });
  });

  describe('CLAUDE.md 生成', () => {
    it('应该包含项目名称', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'my-awesome-project'
      });

      const claudeMdPath = path.join(TEST_DIR, 'CLAUDE.md');
      const content = await fs.readFile(claudeMdPath, 'utf-8');
      expect(content).toContain('my-awesome-project');
    });

    it('应该提示执行 /ai-init', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      });

      const claudeMdPath = path.join(TEST_DIR, 'CLAUDE.md');
      const content = await fs.readFile(claudeMdPath, 'utf-8');
      expect(content).toContain('/ai-init');
    });
  });

  describe('settings.json 生成', () => {
    it('应该是有效的 JSON 文件', async () => {
      const { installProject } = await import('../src/installer.js');

      await installProject({
        targetDir: TEST_DIR,
        platforms: ['claude-code'],
        projectName: 'test-project'
      });

      const settingsPath = path.join(TEST_DIR, '.claude/settings.json');
      expect(await fs.pathExists(settingsPath)).toBe(true);

      const content = await fs.readJson(settingsPath);
      expect(content).toHaveProperty('hooks');
    });
  });
});