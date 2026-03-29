# /ai-init Command

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

**自动触发** `superpowers:brainstorming` Skill，进入 Plan 模式。

AI 使用 brainstorming 的能力：
- 灵活对话采集需求
- 逐步深入技术方案
- 确认并总结方案

**用户可随时结束对话**，AI 基于已收集信息继续。

### Phase 3: 自动补全工程化内容

Plan 确认后，执行以下补全操作：

| 文件 | 操作 |
|---|---|
| `docs/ai-engineering/TECH_STACK.md` | 更新技术栈信息 |
| `CLAUDE.md` | 添加技术栈和项目说明 |
| `docs/ai-engineering/CODE_STANDARDS.md` | 创建编码规范 |
| `.claudeignore` | 更新忽略规则 |
| `rules/<语言>/` | 创建语言规则目录 |
| Agents | 激活相关 Agent |
| Skills | 激活相关 Skill |

## 关键说明

**/ai-init 不定义固定问卷**，而是：
- 检测项目状态
- 触发 brainstorming skill
- 让 AI 自主决定对话方式
- 在需求确认后执行补全

## 示例用法

```
# CLI 初始化后
cd my-project
# 在 Claude Code 中
> /ai-init

# AI 检测到空白项目
# AI 触发 brainstorming 进入 Plan 模式
# AI 开始对话采集需求...
```
