---
description: AI 工程化自动优化 — 分析项目并补充完整的 AI 工程化内容
---

# AI 工程化优化

此命令自动分析项目并补充完整的 AI 工程化内容，适用于：

1. CLI 初始化后，自定义语言需要补充规则
2. 已存在的项目，CLI 添加基础框架后需要完整补充
3. 技术栈变更后需要同步更新相关文档

## 执行流程

### 第 1 步：分析项目结构

扫描项目根目录，识别：
- 配置文件：`package.json`、`go.mod`、`pyproject.toml`、`Cargo.toml` 等
- 源代码目录：`src/`、`lib/`、`app/`、`internal/` 等
- 测试目录：`tests/`、`__tests__/`、`spec/` 等
- CI/CD 配置：`.github/workflows/`、`.gitlab-ci.yml` 等

### 第 2 步：识别技术栈

从配置文件中提取：
- **编程语言**：从 `package.json`（JS/TS）、`go.mod`（Go）、`pyproject.toml`（Python）等
- **框架**：从依赖列表识别（FastAPI、Gin、React、Vue 等）
- **数据库**：从依赖或配置识别（PostgreSQL、MySQL、MongoDB 等）
- **运行环境**：从 Dockerfile、CI 配置识别

如果无法自动识别，询问用户确认。

### 第 3 步：分析代码风格

抽样读取 3-5 个源文件，识别：
- 命名风格（camelCase/snake_case/PascalCase）
- 错误处理方式（异常/返回值/Result 类型）
- 注释风格（是否有文档注释）
- 函数平均长度

### 第 4 步：补充 CODE_STANDARDS.md

根据识别的技术栈和代码风格，更新 `docs/ai-engineering/CODE_STANDARDS.md`：

1. 添加语言特定的编码规则
2. 添加框架特定的最佳实践
3. 保留用户已自定义的内容

### 第 5 步：生成 rules/

为识别的语言创建规则文件：

```
rules/
├── <language>/
│   ├── core.md           # 核心规则
│   ├── error-handling.md # 错误处理
│   └── naming.md         # 命名规范
```

### 第 6 步：更新 .claudeignore

添加语言特定的忽略规则：

```gitignore
# <语言> 特定
__pycache__/
*.pyc
.pytest_cache/
```

### 第 7 步：更新 TECH_STACK.md

将 `[~]` 改为 `[x]`，填充技术栈详情。

### 第 8 步：输出报告

```
✓ AI 工程化优化完成

识别的技术栈:
  - 语言: <语言>
  - 后端: <框架>
  - 数据库: <数据库>
  - 前端: <框架>

已补充:
  ✓ CODE_STANDARDS.md — <语言> 规则已添加
  ✓ rules/<语言>/ — 生成 X 条核心规则
  ✓ .claudeignore — 添加特定忽略规则
  ✓ TECH_STACK.md — 全部标记为 [x]

建议执行:
  /audit — 运行安全审计
  /quality — 运行质量门控检查
```

## 注意事项

- 不覆盖用户已自定义的内容
- 如果无法确定某些信息，询问用户确认
- 保持与现有项目风格一致