# /quality Command

> 质量门控 - 提交前/完成前的质量检查

## 功能说明

执行质量门控检查，确保代码达到提交标准。

## 触发时机

- `/quality pre-commit` — 提交前快速检查
- `/quality pre-complete` — 功能完成前完整检查

## 检查项

### pre-commit（快速）
- [ ] 无敏感文件
- [ ] 无硬编码密码
- [ ] TODO 已处理或标记

### pre-complete（完整）
- [ ] 测试覆盖率
- [ ] 错误处理完整性
- [ ] 代码风格一致性
- [ ] 安全检查通过

## 配置 Hook

可配置为 Git Hook 自动触发：

```bash
# 配置 pre-commit hook
./scripts/quality-gate.sh setup-hook
```
