---
name: tdd-workflow
description: TDD 工作流 — 先写测试再写实现，确保代码可验证，要求 80%+ 覆盖率
origin: AI-Engineering
---

# TDD 工作流

## When to Activate

- 新增功能（> 30 行代码）
- 修复 Bug 时先写失败测试
- 重构前先补充测试保护

## 流程

### 第 1 步：理解需求

1. 读取 Plan 或功能描述，明确输入/输出/边界条件
2. 列出需要覆盖的测试用例（正常路径 + 边界 + 异常）

### 第 2 步：写失败测试（Red）

1. 编写测试，描述期望行为
2. 运行测试，确认失败（且失败原因正确）
3. 如果测试没失败 → 测试写错了，回去改

### 第 3 步：写最小实现（Green）

1. 编写刚好让测试通过的代码
2. 不要过度设计，不要预测未来需求
3. 运行测试，确认通过

### 第 4 步：重构（Refactor）

1. 在测试保护下重构代码
2. 每次只做一个小重构
3. 每次重构后运行测试，确认仍然通过
4. 重构内容：提取函数、消除重复、改善命名

## 检查清单

- [ ] 测试覆盖了正常路径
- [ ] 测试覆盖了边界条件
- [ ] 测试覆盖了异常情况
- [ ] 测试命名描述了行为（不是 test_function1）
- [ ] 实现代码是让测试通过的最小改动
- [ ] 重构后所有测试仍然通过
- [ ] 覆盖率达到 80%+

## 禁止

- 不要先写实现再补测试（那是自欺欺人）
- 不要跳过"确认测试失败"这一步
- 不要在一次循环中写多个功能的测试

## 技术栈示例

### Python (pytest)

```python
def test_calculate_total_with_empty_cart_returns_zero():
    result = calculate_total([])
    assert result == 0

def test_calculate_total_with_negative_quantity_raises():
    with pytest.raises(ValueError, match="数量不能为负数"):
        calculate_total([{"price": 10, "qty": -1}])
```

### TypeScript (Jest)

```typescript
describe("calculateTotal", () => {
  it("returns 0 for empty cart", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("throws for negative quantity", () => {
    expect(() => calculateTotal([{price: 10, qty: -1}]))
      .toThrow("数量不能为负数");
  });
});
```

### Go

```go
func TestCalculateTotal_EmptyCart(t *testing.T) {
    got := CalculateTotal([]Item{})
    want := 0.0
    if got != want {
        t.Errorf("got %f, want %f", got, want)
    }
}
```