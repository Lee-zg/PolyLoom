import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('React Button', () => {
  it('渲染语义按钮并透传 ref 与原生属性', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="consumer-class" data-track="save">
        保存
      </Button>,
    );

    const button = screen.getByRole('button', { name: '保存' });
    expect(button).toHaveClass('consumer-class');
    expect(button).toHaveAttribute('data-track', 'save');
    expect(button).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(button);
  });

  it('点击时调用消费方处理器', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>提交</Button>);

    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('加载期间阻止交互并暴露忙碌状态', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        处理中
      </Button>,
    );

    const button = screen.getByRole('button', { name: '处理中' });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(handleClick).not.toHaveBeenCalled();
  });
});
