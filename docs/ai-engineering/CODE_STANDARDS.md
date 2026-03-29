# 编码规范

> create-ai-engineering CLI 工具的编码规范

---

## JavaScript/ES Modules 规范

### 文件组织

```
项目结构：
├── bin/              # CLI 入口
├── src/              # 源代码模块
│   ├── index.js      # 主逻辑
│   ├── prompts.js    # 交互问答
│   └── installer.js  # 安装逻辑
├── templates/        # 模板文件（按类型分目录）
└── docs/             # 文档
```

### 命名约定

| 类型 | 规范 | 示例 |
|---|---|---|
| 文件名 | 小驼峰 | `prompts.js`, `installer.js` |
| 函数名 | 小驼峰 | `runPrompts()`, `installProject()` |
| 常量 | 大驼峰或小驼峰 | `TEMPLATES_DIR`, `defaultConfig` |
| 私有函数 | 逻辑分组即可 | `createDefaultAgents()` |

### ES Modules 规范

```javascript
// 导入：使用显式路径，必须有 .js 后缀
import { something } from './module.js';

// 导出：命名导出优先
export async function doSomething() { }
export const CONSTANT = 'value';
```

### 函数规范

```javascript
/**
 * 函数说明
 * @param {type} paramName - 参数说明
 * @returns {Promise<type>} 返回值说明
 */
export async function functionName(paramName) {
  // 实现
}
```

### 错误处理

```javascript
try {
  await riskyOperation();
} catch (error) {
  console.error(chalk.red(`✗ 错误: ${error.message}`));
  process.exit(1);
}
```

---

## CLI 规范

### 用户交互颜色

- 成功：`chalk.green('✓ ...')`
- 警告：`chalk.yellow('⚠ ...')`
- 错误：`chalk.red('✗ ...')`
- 信息：`chalk.cyan('...')`
- 次要：`chalk.dim('...')`

### 进度显示

```javascript
console.log(chalk.cyan('\n[1/5] 创建目录结构...'));
// 操作后
console.log(chalk.dim('  ✓ 目录/'));
```

---

## 测试规范

### 测试文件

- 位置：`tests/` 目录
- 命名：`<模块名>.test.js`

### 测试结构

```javascript
describe('模块名', () => {
  it('应该做某事', async () => {
    // 测试
  });
});
```

### 测试覆盖

- 核心逻辑必须有测试
- 错误分支必须有测试
- 边界条件必须有测试